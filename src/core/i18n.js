/**
 * JSON Formatter & Object Viewer - Ko'p tillilik moduli (i18n)
 * Qo'llab-quvvatlanadigan tillar: uz (O'zbek), en (English), ru (Русский)
 */

const SUPPORTED_LANGS = ['uz', 'en', 'ru'];
const DEFAULT_LANG = 'en';

function detectSystemLang() {
  const envLang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || '';
  if (/^ru/i.test(envLang)) return 'ru';
  if (/^uz/i.test(envLang)) return 'uz';
  return DEFAULT_LANG;
}

function resolveLang(lang) {
  if (!lang) return detectSystemLang();
  const lower = String(lang).toLowerCase().trim();
  return SUPPORTED_LANGS.includes(lower) ? lower : DEFAULT_LANG;
}

function pluralRu(count, one, few, many) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

function formatBadgeKeys(count, lang = DEFAULT_LANG) {
  const l = resolveLang(lang);
  if (l === 'en') {
    return `${count} ${count === 1 ? 'key' : 'keys'}`;
  }
  if (l === 'ru') {
    return `${count} ${pluralRu(count, 'ключ', 'ключа', 'ключей')}`;
  }
  return `${count} ta kalit`;
}

function formatBadgeItems(count, lang = DEFAULT_LANG) {
  const l = resolveLang(lang);
  if (l === 'en') {
    return `${count} ${count === 1 ? 'item' : 'items'}`;
  }
  if (l === 'ru') {
    return `${count} ${pluralRu(count, 'элемент', 'элемента', 'элементов')}`;
  }
  return `${count} ta element`;
}

const cliMessages = {
  uz: {
    title: "JSON Formatter & Object Viewer",
    usage: "Foydalanish:",
    examples: "Misollar:",
    flags: "Bayroqlar (Flags):",
    flagTree: "Obyektni rangli daraxt ko'rinishida chiqarish",
    flagSort: "Kalitlarni alifbo bo'yicha (A-Z) saralash",
    flagMinify: "JSONni bir qatorga siqish",
    flagIndent: "Bo'shliqlar soni (standart: 2)",
    flagLang: "Tilni tanlash (uz, en, ru)",
    flagNoColor: "Ranglarni o'chirish",
    flagVersion: "Versiyani ko'rsatish",
    flagHelp: "Yordam xabarini chiqarish",
    errEmpty: "Xato: Kiritilgan ma'lumot bo'sh.",
    errFileNotFound: "Xato: \"{file}\" fayli topilmadi.",
    errFileRead: "Faylni o'qishda xatolik: {msg}",
    errJsonSyntax: "⚠️ JSON sintaksis xatosi:",
    lineCol: "Qator: {line}, Ustun: {col}"
  },
  en: {
    title: "JSON Formatter & Object Viewer",
    usage: "Usage:",
    examples: "Examples:",
    flags: "Flags:",
    flagTree: "Display object as a colored tree",
    flagSort: "Sort keys alphabetically (A-Z)",
    flagMinify: "Minify JSON into a single line",
    flagIndent: "Indentation spaces (default: 2)",
    flagLang: "Select language (uz, en, ru)",
    flagNoColor: "Disable colors",
    flagVersion: "Show version",
    flagHelp: "Show help message",
    errEmpty: "Error: Input data is empty.",
    errFileNotFound: "Error: File \"{file}\" not found.",
    errFileRead: "Error reading file: {msg}",
    errJsonSyntax: "⚠️ JSON syntax error:",
    lineCol: "Line: {line}, Column: {col}"
  },
  ru: {
    title: "JSON Formatter & Object Viewer",
    usage: "Использование:",
    examples: "Примеры:",
    flags: "Флаги:",
    flagTree: "Вывести объект в виде цветного дерева",
    flagSort: "Сортировать ключи по алфавиту (А-Я)",
    flagMinify: "Сжать JSON в одну строку",
    flagIndent: "Количество пробелов для отступа (по умолчанию: 2)",
    flagLang: "Выбор языка (uz, en, ru)",
    flagNoColor: "Отключить цвета",
    flagVersion: "Показать версию",
    flagHelp: "Показать справку",
    errEmpty: "Ошибка: Входные данные пусты.",
    errFileNotFound: "Ошибка: Файл \"{file}\" не найден.",
    errFileRead: "Ошибка при чтении файла: {msg}",
    errJsonSyntax: "⚠️ Ошибка синтаксиса JSON:",
    lineCol: "Строка: {line}, Колонка: {col}"
  }
};

function getCliText(key, lang = DEFAULT_LANG, params = {}) {
  const l = resolveLang(lang);
  let text = (cliMessages[l] && cliMessages[l][key]) || cliMessages.uz[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return text;
}

module.exports = {
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  resolveLang,
  formatBadgeKeys,
  formatBadgeItems,
  getCliText
};
