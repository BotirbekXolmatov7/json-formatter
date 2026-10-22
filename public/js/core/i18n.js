/**
 * JSON Formatter & Object Viewer - Frontend Ko'p tillilik (i18n) Moduli
 * Qo'llab-quvvatlanadi: uz, en, ru
 */

const rootScope = typeof window !== 'undefined' ? window : global;
rootScope.JSONViewer = rootScope.JSONViewer || {};

rootScope.JSONViewer.i18n = (function() {
  const SUPPORTED_LANGS = ['en', 'uz', 'ru'];
  const DEFAULT_LANG = 'en';

  function pluralRu(count, one, few, many) {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  const dictionaries = {
    uz: {
      title: "JSON Formatter",
      subtitle: "Oddiy & Interaktiv Object Ko'rinishi",
      langLabel: "Til:",
      sampleLabel: "Namuna:",
      chooseSample: "Namuna tanlang...",
      sampleUser: "Foydalanuvchi ma'lumoti",
      sampleEcommerce: "Mahsulotlar katalogi",
      sampleNested: "Murakkab ichma-ich object",
      indentLabel: "Bo'shliq:",
      indentTwo: "2 ta bo'shliq",
      indentFour: "4 ta bo'shliq",
      indentTab: "Tab",
      btnSort: "Saralash",
      btnSortTitle: "Kalitlarni alifbo bo'yicha saralash",
      themeToggleTitle: "Mavzuni almashtirish",
      inputPanelTitle: "Xom JSON Kiritish",
      btnUploadFile: "Fayl yuklash",
      btnUploadFileTitle: "JSON fayl yuklash",
      btnPaste: "Qo'yish",
      btnPasteTitle: "Vaqtinchalik xotiradan qo'yish",
      btnClear: "Tozalash",
      btnClearTitle: "Tozalash",
      jsonInputPlaceholder: "Bu yerga JSON matnini kiriting yoki fayl tashlang...\nMasalan: { \"ism\": \"Ali\", \"yosh\": 25, \"faol\": true }",
      errorHeader: "JSON Xatosi",
      charCount: "{count} belgi",
      lineCount: "{count} qator",
      btnMinify: "Siqish (Minify)",
      btnMinifyTitle: "Barcha bo'shliqlarni olib tashlash (siqish)",
      btnFormat: "Formatlash",
      btnFormatTitle: "JSONni chiroyli formatlash (Ctrl+Enter)",
      tabTree: "Object Ko'rinishi (Daraxt)",
      tabCode: "Formatlangan Matn",
      tabTable: "Jadval Ko'rinishi",
      btnCopy: "Nusxalash",
      btnCopyTitle: "Natijani nusxalash",
      btnDownload: "Yuklash",
      btnDownloadTitle: ".json fayl sifatida yuklab olish",
      searchPlaceholder: "Kalit yoki qiymat bo'yicha qidiruv...",
      btnExpandAll: "Barchasini ochish",
      btnExpandAllTitle: "Barchasini ochish",
      btnCollapseAll: "Barchasini yopish",
      btnCollapseAllTitle: "Barchasini yopish",
      emptyTreeText: "Formatlash uchun chap panelga JSON kiriting va <strong>Formatlash</strong> tugmasini bosing",
      codePlaceholder: "// Formatlangan JSON shu yerda ko'rinadi",
      emptyTableTitle: "Jadval ko'rinishi faqat <strong>Obyektlar ro'yxati (Array of Objects)</strong> uchun ishlaydi.",
      emptyTableHint: "Masalan: <code>[{ \"id\": 1, \"ism\": \"Ali\" }, { \"id\": 2, \"ism\": \"Vali\" }]</code>",
      btnPath: "Yo'l",
      btnPathTitle: "Yo'lni nusxalash: {path}",
      btnCopyVal: "Nusxa",
      btnCopyValTitle: "Qiymatni nusxalash",
      badgeKeys: (n) => `${n} ta kalit`,
      badgeItems: (n) => `${n} ta element`,
      statusWaiting: "Kutilmoqda",
      statusValid: "To'g'ri JSON",
      statusInvalid: "Xato JSON",
      statusEmpty: "Bo'sh",
      statSize: "Hajmi:",
      statKeys: "Kalitlar:",
      statDepth: "Chuqurlik:",
      toastCopied: "Formatlangan JSON nusxalandi!",
      toastPathCopied: "Yo'l nusxalandi: {path}",
      toastValCopied: "Qiymat nusxalandi!",
      toastMinified: "JSON muvaffaqiyatli siqildi (Minified)!",
      toastCleared: "Maydon tozalandi",
      toastPasted: "Vaqtinchalik xotiradan qo'yildi",
      toastPasteError: "Xotiradan o'qish uchun ruxsat berilmadi",
      toastCopyError: "Nusxalashda xatolik yuz berdi",
      toastFileLoaded: "\"{name}\" fayli muvaffaqiyatli yuklandi",
      toastDownloadEmpty: "Yuklash uchun ma'lumot mavjud emas",
      toastDownloaded: "Fayl yuklab olindi",
      toastSortedOn: "Kalitlar saralandi (A-Z)",
      toastSortedOff: "Saralash bekor qilindi",
      toastEnterJson: "Iltimos, formatlash uchun JSON matn kiriting",
      errorLineCol: "(Qator: {line}, Ustun: {col})"
    },

    en: {
      title: "JSON Formatter",
      subtitle: "Simple & Interactive Object Viewer",
      langLabel: "Language:",
      sampleLabel: "Sample:",
      chooseSample: "Choose sample...",
      sampleUser: "User Profile",
      sampleEcommerce: "Product Catalog",
      sampleNested: "Nested Complex Object",
      indentLabel: "Indent:",
      indentTwo: "2 spaces",
      indentFour: "4 spaces",
      indentTab: "Tab",
      btnSort: "Sort",
      btnSortTitle: "Sort keys alphabetically (A-Z)",
      themeToggleTitle: "Toggle theme",
      inputPanelTitle: "Raw JSON Input",
      btnUploadFile: "Upload file",
      btnUploadFileTitle: "Upload JSON file",
      btnPaste: "Paste",
      btnPasteTitle: "Paste from clipboard",
      btnClear: "Clear",
      btnClearTitle: "Clear",
      jsonInputPlaceholder: "Enter JSON text here or drop a file...\nFor example: { \"name\": \"Alex\", \"age\": 25, \"active\": true }",
      errorHeader: "JSON Error",
      charCount: "{count} chars",
      lineCount: "{count} lines",
      btnMinify: "Minify",
      btnMinifyTitle: "Remove all whitespace (minify)",
      btnFormat: "Format",
      btnFormatTitle: "Format JSON beautifully (Ctrl+Enter)",
      tabTree: "Object View (Tree)",
      tabCode: "Formatted Text",
      tabTable: "Table View",
      btnCopy: "Copy",
      btnCopyTitle: "Copy result",
      btnDownload: "Download",
      btnDownloadTitle: "Download as .json file",
      searchPlaceholder: "Search by key or value...",
      btnExpandAll: "Expand all",
      btnExpandAllTitle: "Expand all",
      btnCollapseAll: "Collapse all",
      btnCollapseAllTitle: "Collapse all",
      emptyTreeText: "Enter JSON into the left panel and click <strong>Format</strong>",
      codePlaceholder: "// Formatted JSON will appear here",
      emptyTableTitle: "Table view only works for an <strong>Array of Objects</strong>.",
      emptyTableHint: "Example: <code>[{ \"id\": 1, \"name\": \"Alex\" }, { \"id\": 2, \"name\": \"Sam\" }]</code>",
      btnPath: "Path",
      btnPathTitle: "Copy path: {path}",
      btnCopyVal: "Copy",
      btnCopyValTitle: "Copy value",
      badgeKeys: (n) => `${n} ${n === 1 ? 'key' : 'keys'}`,
      badgeItems: (n) => `${n} ${n === 1 ? 'item' : 'items'}`,
      statusWaiting: "Waiting",
      statusValid: "Valid JSON",
      statusInvalid: "Invalid JSON",
      statusEmpty: "Empty",
      statSize: "Size:",
      statKeys: "Keys:",
      statDepth: "Depth:",
      toastCopied: "Formatted JSON copied!",
      toastPathCopied: "Path copied: {path}",
      toastValCopied: "Value copied!",
      toastMinified: "JSON successfully minified!",
      toastCleared: "Input cleared",
      toastPasted: "Pasted from clipboard",
      toastPasteError: "Clipboard access denied",
      toastCopyError: "Failed to copy",
      toastFileLoaded: "\"{name}\" loaded successfully",
      toastDownloadEmpty: "No data available to download",
      toastDownloaded: "File downloaded",
      toastSortedOn: "Keys sorted (A-Z)",
      toastSortedOff: "Sorting disabled",
      toastEnterJson: "Please enter JSON text to format",
      errorLineCol: "(Line: {line}, Column: {col})"
    },

    ru: {
      title: "JSON Formatter",
      subtitle: "Простой и интерактивный просмотр объектов",
      langLabel: "Язык:",
      sampleLabel: "Пример:",
      chooseSample: "Выберите пример...",
      sampleUser: "Профиль пользователя",
      sampleEcommerce: "Каталог товаров",
      sampleNested: "Сложный вложенный объект",
      indentLabel: "Отступ:",
      indentTwo: "2 пробела",
      indentFour: "4 пробела",
      indentTab: "Таб",
      btnSort: "Сортировка",
      btnSortTitle: "Сортировать ключи по алфавиту (А-Я)",
      themeToggleTitle: "Сменить тему",
      inputPanelTitle: "Исходный JSON",
      btnUploadFile: "Загрузить файл",
      btnUploadFileTitle: "Загрузить JSON файл",
      btnPaste: "Вставить",
      btnPasteTitle: "Вставить из буфера обмена",
      btnClear: "Очистить",
      btnClearTitle: "Очистить",
      jsonInputPlaceholder: "Введите JSON текст сюда или перетащите файл...\nНапример: { \"name\": \"Алексей\", \"age\": 25, \"active\": true }",
      errorHeader: "Ошибка JSON",
      charCount: "{count} символов",
      lineCount: "{count} строк",
      btnMinify: "Сжать (Minify)",
      btnMinifyTitle: "Удалить все пробелы (сжать)",
      btnFormat: "Форматировать",
      btnFormatTitle: "Красиво отформатировать JSON (Ctrl+Enter)",
      tabTree: "Дерево объектов",
      tabCode: "Форматированный текст",
      tabTable: "Таблица",
      btnCopy: "Копировать",
      btnCopyTitle: "Копировать результат",
      btnDownload: "Скачать",
      btnDownloadTitle: "Скачать как .json файл",
      searchPlaceholder: "Поиск по ключу или значению...",
      btnExpandAll: "Развернуть все",
      btnExpandAllTitle: "Развернуть все",
      btnCollapseAll: "Свернуть все",
      btnCollapseAllTitle: "Свернуть все",
      emptyTreeText: "Введите JSON в левую панель и нажмите <strong>Форматировать</strong>",
      codePlaceholder: "// Отформатированный JSON появится здесь",
      emptyTableTitle: "Табличный вид работает только для <strong>Массива объектов (Array of Objects)</strong>.",
      emptyTableHint: "Например: <code>[{ \"id\": 1, \"name\": \"Алексей\" }, { \"id\": 2, \"name\": \"Иван\" }]</code>",
      btnPath: "Путь",
      btnPathTitle: "Скопировать путь: {path}",
      btnCopyVal: "Копия",
      btnCopyValTitle: "Скопировать значение",
      badgeKeys: (n) => {
        const mod10 = n % 10, mod100 = n % 100;
        let word = 'ключей';
        if (mod10 === 1 && mod100 !== 11) word = 'ключ';
        else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = 'ключа';
        return `${n} ${word}`;
      },
      badgeItems: (n) => {
        const mod10 = n % 10, mod100 = n % 100;
        let word = 'элементов';
        if (mod10 === 1 && mod100 !== 11) word = 'элемент';
        else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = 'элемента';
        return `${n} ${word}`;
      },
      statusWaiting: "Ожидание",
      statusValid: "Корректный JSON",
      statusInvalid: "Неверный JSON",
      statusEmpty: "Пусто",
      statSize: "Размер:",
      statKeys: "Ключи:",
      statDepth: "Глубина:",
      toastCopied: "Форматированный JSON скопирован!",
      toastPathCopied: "Путь скопирован: {path}",
      toastValCopied: "Значение скопировано!",
      toastMinified: "JSON успешно сжат!",
      toastCleared: "Поле очищено",
      toastPasted: "Вставлено из буфера обмена",
      toastPasteError: "Доступ к буферу обмена запрещен",
      toastCopyError: "Ошибка при копировании",
      toastFileLoaded: "Файл \"{name}\" успешно загружен",
      toastDownloadEmpty: "Нет данных для скачивания",
      toastDownloaded: "Файл скачан",
      toastSortedOn: "Ключи отсортированы (А-Я)",
      toastSortedOff: "Сортировка отменена",
      toastEnterJson: "Пожалуйста, введите JSON для форматирования",
      errorLineCol: "(Строка: {line}, Колонка: {col})"
    }
  };

  let currentLang = DEFAULT_LANG;

  function initLang() {
    let saved = null;
    try {
      saved = localStorage.getItem('json_viewer_lang');
    } catch (e) {}

    if (saved && SUPPORTED_LANGS.includes(saved)) {
      currentLang = saved;
      return currentLang;
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      const nav = navigator.language.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(nav)) {
        currentLang = nav;
        return currentLang;
      }
    }

    currentLang = DEFAULT_LANG;
    return currentLang;
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return currentLang;
    currentLang = lang;
    try {
      localStorage.setItem('json_viewer_lang', lang);
    } catch (e) {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    return currentLang;
  }

  function getLanguage() {
    return currentLang;
  }

  function t(key, params = {}) {
    const dict = dictionaries[currentLang] || dictionaries.en || dictionaries.uz;
    let val = dict[key] !== undefined ? dict[key] : (dictionaries.en[key] !== undefined ? dictionaries.en[key] : (dictionaries.uz[key] !== undefined ? dictionaries.uz[key] : key));
    if (typeof val === 'function') {
      return val(params.count !== undefined ? params.count : params.n);
    }
    if (typeof val === 'string') {
      for (const [k, v] of Object.entries(params)) {
        val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
    }
    return val;
  }

  function badgeKeys(count) {
    const dict = dictionaries[currentLang] || dictionaries.en || dictionaries.uz;
    return dict.badgeKeys(count);
  }

  function badgeItems(count) {
    const dict = dictionaries[currentLang] || dictionaries.en || dictionaries.uz;
    return dict.badgeItems(count);
  }

  return {
    SUPPORTED_LANGS,
    DEFAULT_LANG,
    initLang,
    setLanguage,
    getLanguage,
    t,
    badgeKeys,
    badgeItems,
    dictionaries
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n: rootScope.JSONViewer.i18n };
}
