/**
 * JSON formatlash, daraxt generatsiyasi va saralash yadrosi (Core Formatter)
 */

const { colors, colorizePrimitive } = require('./colors');
const { formatBadgeKeys, formatBadgeItems } = require('./i18n');

/**
 * Kalitlarni alifbo tartibida A-Z saralash
 */
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

/**
 * Daraxt (Tree) shaklida terminalga chiqarish
 */
function printTree(data, prefix = '', isLast = true, isRoot = true, key = null, useColor = true, lang = 'uz') {
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
    const badgeText = formatBadgeItems(data.length, lang);
    const badge = ` ${dim}(${badgeText})${reset}`;
    console.log(`${fullPrefix}${keyPart}${brColor}[${reset}${badge}`);
    
    const newPrefix = prefix + (!isRoot ? (isLast ? '    ' : `${bColor}│   ${reset}`) : '');
    data.forEach((item, idx) => {
      const last = idx === data.length - 1;
      printTree(item, newPrefix, last, false, `[${idx}]`, useColor, lang);
    });
    console.log(`${!isRoot ? newPrefix : ''}${brColor}]${reset}`);

  } else if (data !== null && typeof data === 'object') {
    const keys = Object.keys(data);
    const badgeText = formatBadgeKeys(keys.length, lang);
    const badge = ` ${dim}(${badgeText})${reset}`;
    console.log(`${fullPrefix}${keyPart}${brColor}{${reset}${badge}`);
    
    const newPrefix = prefix + (!isRoot ? (isLast ? '    ' : `${bColor}│   ${reset}`) : '');
    keys.forEach((k, idx) => {
      const last = idx === keys.length - 1;
      printTree(data[k], newPrefix, last, false, k, useColor, lang);
    });
    console.log(`${!isRoot ? newPrefix : ''}${brColor}}${reset}`);

  } else {
    console.log(`${fullPrefix}${keyPart}${colorizePrimitive(data, useColor)}`);
  }
}

/**
 * JSON matnini sintaksis bo'yicha ranglash
 */
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

/**
 * JSON xatosining qator va ustunini topish
 */
function parseJsonWithLocation(rawText) {
  try {
    return { data: JSON.parse(rawText), error: null };
  } catch (err) {
    let line = 1;
    let col = 1;
    const lineColMatch = err.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    const posMatch = err.message.match(/position\s+(\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      col = parseInt(lineColMatch[2], 10);
    } else if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = rawText.slice(0, pos).split('\n');
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }
    return {
      data: null,
      error: {
        message: err.message,
        line,
        col
      }
    };
  }
}

module.exports = {
  sortKeys,
  printTree,
  colorizeJsonString,
  parseJsonWithLocation
};
