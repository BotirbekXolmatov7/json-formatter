#!/usr/bin/env node

/**
 * JSON Formatter & Object Viewer - Avtomatlashtirilgan Testlar
 */

const assert = require('assert');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const { sortKeys, parseJsonWithLocation, colorizeJsonString } = require('../src/core/formatter');
const { createServer } = require('../src/server');
const { resolveLang, formatBadgeKeys, formatBadgeItems, getCliText } = require('../src/core/i18n');
const { i18n } = require('../public/js/core/i18n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    failedTests++;
  }
}

async function main() {
  console.log('🧪 Testlar boshlanmoqda...\n');

  // 1. Core Formatter Testlari
  console.log('--- 1. Yadro (Core Formatter) Testlari ---');
  runTest('sortKeys obyektdagi kalitlarni alifbo bo\'yicha saralashi kerak', () => {
    const input = { z: 1, a: 2, m: { y: 10, b: 20 } };
    const sorted = sortKeys(input);
    const keys = Object.keys(sorted);
    assert.deepStrictEqual(keys, ['a', 'm', 'z']);
    assert.deepStrictEqual(Object.keys(sorted.m), ['b', 'y']);
  });

  runTest('parseJsonWithLocation to\'g\'ri JSONni muvaffaqiyatli o\'qishi kerak', () => {
    const res = parseJsonWithLocation('{"ism": "Ali", "yosh": 25}');
    assert.strictEqual(res.error, null);
    assert.strictEqual(res.data.ism, 'Ali');
    assert.strictEqual(res.data.yosh, 25);
  });

  runTest('parseJsonWithLocation xato JSONda qator va ustunni aniqlashi kerak', () => {
    const res = parseJsonWithLocation('{\n  "ism": "Ali",\n}');
    assert.notStrictEqual(res.error, null);
    assert.strictEqual(typeof res.error.line, 'number');
    assert.strictEqual(typeof res.error.col, 'number');
  });

  runTest('colorizeJsonString ANSI ranglarni to\'g\'ri qo\'shishi kerak', () => {
    const colored = colorizeJsonString('{"active": true, "count": 10}');
    assert.ok(colored.includes('\x1b['));
  });

  // 2. CLI va Tillarni Qo'llab-quvvatlash Testlari
  console.log('\n--- 2. CLI vositasi va Ko\'p Tillilik (i18n) Testlari ---');
  runTest('CLI yordam xabari uz, en, ru tillarida to\'g\'ri chiqishi kerak', () => {
    const outUz = execSync('node cli.js --lang=uz --help', { encoding: 'utf-8' });
    assert.ok(outUz.includes('Foydalanish:'));
    assert.ok(outUz.includes('Bayroqlar'));

    const outEn = execSync('node cli.js --lang=en --help', { encoding: 'utf-8' });
    assert.ok(outEn.includes('Usage:'));
    assert.ok(outEn.includes('Flags:'));

    const outRu = execSync('node cli.js --lang=ru --help', { encoding: 'utf-8' });
    assert.ok(outRu.includes('Использование:'));
    assert.ok(outRu.includes('Флаги:'));
  });

  runTest('CLI tree view uz, en, ru tillarida mos nishonlar chiqarishi kerak', () => {
    const outUz = execSync('node cli.js \'{"a":1, "b":2}\' --tree --lang=uz', { encoding: 'utf-8' });
    assert.ok(outUz.includes('2 ta kalit'));

    const outEn = execSync('node cli.js \'{"a":1, "b":2}\' --tree --lang=en', { encoding: 'utf-8' });
    assert.ok(outEn.includes('2 keys'));

    const outRu = execSync('node cli.js \'{"a":1, "b":2}\' --tree --lang=ru', { encoding: 'utf-8' });
    assert.ok(outRu.includes('2 ключа'));
  });

  runTest('CLI xatolik xabarlari ko\'rsatilgan tilda chiqishi kerak', () => {
    try {
      execSync('node cli.js missing_file.json --lang=ru', { encoding: 'utf-8', stdio: 'pipe' });
      assert.fail('Xato berishi kerak edi');
    } catch (e) {
      assert.ok(e.stderr.includes('не найден'));
    }

    try {
      execSync('node cli.js missing_file.json --lang=en', { encoding: 'utf-8', stdio: 'pipe' });
      assert.fail('Xato berishi kerak edi');
    } catch (e) {
      assert.ok(e.stderr.includes('not found'));
    }
  });

  runTest('node cli.js namuna.json faylni avtomatik topib formatlashi kerak', () => {
    const out = execSync('node cli.js namuna.json', { encoding: 'utf-8' });
    const parsed = JSON.parse(out);
    assert.strictEqual(parsed.loyiha, 'JSON Formatter & Object Viewer');
  });

  // 3. Web Server & Static Handler Testlari
  console.log('\n--- 3. HTTP Server & Static Handler Testlari ---');
  await runAsyncTest('Server statik fayllarni (HTML, CSS, JS, i18n) 200 bilan qaytarishi kerak', async () => {
    const testPort = 3998;
    const server = createServer();

    await new Promise((resolve) => server.listen(testPort, resolve));

    try {
      const get = (urlPath) => new Promise((resolve, reject) => {
        http.get(`http://localhost:${testPort}${urlPath}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        }).on('error', reject);
      });

      // 1. Home
      const home = await get('/');
      assert.strictEqual(home.statusCode, 200);
      assert.ok(home.body.includes('JSON Formatter'));
      assert.ok(home.body.includes('langSelect'));

      // 2. i18n JS
      const i18nRes = await get('/js/core/i18n.js');
      assert.strictEqual(i18nRes.statusCode, 200);
      assert.ok(i18nRes.body.includes('dictionaries'));

      // 3. CSS
      const css = await get('/css/style.css');
      assert.strictEqual(css.statusCode, 200);
      assert.ok(css.headers['content-type'].includes('text/css'));

      // 4. JS
      const js = await get('/js/app.js');
      assert.strictEqual(js.statusCode, 200);
      assert.ok(js.headers['content-type'].includes('javascript'));

      // 5. 404
      const notFound = await get('/non-existent-page-xyz.html');
      assert.strictEqual(notFound.statusCode, 404);

      // 6. Path Traversal Himoyasi (Security test)
      const traversal = await get('/../../package.json');
      assert.ok(traversal.statusCode === 403 || traversal.statusCode === 404);
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  });

  // 4. Frontend View va i18n Lug'at Testlari
  console.log('\n--- 4. Frontend View va Lug\'at Testlari ---');
  runTest('i18n lug\'atlari (uz, en, ru) to\'liq va bir xil kalitlarga ega bo\'lishi kerak', () => {
    const uzKeys = Object.keys(i18n.dictionaries.uz).sort();
    const enKeys = Object.keys(i18n.dictionaries.en).sort();
    const ruKeys = Object.keys(i18n.dictionaries.ru).sort();

    assert.deepStrictEqual(enKeys, uzKeys, 'EN va UZ kalitlari mos kelishi kerak');
    assert.deepStrictEqual(ruKeys, uzKeys, 'RU va UZ kalitlari mos kelishi kerak');
  });

  runTest('codeView.syntaxHighlight matndagi qo\'shtirnoqlarni to\'g\'ri saqlab bo\'yashi kerak', () => {
    const { codeView } = require('../public/js/views/code-view');
    const input = JSON.stringify({ ism: "Ali", yosh: 25 }, null, 2);
    const highlighted = codeView.syntaxHighlight(input);
    assert.ok(!highlighted.includes('&quot;'));
    assert.ok(highlighted.includes('<span class="tree-key">"ism":</span>'));
    assert.ok(highlighted.includes('<span class="val-string">"Ali"</span>'));
    assert.ok(highlighted.includes('<span class="val-number">25</span>'));
  });

  // Yakuniy natija
  console.log('\n' + '='.repeat(45));
  console.log(`📊 Test natijalari: ${passedTests} o'tdi, ${failedTests} xato.`);
  console.log('='.repeat(45));

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Testlarni bajarishda kutilmagan xatolik:', err);
  process.exit(1);
});
