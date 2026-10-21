/**
 * JSON Formatter & Object Viewer
 * Zamonaviy, to'liq interaktiv JSON formatlagich va obyekt ko'rish dasturi
 */

// ================= Holat (State) =================
const state = {
  parsedData: null,
  rawJson: '',
  formattedJson: '',
  indent: 2,
  isSorted: false,
  theme: localStorage.getItem('json_viewer_theme') || 'dark',
  activeTab: 'tree',
  searchQuery: ''
};

// ================= Namuna Ma'lumotlar =================
const sampleData = {
  user: {
    "foydalanuvchi_id": 10482,
    "shaxsiy_malumot": {
      "ism": "Ali",
      "familiya": "Valiyev",
      "yosh": 27,
      "kasb": "Senior Dasturchi",
      "faol": true,
      "email": "ali.valiyev@example.uz"
    },
    "aloqa": {
      "telefon": "+998 90 123 45 67",
      "telegram": "@alivaliyev",
      "manzil": {
        "shahar": "Toshkent",
        "tuman": "Mirzo Ulug'bek",
        "kocha": "Mustaqillik shoh ko'chasi",
        "uy": 42,
        "geolokatsiya": {
          "kenglik": 41.311081,
          "uzunlik": 69.240562
        }
      }
    },
    "texnologiyalar": ["JavaScript", "TypeScript", "Python", "Go", "Docker", "PostgreSQL"],
    "loyihalar": [
      {
        "id": "PRJ-01",
        "nomi": "E-to'lov tizimi",
        "holat": "yakunlangan",
        "yil": 2025,
        "byudjet_usd": 15000
      },
      {
        "id": "PRJ-02",
        "nomi": "Mobil banking ilovasi",
        "holat": "jarayonda",
        "yil": 2026,
        "byudjet_usd": 32000
      }
    ],
    "izohlar": null
  },

  ecommerce: [
    {
      "id": 1,
      "nomi": "MacBook Pro 16\"",
      "brend": "Apple",
      "kategoriya": "Noutbuklar",
      "narx": 2499.99,
      "valyuta": "USD",
      "mavjud": true,
      "omborda": 14,
      "baho": 4.9
    },
    {
      "id": 2,
      "nomi": "Dell XPS 15",
      "brend": "Dell",
      "kategoriya": "Noutbuklar",
      "narx": 1899.50,
      "valyuta": "USD",
      "mavjud": true,
      "omborda": 8,
      "baho": 4.7
    },
    {
      "id": 3,
      "nomi": "ThinkPad X1 Carbon",
      "brend": "Lenovo",
      "kategoriya": "Noutbuklar",
      "narx": 1650.00,
      "valyuta": "USD",
      "mavjud": false,
      "omborda": 0,
      "baho": 4.8
    },
    {
      "id": 4,
      "nomi": "Sony WH-1000XM5",
      "brend": "Sony",
      "kategoriya": "Quloqchinlar",
      "narx": 399.00,
      "valyuta": "USD",
      "mavjud": true,
      "omborda": 25,
      "baho": 4.9
    }
  ],

  nested: {
    "server": "api.domain.uz",
    "port": 8080,
    "xavfsizlik": {
      "tls": true,
      "sertifikat": {
        "muddati": "2027-12-31",
        "shifrlash": "SHA-256",
        "ruxsatnomalar": ["read", "write", "admin"]
      }
    },
    "sozlamalar": {
      "keshlash": {
        "faol": true,
        "turi": "Redis",
        "vaqt_sekund": 3600
      },
      "cheklovlar": {
        "soatiga_sorovlar": 10000,
        "ip_oq_royxat": ["127.0.0.1", "192.168.1.1"]
      }
    }
  }
};

// ================= DOM Elementlar =================
const elements = {
  jsonInput: document.getElementById('jsonInput'),
  inputLineNumbers: document.getElementById('inputLineNumbers'),
  outputLineNumbers: document.getElementById('outputLineNumbers'),
  errorBox: document.getElementById('errorBox'),
  errorMessage: document.getElementById('errorMessage'),
  charCount: document.getElementById('charCount'),
  lineCount: document.getElementById('lineCount'),
  validityBadge: document.getElementById('validityBadge'),
  validityText: document.getElementById('validityText'),
  statSize: document.getElementById('statSize'),
  statKeys: document.getElementById('statKeys'),
  statDepth: document.getElementById('statDepth'),
  
  // Tugmalar
  formatBtn: document.getElementById('formatBtn'),
  minifyBtn: document.getElementById('minifyBtn'),
  clearBtn: document.getElementById('clearBtn'),
  pasteBtn: document.getElementById('pasteBtn'),
  fileInput: document.getElementById('fileInput'),
  copyBtn: document.getElementById('copyBtn'),
  copyText: document.getElementById('copyText'),
  downloadBtn: document.getElementById('downloadBtn'),
  sortBtn: document.getElementById('sortBtn'),
  sampleSelect: document.getElementById('sampleSelect'),
  indentSelect: document.getElementById('indentSelect'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  
  // Panellar
  treeContainer: document.getElementById('treeContainer'),
  codeOutput: document.getElementById('codeOutput'),
  tableContainer: document.getElementById('tableContainer'),
  treeControls: document.getElementById('treeControls'),
  treeSearchInput: document.getElementById('treeSearchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  expandAllBtn: document.getElementById('expandAllBtn'),
  collapseAllBtn: document.getElementById('collapseAllBtn'),
  
  // Tablar
  tabs: document.querySelectorAll('.tab-btn'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  toast: document.getElementById('toast')
};

// ================= Dasturni Boshlash =================
function init() {
  applyTheme(state.theme);
  setupEventListeners();
  
  // Boshlang'ich namuna yuklash
  loadSample('user');
}

// ================= Hodisalar (Event Listeners) =================
function setupEventListeners() {
  // Inputdagi o'zgarishlar
  elements.jsonInput.addEventListener('input', () => {
    updateInputStats();
    updateInputLineNumbers();
  });

  elements.jsonInput.addEventListener('scroll', () => {
    elements.inputLineNumbers.scrollTop = elements.jsonInput.scrollTop;
  });

  // Tab tugmasi kiritishda indentatsiya qilish uchun
  elements.jsonInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = elements.jsonInput.selectionStart;
      const end = elements.jsonInput.selectionEnd;
      elements.jsonInput.value = elements.jsonInput.value.substring(0, start) + "  " + elements.jsonInput.value.substring(end);
      elements.jsonInput.selectionStart = elements.jsonInput.selectionEnd = start + 2;
      updateInputStats();
      updateInputLineNumbers();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      formatCurrentJSON();
    }
  });

  // Drag and drop fayl tashlash
  elements.jsonInput.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.jsonInput.style.backgroundColor = 'var(--bg-hover)';
  });

  elements.jsonInput.addEventListener('dragleave', () => {
    elements.jsonInput.style.backgroundColor = 'transparent';
  });

  elements.jsonInput.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.jsonInput.style.backgroundColor = 'transparent';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  });

  // Fayl yuklash tugmasi
  elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  });

  // Tugmalar
  elements.formatBtn.addEventListener('click', () => formatCurrentJSON());
  elements.minifyBtn.addEventListener('click', minifyJSON);
  elements.clearBtn.addEventListener('click', clearAll);
  elements.pasteBtn.addEventListener('click', pasteFromClipboard);
  elements.copyBtn.addEventListener('click', copyFormattedJSON);
  elements.downloadBtn.addEventListener('click', downloadJSON);
  
  elements.sortBtn.addEventListener('click', () => {
    state.isSorted = !state.isSorted;
    elements.sortBtn.classList.toggle('active', state.isSorted);
    formatCurrentJSON();
    showToast(state.isSorted ? "Kalitlar saralandi (A-Z)" : "Saralash bekor qilindi");
  });

  elements.sampleSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      loadSample(e.target.value);
    }
  });

  elements.indentSelect.addEventListener('change', (e) => {
    state.indent = e.target.value === 'tab' ? '\t' : parseInt(e.target.value, 10);
    formatCurrentJSON();
  });

  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Tablar almashinuvi
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      state.activeTab = tabName;
      document.getElementById(`${tabName}ViewTab`).classList.add('active');
      
      // Tree controls faqat tree tabida ko'rinadi
      elements.treeControls.style.display = tabName === 'tree' ? 'flex' : 'none';
    });
  });

  // Tree boshqaruvlari
  elements.expandAllBtn.addEventListener('click', () => toggleAllTreeNodes(true));
  elements.collapseAllBtn.addEventListener('click', () => toggleAllTreeNodes(false));

  // Qidiruv
  elements.treeSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    elements.clearSearchBtn.classList.toggle('hidden', state.searchQuery === '');
    applyTreeSearch();
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.treeSearchInput.value = '';
    state.searchQuery = '';
    elements.clearSearchBtn.classList.add('hidden');
    applyTreeSearch();
  });
}

// ================= JSON-ni Formatlash va Tahlil Qilish =================
function formatCurrentJSON() {
  const rawText = elements.jsonInput.value.trim();
  if (!rawText) {
    showError("Iltimos, formatlash uchun JSON matn kiriting");
    clearOutput();
    return;
  }

  try {
    let parsed = JSON.parse(rawText);
    
    // Agar saralash yoqilgan bo'lsa
    if (state.isSorted) {
      parsed = sortObjectKeys(parsed);
    }

    state.parsedData = parsed;
    hideError();

    // Formatlangan matn
    const indentValue = state.indent === '\t' ? '\t' : Number(state.indent);
    state.formattedJson = JSON.stringify(parsed, null, indentValue);

    // Barcha ko'rinishlarni yangilash
    renderTree(parsed);
    renderCode(state.formattedJson);
    renderTable(parsed);
    updateMetaStats(rawText, parsed);

    setValidity(true, "To'g'ri JSON");
  } catch (err) {
    handleJSONParseError(rawText, err);
  }
}

// ================= Xatolikni Aniqlash =================
function handleJSONParseError(rawText, err) {
  setValidity(false, "Xato JSON");
  
  let msg = err.message;
  let line = 1;
  let col = 1;

  // Qator va ustunni aniqlash
  const posMatch = msg.match(/position\s+(\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const beforePos = rawText.slice(0, pos);
    const lines = beforePos.split('\n');
    line = lines.length;
    col = lines[lines.length - 1].length + 1;
    msg = `${msg} (Qator: ${line}, Ustun: ${col})`;
  } else {
    const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      col = parseInt(lineColMatch[2], 10);
    }
  }

  showError(msg);
}

function showError(msg) {
  elements.errorBox.classList.remove('hidden');
  elements.errorMessage.textContent = msg;
}

function hideError() {
  elements.errorBox.classList.add('hidden');
  elements.errorMessage.textContent = '';
}

function setValidity(isValid, text) {
  elements.validityBadge.className = `status-badge ${isValid ? 'valid' : 'invalid'}`;
  elements.validityText.textContent = text;
}

// ================= Siqish (Minify) =================
function minifyJSON() {
  const rawText = elements.jsonInput.value.trim();
  if (!rawText) return;

  try {
    const parsed = JSON.parse(rawText);
    const minified = JSON.stringify(parsed);
    elements.jsonInput.value = minified;
    updateInputStats();
    updateInputLineNumbers();
    formatCurrentJSON();
    showToast("JSON muvaffaqiyatli siqildi (Minified)!");
  } catch (err) {
    handleJSONParseError(rawText, err);
  }
}

// ================= Interaktiv Object (Daraxt) Ko'rinishi =================
function renderTree(data) {
  elements.treeContainer.innerHTML = '';
  const rootElement = buildTreeNode('root', data, '', true);
  elements.treeContainer.appendChild(rootElement);
}

/**
 * Har bir tugun (node) ni rekursiv yaratish
 */
function buildTreeNode(key, value, path = '', isRoot = false) {
  const currentPath = isRoot ? '' : (path ? `${path}.${key}` : key);
  const type = getValueType(value);
  const isComplex = type === 'object' || type === 'array';
  
  const nodeEl = document.createElement('div');
  nodeEl.className = `tree-node ${isRoot ? 'root-node' : ''}`;
  nodeEl.dataset.path = currentPath;

  const lineEl = document.createElement('div');
  lineEl.className = 'tree-line';

  // Ochish/yopish belgisi (toggle chevron)
  const toggleEl = document.createElement('span');
  toggleEl.className = 'tree-toggle';
  if (isComplex) {
    toggleEl.innerHTML = '&#9660;'; // Pastga qaratilgan strelka
    toggleEl.title = "Ochish / Yopish";
  } else {
    toggleEl.className += ' empty-toggle';
  }
  lineEl.appendChild(toggleEl);

  // Kalit nomi (agar obyekt elementi bo'lsa yoki ildiz bo'lmasa)
  if (!isRoot && key !== null) {
    const keyEl = document.createElement('span');
    keyEl.className = 'tree-key';
    keyEl.textContent = `"${escapeHtml(key)}"`;
    lineEl.appendChild(keyEl);

    const colonEl = document.createElement('span');
    colonEl.className = 'tree-colon';
    colonEl.textContent = ': ';
    lineEl.appendChild(colonEl);
  }

  // Qiymat qismi
  if (isComplex) {
    const isArray = type === 'array';
    const openBracket = isArray ? '[' : '{';
    const closeBracket = isArray ? ']' : '}';
    const itemsCount = isArray ? value.length : Object.keys(value).length;

    const bracketOpen = document.createElement('span');
    bracketOpen.className = 'val-bracket';
    bracketOpen.textContent = openBracket;
    lineEl.appendChild(bracketOpen);

    // Badge: elementlar soni
    const badge = document.createElement('span');
    badge.className = 'tree-badge';
    badge.textContent = isArray ? `${itemsCount} ta element` : `${itemsCount} ta kalit`;
    lineEl.appendChild(badge);

    // Qisqartirilgan prevyu (yopiq turganda ko'rinadi)
    const preview = document.createElement('span');
    preview.className = 'tree-preview hidden';
    preview.textContent = getPreviewText(value, isArray);
    lineEl.appendChild(preview);

    // Qator harakatlari (Hover actions)
    lineEl.appendChild(createNodeActions(currentPath, JSON.stringify(value)));

    nodeEl.appendChild(lineEl);

    // Bolalar konteyneri
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'tree-children';

    if (isArray) {
      value.forEach((item, index) => {
        const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        childrenContainer.appendChild(buildTreeNode(index, item, itemPath));
      });
    } else {
      const keys = Object.keys(value);
      keys.forEach(k => {
        childrenContainer.appendChild(buildTreeNode(k, value[k], currentPath));
      });
    }

    nodeEl.appendChild(childrenContainer);

    // Yopiluvchi qavs
    const closeLine = document.createElement('div');
    closeLine.className = 'tree-line tree-close-bracket';
    const closeSpacer = document.createElement('span');
    closeSpacer.className = 'tree-toggle empty-toggle';
    closeLine.appendChild(closeSpacer);

    const bracketClose = document.createElement('span');
    bracketClose.className = 'val-bracket';
    bracketClose.textContent = closeBracket;
    closeLine.appendChild(bracketClose);
    nodeEl.appendChild(closeLine);

    // Ochish/yopish bosilganda
    toggleEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCollapsed = childrenContainer.style.display === 'none';
      if (isCollapsed) {
        childrenContainer.style.display = 'block';
        closeLine.style.display = 'flex';
        preview.classList.add('hidden');
        badge.classList.remove('hidden');
        toggleEl.classList.remove('collapsed');
      } else {
        childrenContainer.style.display = 'none';
        closeLine.style.display = 'none';
        preview.classList.remove('hidden');
        badge.classList.add('hidden');
        toggleEl.classList.add('collapsed');
      }
    });

  } else {
    // Oddiy qiymatlar (String, Number, Boolean, Null)
    const valEl = document.createElement('span');
    valEl.className = `val-${type}`;
    
    if (type === 'string') {
      valEl.textContent = `"${value}"`;
    } else {
      valEl.textContent = String(value);
    }
    lineEl.appendChild(valEl);

    // Qator harakatlari (Hover actions)
    lineEl.appendChild(createNodeActions(currentPath, JSON.stringify(value)));
    nodeEl.appendChild(lineEl);
  }

  return nodeEl;
}

/**
 * Prevyu matnini shakllantirish
 */
function getPreviewText(val, isArray) {
  if (isArray) {
    if (val.length === 0) return '[]';
    const previewItems = val.slice(0, 3).map(v => typeof v === 'object' ? '{...}' : JSON.stringify(v));
    return `[ ${previewItems.join(', ')}${val.length > 3 ? ', ...' : ''} ]`;
  } else {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const previewKeys = keys.slice(0, 3).map(k => `${k}: ${typeof val[k] === 'object' ? '{...}' : JSON.stringify(val[k])}`);
    return `{ ${previewKeys.join(', ')}${keys.length > 3 ? ', ...' : ''} }`;
  }
}

/**
 * Hover paytida ko'rinadigan tezkor harakatlar (Yo'lni nusxalash, Qiymatni nusxalash)
 */
function createNodeActions(path, valueString) {
  const actionsEl = document.createElement('div');
  actionsEl.className = 'node-actions';

  if (path) {
    const copyPathBtn = document.createElement('button');
    copyPathBtn.className = 'btn-mini';
    copyPathBtn.title = `Yo'lni nusxalash: ${path}`;
    copyPathBtn.textContent = "Yo'l";
    copyPathBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboardText(path, `Yo'l nusxalandi: ${path}`);
    });
    actionsEl.appendChild(copyPathBtn);
  }

  const copyValBtn = document.createElement('button');
  copyValBtn.className = 'btn-mini';
  copyValBtn.title = "Qiymatni nusxalash";
  copyValBtn.textContent = "Nusxa";
  copyValBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboardText(valueString, "Qiymat nusxalandi!");
  });
  actionsEl.appendChild(copyValBtn);

  return actionsEl;
}

function getValueType(val) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

// Barcha tugunlarni ochish / yopish
function toggleAllTreeNodes(expand) {
  const childrenContainers = elements.treeContainer.querySelectorAll('.tree-children');
  const closeLines = elements.treeContainer.querySelectorAll('.tree-close-bracket');
  const toggles = elements.treeContainer.querySelectorAll('.tree-toggle:not(.empty-toggle)');
  const previews = elements.treeContainer.querySelectorAll('.tree-preview');
  const badges = elements.treeContainer.querySelectorAll('.tree-badge');

  childrenContainers.forEach(container => {
    container.style.display = expand ? 'block' : 'none';
  });

  closeLines.forEach(line => {
    line.style.display = expand ? 'flex' : 'none';
  });

  toggles.forEach(toggle => {
    if (expand) {
      toggle.classList.remove('collapsed');
    } else {
      toggle.classList.add('collapsed');
    }
  });

  previews.forEach(preview => {
    if (expand) {
      preview.classList.add('hidden');
    } else {
      preview.classList.remove('hidden');
    }
  });

  badges.forEach(badge => {
    if (expand) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

// Qidiruv filtri
function applyTreeSearch() {
  const query = state.searchQuery;
  const lines = elements.treeContainer.querySelectorAll('.tree-line');

  if (!query) {
    // Qidiruv tozalandi - belgilarni olib tashlash
    lines.forEach(line => {
      line.style.backgroundColor = '';
      const keyEl = line.querySelector('.tree-key');
      const valEl = line.querySelector('[class^="val-"]');
      if (keyEl) keyEl.innerHTML = escapeHtml(keyEl.textContent);
      if (valEl) valEl.innerHTML = escapeHtml(valEl.textContent);
    });
    return;
  }

  // Daraxtni ochish
  toggleAllTreeNodes(true);

  lines.forEach(line => {
    const text = line.textContent.toLowerCase();
    if (text.includes(query)) {
      line.style.backgroundColor = 'rgba(234, 179, 8, 0.2)';
    } else {
      line.style.backgroundColor = '';
    }
  });
}

// ================= Formatlangan Matn (Code View) =================
function renderCode(jsonStr) {
  const highlighted = syntaxHighlight(jsonStr);
  elements.codeOutput.innerHTML = `<code>${highlighted}</code>`;
  
  // Qator raqamlarini yaratish
  const lineCount = jsonStr.split('\n').length;
  let nums = '';
  for (let i = 1; i <= lineCount; i++) {
    nums += i + '\n';
  }
  elements.outputLineNumbers.textContent = nums;
}

function syntaxHighlight(json) {
  json = escapeHtml(json);
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'val-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'tree-key';
      } else {
        cls = 'val-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'val-boolean';
    } else if (/null/.test(match)) {
      cls = 'val-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

// ================= Jadval Ko'rinishi (Table View) =================
function renderTable(data) {
  elements.tableContainer.innerHTML = '';

  let tableData = null;

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    tableData = data;
  } else if (typeof data === 'object' && data !== null) {
    // Agar biror xususiyati obyektlar massivi bo'lsa
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key]) && data[key].length > 0 && typeof data[key][0] === 'object') {
        tableData = data[key];
        break;
      }
    }
  }

  if (!tableData) {
    elements.tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">[ ]</div>
        <p>Jadval ko'rinishi faqat <strong>Obyektlar ro'yxati (Array of Objects)</strong> uchun ishlaydi.</p>
        <p style="font-size: 11px; margin-top: 6px; color: var(--text-dimmed);">
          Masalan: <code>[{ "id": 1, "ism": "Ali" }, { "id": 2, "ism": "Vali" }]</code>
        </p>
      </div>
    `;
    return;
  }

  // Barcha noyob ustunlarni yig'ish
  const columns = [];
  tableData.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(k => {
        if (!columns.includes(k)) columns.push(k);
      });
    }
  });

  const table = document.createElement('table');
  table.className = 'json-table';

  // Sarlavha (Thead)
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  
  const thIndex = document.createElement('th');
  thIndex.textContent = '#';
  trHead.appendChild(thIndex);

  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // Ma'lumot qatori (Tbody)
  const tbody = document.createElement('tbody');
  tableData.forEach((row, idx) => {
    const tr = document.createElement('tr');
    
    const tdIndex = document.createElement('td');
    tdIndex.textContent = idx + 1;
    tdIndex.style.color = 'var(--text-dimmed)';
    tr.appendChild(tdIndex);

    columns.forEach(col => {
      const td = document.createElement('td');
      const val = row[col];
      if (val === undefined) {
        td.textContent = '-';
        td.style.color = 'var(--text-dimmed)';
      } else if (typeof val === 'object' && val !== null) {
        td.textContent = JSON.stringify(val);
      } else {
        td.textContent = String(val);
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  elements.tableContainer.appendChild(table);
}

// ================= Yordamchi Funksiyalar =================

// Kalitlarni A-Z saralash
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result, key) => {
        result[key] = sortObjectKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
}

// Chuqurlikni hisoblash
function calculateDepth(obj) {
  if (obj === null || typeof obj !== 'object') return 0;
  let maxChildDepth = 0;
  for (const key of Object.keys(obj)) {
    maxChildDepth = Math.max(maxChildDepth, calculateDepth(obj[key]));
  }
  return 1 + maxChildDepth;
}

// Jami kalitlar sonini hisoblash
function countKeys(obj) {
  if (obj === null || typeof obj !== 'object') return 0;
  let count = 0;
  if (!Array.isArray(obj)) {
    count += Object.keys(obj).length;
  }
  for (const key of Object.keys(obj)) {
    count += countKeys(obj[key]);
  }
  return count;
}

// Hajm formatlash
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Statistikani yangilash
function updateMetaStats(rawText, parsed) {
  const bytes = new Blob([state.formattedJson || rawText]).size;
  elements.statSize.textContent = `Hajmi: ${formatBytes(bytes)}`;
  elements.statKeys.textContent = `Kalitlar: ${countKeys(parsed)}`;
  elements.statDepth.textContent = `Chuqurlik: ${calculateDepth(parsed)}`;
}

function updateInputStats() {
  const text = elements.jsonInput.value;
  elements.charCount.textContent = `${text.length} belgi`;
  const lines = text.length === 0 ? 1 : text.split('\n').length;
  elements.lineCount.textContent = `${lines} qator`;
}

function updateInputLineNumbers() {
  const lines = elements.jsonInput.value.split('\n').length;
  let nums = '';
  for (let i = 1; i <= Math.max(lines, 1); i++) {
    nums += i + '\n';
  }
  elements.inputLineNumbers.textContent = nums;
}

// HTML Xavfsizligi
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fayl o'qish
function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    elements.jsonInput.value = e.target.result;
    updateInputStats();
    updateInputLineNumbers();
    formatCurrentJSON();
    showToast(`"${file.name}" fayli muvaffaqiyatli yuklandi`);
  };
  reader.readAsText(file);
}

// Namunani yuklash
function loadSample(key) {
  if (sampleData[key]) {
    elements.jsonInput.value = JSON.stringify(sampleData[key], null, 2);
    updateInputStats();
    updateInputLineNumbers();
    formatCurrentJSON();
  }
}

// Xotiradan qo'yish (Paste)
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    elements.jsonInput.value = text;
    updateInputStats();
    updateInputLineNumbers();
    formatCurrentJSON();
    showToast("Vaqtinchalik xotiradan qo'yildi");
  } catch (e) {
    showToast("Xotiradan o'qish uchun ruxsat berilmadi");
  }
}

// Nusxalash
function copyFormattedJSON() {
  const text = state.formattedJson || elements.jsonInput.value;
  if (!text) return;
  copyToClipboardText(text, "Formatlangan JSON nusxalandi!");
}

function copyToClipboardText(text, toastMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(toastMsg || "Nusxalandi!");
  }).catch(() => {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast(toastMsg || "Nusxalandi!");
  });
}

// Fayl sifatida yuklash
function downloadJSON() {
  const text = state.formattedJson || elements.jsonInput.value;
  if (!text) {
    showToast("Yuklash uchun ma'lumot mavjud emas");
    return;
  }
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `formatted_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Fayl yuklab olindi");
}

// Tozalash
function clearAll() {
  elements.jsonInput.value = '';
  clearOutput();
  hideError();
  updateInputStats();
  updateInputLineNumbers();
  setValidity(false, "Bo'sh");
  showToast("Maydon tozalandi");
}

function clearOutput() {
  state.parsedData = null;
  state.formattedJson = '';
  elements.treeContainer.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">{ }</div>
      <p>Formatlash uchun chap panelga JSON kiriting va <strong>Formatlash</strong> tugmasini bosing</p>
    </div>
  `;
  elements.codeOutput.innerHTML = '<code>// Formatlangan JSON shu yerda ko\'rinadi</code>';
  elements.outputLineNumbers.textContent = '1';
  elements.tableContainer.innerHTML = `
    <div class="empty-state">
      <p>Jadval ko'rinishi ro'yxat (Array) shaklidagi obyektlar uchun mavjud.</p>
    </div>
  `;
  elements.statSize.textContent = 'Hajmi: 0 B';
  elements.statKeys.textContent = 'Kalitlar: 0';
  elements.statDepth.textContent = 'Chuqurlik: 0';
}

// Toast xabari
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2200);
}

// Mavzuni almashtirish
function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('json_viewer_theme', theme);
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    elements.themeIcon.textContent = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    elements.themeIcon.textContent = '☀️';
  }
}

// Yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', init);
