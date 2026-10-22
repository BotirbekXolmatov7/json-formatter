#!/usr/bin/env node

/**
 * JSON Formatter & Object Viewer - Node.js CLI vositasi
 * Foydalanish:
 *   json-fmt '{"ism": "Ali", "yosh": 25}' --tree
 *   json-fmt fayl.json --lang ru
 *   cat fayl.json | json-fmt --tree
 */

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const { colors } = require('../src/core/colors');
const { sortKeys, printTree, colorizeJsonString, parseJsonWithLocation } = require('../src/core/formatter');
const { getCliText, resolveLang } = require('../src/core/i18n');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: null,
    tree: false,
    sort: false,
    minify: false,
    indent: 2,
    noColor: false,
    help: false,
    version: false,
    lang: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--tree' || arg === '-t') {
      options.tree = true;
    } else if (arg === '--sort' || arg === '-s') {
      options.sort = true;
    } else if (arg === '--minify' || arg === '-m') {
      options.minify = true;
    } else if (arg === '--no-color') {
      options.noColor = true;
    } else if (arg === '-i' || arg === '--indent') {
      options.indent = parseInt(args[++i], 10) || 2;
    } else if (arg === '-l' || arg === '--lang') {
      options.lang = args[++i];
    } else if (arg.startsWith('--lang=')) {
      options.lang = arg.split('=')[1];
    } else if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--version') {
      options.version = true;
    } else if (!arg.startsWith('-') && !options.source) {
      options.source = arg;
    }
  }
  return options;
}

function printHelp(lang = 'uz') {
  const l = resolveLang(lang);
  if (l === 'en') {
    console.log(`
${colors.bold}JSON Formatter & Object Viewer (v${pkg.version})${colors.reset}

Usage:
  json-fmt '<JSON_STRING>' [flags]
  json-fmt <filename.json> [flags]
  cat file.json | json-fmt [flags]

Examples:
  json-fmt '{"name": "Alex", "age": 25}' --tree
  json-fmt samples/namuna.json
  json-fmt samples/namuna.json --sort
  cat samples/namuna.json | json-fmt --tree

Flags:
  -t, --tree       Display object as a colored tree
  -s, --sort       Sort keys alphabetically (A-Z)
  -m, --minify     Minify JSON into a single line
  -i, --indent     Indentation spaces (default: 2)
  -l, --lang       Language (uz, en, ru)
  --no-color       Disable colors
  -v, --version    Show version
  -h, --help       Show help message
`);
  } else if (l === 'ru') {
    console.log(`
${colors.bold}JSON Formatter & Object Viewer (v${pkg.version})${colors.reset}

Использование:
  json-fmt '<JSON_СТРОКА>' [флаги]
  json-fmt <файл.json> [флаги]
  cat файл.json | json-fmt [флаги]

Примеры:
  json-fmt '{"name": "Алексей", "age": 25}' --tree
  json-fmt samples/namuna.json
  json-fmt samples/namuna.json --sort
  cat samples/namuna.json | json-fmt --tree

Флаги:
  -t, --tree       Вывести объект в виде цветного дерева
  -s, --sort       Сортировать ключи по алфавиту (А-Я)
  -m, --minify     Сжать JSON в одну строку
  -i, --indent     Количество пробелов для отступа (по умолчанию: 2)
  -l, --lang       Выбор языка (uz, en, ru)
  --no-color       Отключить цвета
  -v, --version    Показать версию
  -h, --help       Показать справку
`);
  } else {
    console.log(`
${colors.bold}JSON Formatter & Object Viewer (v${pkg.version})${colors.reset}

Foydalanish:
  json-fmt '<JSON_MATN>' [bayroqlar]
  json-fmt <fayl_nomi.json> [bayroqlar]
  cat fayl.json | json-fmt [bayroqlar]

Misollar:
  json-fmt '{"ism": "Ali", "yosh": 25}' --tree
  json-fmt samples/namuna.json
  json-fmt samples/namuna.json --sort
  cat samples/namuna.json | json-fmt --tree

Bayroqlar (Flags):
  -t, --tree       Obyektni rangli daraxt ko'rinishida chiqarish
  -s, --sort       Kalitlarni alifbo bo'yicha (A-Z) saralash
  -m, --minify     JSONni bir qatorga siqish
  -i, --indent     Bo'shliqlar soni (standart: 2)
  -l, --lang       Tilni tanlash (uz, en, ru)
  --no-color       Ranglarni o'chirish
  -v, --version    Versiyani ko'rsatish
  -h, --help       Yordam xabarini chiqarish
`);
  }
}

function run() {
  const options = parseArgs();
  const lang = resolveLang(options.lang);

  if (options.version) {
    console.log(`v${pkg.version}`);
    process.exit(0);
  }

  if (options.help) {
    printHelp(lang);
    process.exit(0);
  }

  const useColor = !options.noColor && process.stdout.isTTY;

  function processJson(rawText) {
    rawText = rawText.trim();
    if (!rawText) {
      console.error(`${colors.error}${getCliText('errEmpty', lang)}${colors.reset}`);
      process.exit(1);
    }

    const { data, error } = parseJsonWithLocation(rawText);
    if (error) {
      console.error(`${colors.error}${getCliText('errJsonSyntax', lang)}${colors.reset} ${error.message}`);
      console.error(getCliText('lineCol', lang, { line: error.line, col: error.col }));
      process.exit(1);
    }

    let parsed = data;
    if (options.sort) {
      parsed = sortKeys(parsed);
    }

    if (options.tree) {
      printTree(parsed, '', true, true, null, useColor, lang);
    } else if (options.minify) {
      console.log(JSON.stringify(parsed));
    } else {
      const formatted = JSON.stringify(parsed, null, options.indent);
      if (useColor) {
        console.log(colorizeJsonString(formatted));
      } else {
        console.log(formatted);
      }
    }
  }

  // 1. Agar argument berilgan bo'lsa
  if (options.source) {
    let filePath = options.source;
    if (!fs.existsSync(filePath)) {
      // samples/ papkasidan ham qidirish
      const sampleCandidate = path.join(__dirname, '..', 'samples', options.source);
      const cwdSampleCandidate = path.join(process.cwd(), 'samples', options.source);
      if (fs.existsSync(sampleCandidate)) {
        filePath = sampleCandidate;
      } else if (fs.existsSync(cwdSampleCandidate)) {
        filePath = cwdSampleCandidate;
      }
    }

    if (fs.existsSync(filePath)) {
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const content = fs.readFileSync(filePath, 'utf-8');
          processJson(content);
          return;
        }
      } catch (err) {
        console.error(`${colors.error}${getCliText('errFileRead', lang, { msg: err.message })}${colors.reset}`);
        process.exit(1);
      }
    }

    // Agar fayl nomi .json bilan tugasa, lekin topilmasa
    if (options.source.endsWith('.json')) {
      console.error(`${colors.error}${getCliText('errFileNotFound', lang, { file: options.source })}${colors.reset}`);
      process.exit(1);
    }

    processJson(options.source);
  } 
  // 2. Agar Stdin / Pipe orqali kelsa (masalan: cat file.json | json-fmt)
  else if (!process.stdin.isTTY) {
    let input = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => { processJson(input); });
  } 
  // 3. Hech narsa berilmasa yordam chiqarish
  else {
    printHelp(lang);
    process.exit(0);
  }
}

run();
