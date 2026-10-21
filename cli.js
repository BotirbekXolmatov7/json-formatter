#!/usr/bin/env node

/**
 * JSON Formatter & Object Viewer - Node.js CLI vositasi
 * Foydalanish:
 *   node cli.js '{"ism": "Ali", "yosh": 25}' --tree
 *   node cli.js fayl.json
 *   cat fayl.json | node cli.js --tree
 */

const fs = require('fs');
const path = require('path');

// Terminal uchun ANSI ranglar
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  key: '\x1b[38;5;75m',       // Och moviy
  string: '\x1b[38;5;114m',   // Yashil
  number: '\x1b[38;5;221m',   // Oltin/sariq
  boolean: '\x1b[38;5;177m',  // Binafsha
  nullVal: '\x1b[38;5;203m',  // Qizil
  bracket: '\x1b[38;5;246m',  // Kulrang
  branch: '\x1b[38;5;240m',   // Shoxlar
  error: '\x1b[1;31m'         // Xato
};

// Qiymatlarni bo'yash
function colorizePrimitive(val, useColor = true) {
  if (!useColor) return JSON.stringify(val);
  if (val === null) return `${colors.nullVal}null${colors.reset}`;
  if (typeof val === 'boolean') return `${colors.boolean}${val}${colors.reset}`;
  if (typeof val === 'number') return `${colors.number}${val}${colors.reset}`;
  if (typeof val === 'string') return `${colors.string}${JSON.stringify(val)}${colors.reset}`;
  return String(val);
}

// Daraxt (Tree) shaklida chiqarish
function printTree(data, prefix = '', isLast = true, isRoot = true, key = null, useColor = true) {
  const bColor = useColor ? colors.branch : '';
  const kColor = useColor ? colors.key : '';
  const brColor = useColor ? colors.bracket : '';
  const reset = useColor ? colors.reset : '';
  const dim = useColor ? colors.dim : '';

  let branch = '';
  if (!isRoot) {
    branch = `${bColor}${isLast ? '└── ' : '├── '}${reset}`;
  }

  const fullPrefix = prefix + branch;
  let keyPart = '';
  if (key !== null) {
    keyPart = `${kColor}"${key}"${reset}: `;
  }

  if (Array.isArray(data)) {
    const badge = ` ${dim}(${data.length} ta element)${reset}`;
    console.log(`${fullPrefix}${keyPart}${brColor}[${reset}${badge}`);
    
    const newPrefix = prefix + (!isRoot ? (isLast ? '    ' : `${bColor}│   ${reset}`) : '');
    data.forEach((item, idx) => {
      const last = idx === data.length - 1;
      printTree(item, newPrefix, last, false, `[${idx}]`, useColor);
    });
    console.log(`${!isRoot ? newPrefix : ''}${brColor}]${reset}`);

  } else if (data !== null && typeof data === 'object') {
    const keys = Object.keys(data);
    const badge = ` ${dim}(${keys.length} ta kalit)${reset}`;
    console.log(`${fullPrefix}${keyPart}${brColor}{${reset}${badge}`);
    
    const newPrefix = prefix + (!isRoot ? (isLast ? '    ' : `${bColor}│   ${reset}`) : '');
    keys.forEach((k, idx) => {
      const last = idx === keys.length - 1;
      printTree(data[k], newPrefix, last, false, k, useColor);
    });
    console.log(`${!isRoot ? newPrefix : ''}${brColor}}${reset}`);

  } else {
    console.log(`${fullPrefix}${keyPart}${colorizePrimitive(data, useColor)}`);
  }
}

// Kalitlarni A-Z saralash
function sortKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce((res, k) => {
        res[k] = sortKeys(obj[k]);
        return res;
      }, {});
  }
  return obj;
}

// JSON matnini bo'yash
function colorizeJsonString(jsonStr) {
  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `${colors.key}${match}${colors.reset}`;
        }
        return `${colors.string}${match}${colors.reset}`;
      }
      if (/true|false/.test(match)) return `${colors.boolean}${match}${colors.reset}`;
      if (/null/.test(match)) return `${colors.nullVal}${match}${colors.reset}`;
      return `${colors.number}${match}${colors.reset}`;
    }
  );
}

// Argumentlarni o'qish
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: null,
    tree: false,
    sort: false,
    minify: false,
    indent: 2,
    noColor: false
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
    } else if (!arg.startsWith('-') && !options.source) {
      options.source = arg;
    }
  }
  return options;
}

// Asosiy dastur
function run() {
  const options = parseArgs();
  const useColor = !options.noColor && process.stdout.isTTY;

  function processJson(rawText) {
    rawText = rawText.trim();
    if (!rawText) {
      console.error(`${colors.error}Xato:${colors.reset} Kiritilgan ma'lumot bo'sh.`);
      process.exit(1);
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error(`${colors.error}⚠️ JSON xatosi:${colors.reset} ${err.message}`);
      
      // Xato pozitsiyasini ko'rsatish
      const posMatch = err.message.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const lines = rawText.slice(0, pos).split('\n');
        const lineNum = lines.length;
        const colNum = lines[lines.length - 1].length + 1;
        console.error(`Qator: ${lineNum}, Ustun: ${colNum}`);
      }
      process.exit(1);
    }

    if (options.sort) {
      parsed = sortKeys(parsed);
    }

    if (options.tree) {
      printTree(parsed, '', true, true, null, useColor);
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
    if (fs.existsSync(options.source)) {
      const content = fs.readFileSync(options.source, 'utf-8');
      processJson(content);
    } else {
      processJson(options.source);
    }
  } 
  // 2. Agar Stdin / Pipe orqali kelsa (masalan: cat file.json | node cli.js)
  else if (!process.stdin.isTTY) {
    let input = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => { processJson(input); });
  } 
  // 3. Hech narsa berilmasa yordam chiqarish
  else {
    console.log(`
${colors.bold}JSON Formatter & Object Viewer (Node.js)${colors.reset}

Foydalanish:
  node cli.js '{"nomi": "Ali", "yosh": 25}' --tree
  node cli.js fayl.json
  node cli.js fayl.json --sort
  cat fayl.json | node cli.js --tree

Bayroqlar (Flags):
  -t, --tree       Obyektni daraxt ko'rinishida chiqarish
  -s, --sort       Kalitlarni alifbo bo'yicha saralash
  -m, --minify     JSONni bir qatorga siqish
  -i, --indent     Bo'shliqlar soni (standart: 2)
  --no-color       Ranglarni o'chirish
`);
    process.exit(0);
  }
}

run();
