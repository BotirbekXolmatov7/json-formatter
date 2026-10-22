/**
 * Terminal ranglari (ANSI Escape codes)
 */

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
  error: '\x1b[1;31m',        // Xato
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

function colorizePrimitive(val, useColor = true) {
  if (!useColor) return JSON.stringify(val);
  if (val === null) return `${colors.nullVal}null${colors.reset}`;
  if (typeof val === 'boolean') return `${colors.boolean}${val}${colors.reset}`;
  if (typeof val === 'number') return `${colors.number}${val}${colors.reset}`;
  if (typeof val === 'string') return `${colors.string}${JSON.stringify(val)}${colors.reset}`;
  return String(val);
}

module.exports = {
  colors,
  colorizePrimitive
};
