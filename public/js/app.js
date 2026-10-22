/**
 * JSON Formatter & Object Viewer - Asosiy UI Kontroller (App Controller)
 * Ko'p tilli (i18n): uz, en, ru
 */

(function () {
  const { i18n, sampleData, getSample, utils, errorParser, treeView, codeView, tableView } = window.JSONViewer;

  // ================= Holat (State) =================
  const state = {
    parsedData: null,
    rawJson: '',
    formattedJson: '',
    indent: 2,
    isSorted: false,
    theme: localStorage.getItem('json_viewer_theme') || 'dark',
    lang: i18n ? i18n.initLang() : 'uz',
    activeTab: 'tree',
    searchQuery: '',
    currentSampleKey: 'user'
  };

  // ================= DOM Elementlar =================
  const elements = {
    // Header
    appTitle: document.getElementById('appTitle'),
    appSubtitle: document.getElementById('appSubtitle'),
    langLabel: document.getElementById('langLabel'),
    langSelect: document.getElementById('langSelect'),
    sampleLabel: document.getElementById('sampleLabel'),
    sampleSelect: document.getElementById('sampleSelect'),
    optSampleDefault: document.getElementById('optSampleDefault'),
    optSampleUser: document.getElementById('optSampleUser'),
    optSampleEcommerce: document.getElementById('optSampleEcommerce'),
    optSampleNested: document.getElementById('optSampleNested'),
    indentLabel: document.getElementById('indentLabel'),
    indentSelect: document.getElementById('indentSelect'),
    optIndent2: document.getElementById('optIndent2'),
    optIndent4: document.getElementById('optIndent4'),
    optIndentTab: document.getElementById('optIndentTab'),
    sortBtn: document.getElementById('sortBtn'),
    sortBtnText: document.getElementById('sortBtnText'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),

    // Chap panel (Input)
    inputPanelTitle: document.getElementById('inputPanelTitle'),
    fileUploadLabel: document.getElementById('fileUploadLabel'),
    fileUploadText: document.getElementById('fileUploadText'),
    fileInput: document.getElementById('fileInput'),
    pasteBtn: document.getElementById('pasteBtn'),
    clearBtn: document.getElementById('clearBtn'),
    editorContainer: document.querySelector('.editor-container'),
    jsonInput: document.getElementById('jsonInput'),
    inputLineNumbers: document.getElementById('inputLineNumbers'),
    errorBox: document.getElementById('errorBox'),
    errorHeaderTitle: document.getElementById('errorHeaderTitle'),
    errorMessage: document.getElementById('errorMessage'),
    charCount: document.getElementById('charCount'),
    lineCount: document.getElementById('lineCount'),
    minifyBtn: document.getElementById('minifyBtn'),
    formatBtn: document.getElementById('formatBtn'),
    formatBtnText: document.getElementById('formatBtnText'),

    // O'ng panel (Output)
    tabBtnTree: document.getElementById('tabBtnTree'),
    tabBtnCode: document.getElementById('tabBtnCode'),
    tabBtnTable: document.getElementById('tabBtnTable'),
    tabTextTree: document.getElementById('tabTextTree'),
    tabTextCode: document.getElementById('tabTextCode'),
    tabTextTable: document.getElementById('tabTextTable'),
    copyBtn: document.getElementById('copyBtn'),
    copyText: document.getElementById('copyText'),
    downloadBtn: document.getElementById('downloadBtn'),
    downloadText: document.getElementById('downloadText'),

    // Daraxt boshqaruvi
    treeControls: document.getElementById('treeControls'),
    treeSearchInput: document.getElementById('treeSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    expandAllBtn: document.getElementById('expandAllBtn'),
    collapseAllBtn: document.getElementById('collapseAllBtn'),

    // Konteynerlar
    treeContainer: document.getElementById('treeContainer'),
    codeOutput: document.getElementById('codeOutput'),
    outputLineNumbers: document.getElementById('outputLineNumbers'),
    tableContainer: document.getElementById('tableContainer'),
    emptyTreeMsg: document.getElementById('emptyTreeMsg'),
    emptyTableMsg: document.getElementById('emptyTableMsg'),

    // Footer
    validityBadge: document.getElementById('validityBadge'),
    validityText: document.getElementById('validityText'),
    statSize: document.getElementById('statSize'),
    statKeys: document.getElementById('statKeys'),
    statDepth: document.getElementById('statDepth'),

    // Boshqalar
    tabs: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    toast: document.getElementById('toast')
  };

  // ================= Dasturni Boshlash =================
  function init() {
    applyTheme(state.theme);
    applyLanguage(state.lang);
    setupEventListeners();

    // Boshlang'ich namuna yuklash
    loadSample('user', false);
  }

  // ================= Tilni Qo'llash (Apply Language) =================
  function applyLanguage(lang) {
    if (i18n) {
      i18n.setLanguage(lang);
    }
    state.lang = lang;

    if (elements.langSelect) {
      elements.langSelect.value = lang;
    }

    // Matnlarni yangilash
    if (elements.appSubtitle) elements.appSubtitle.textContent = t('subtitle');
    if (elements.langLabel) elements.langLabel.textContent = t('langLabel');
    if (elements.sampleLabel) elements.sampleLabel.textContent = t('sampleLabel');
    if (elements.optSampleDefault) elements.optSampleDefault.textContent = t('chooseSample');
    if (elements.optSampleUser) elements.optSampleUser.textContent = t('sampleUser');
    if (elements.optSampleEcommerce) elements.optSampleEcommerce.textContent = t('sampleEcommerce');
    if (elements.optSampleNested) elements.optSampleNested.textContent = t('sampleNested');

    if (elements.indentLabel) elements.indentLabel.textContent = t('indentLabel');
    if (elements.optIndent2) elements.optIndent2.textContent = t('indentTwo');
    if (elements.optIndent4) elements.optIndent4.textContent = t('indentFour');
    if (elements.optIndentTab) elements.optIndentTab.textContent = t('indentTab');

    if (elements.sortBtn) {
      elements.sortBtn.title = t('btnSortTitle');
      if (elements.sortBtnText) elements.sortBtnText.textContent = t('btnSort');
    }
    if (elements.themeToggleBtn) elements.themeToggleBtn.title = t('themeToggleTitle');

    if (elements.inputPanelTitle) elements.inputPanelTitle.textContent = t('inputPanelTitle');
    if (elements.fileUploadLabel) elements.fileUploadLabel.title = t('btnUploadFileTitle');
    if (elements.fileUploadText) elements.fileUploadText.textContent = t('btnUploadFile');
    if (elements.pasteBtn) {
      elements.pasteBtn.textContent = t('btnPaste');
      elements.pasteBtn.title = t('btnPasteTitle');
    }
    if (elements.clearBtn) {
      elements.clearBtn.textContent = t('btnClear');
      elements.clearBtn.title = t('btnClearTitle');
    }
    if (elements.jsonInput) elements.jsonInput.placeholder = t('jsonInputPlaceholder');
    if (elements.errorHeaderTitle) elements.errorHeaderTitle.textContent = t('errorHeader');
    if (elements.minifyBtn) {
      elements.minifyBtn.textContent = t('btnMinify');
      elements.minifyBtn.title = t('btnMinifyTitle');
    }
    if (elements.formatBtn) {
      elements.formatBtn.title = t('btnFormatTitle');
      if (elements.formatBtnText) elements.formatBtnText.textContent = t('btnFormat');
    }

    if (elements.tabTextTree) elements.tabTextTree.textContent = t('tabTree');
    if (elements.tabTextCode) elements.tabTextCode.textContent = t('tabCode');
    if (elements.tabTextTable) elements.tabTextTable.textContent = t('tabTable');

    if (elements.copyBtn) {
      elements.copyBtn.title = t('btnCopyTitle');
      if (elements.copyText) elements.copyText.textContent = t('btnCopy');
    }
    if (elements.downloadBtn) {
      elements.downloadBtn.title = t('btnDownloadTitle');
      if (elements.downloadText) elements.downloadText.textContent = t('btnDownload');
    }

    if (elements.treeSearchInput) elements.treeSearchInput.placeholder = t('searchPlaceholder');
    if (elements.expandAllBtn) {
      elements.expandAllBtn.textContent = t('btnExpandAll');
      elements.expandAllBtn.title = t('btnExpandAllTitle');
    }
    if (elements.collapseAllBtn) {
      elements.collapseAllBtn.textContent = t('btnCollapseAll');
      elements.collapseAllBtn.title = t('btnCollapseAllTitle');
    }

    if (elements.emptyTreeMsg) elements.emptyTreeMsg.innerHTML = t('emptyTreeText');
    if (elements.emptyTableMsg) elements.emptyTableMsg.innerHTML = t('emptyTableTitle');

    // Statistika va ko'rinishlarni yangilash
    updateInputStats();
    if (state.parsedData) {
      updateMetaStats(elements.jsonInput.value, state.parsedData);
      setValidity(true, t('statusValid'));
      treeView.render(elements.treeContainer, state.parsedData, (text, msg) => {
        utils.copyToClipboard(text).then(() => showToast(msg));
      });
      tableView.render(elements.tableContainer, state.parsedData);
    } else if (!elements.jsonInput.value.trim()) {
      setValidity(false, t('statusWaiting'));
    }
  }

  function t(key, params) {
    return i18n ? i18n.t(key, params) : key;
  }

  // ================= Hodisalar (Event Listeners) =================
  function setupEventListeners() {
    // Til almashtirish
    if (elements.langSelect) {
      elements.langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        applyLanguage(newLang);
        // Agar tanlangan namuna bo'lsa, uni yangi tildagi variantiga yangilash
        if (state.currentSampleKey) {
          loadSample(state.currentSampleKey, false);
        }
      });
    }

    // Inputdagi o'zgarishlar
    elements.jsonInput.addEventListener('input', () => {
      updateInputStats();
      updateInputLineNumbers();
    });

    elements.jsonInput.addEventListener('scroll', () => {
      elements.inputLineNumbers.scrollTop = elements.jsonInput.scrollTop;
    });

    // Tab va klaviatura yorliqlari
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

    // Fayl yuklash
    elements.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        readFile(e.target.files[0]);
      }
    });

    // Asosiy tugmalar
    elements.formatBtn.addEventListener('click', () => formatCurrentJSON());
    elements.minifyBtn.addEventListener('click', minifyJSON);
    elements.clearBtn.addEventListener('click', clearAll);
    elements.pasteBtn.addEventListener('click', pasteFromClipboard);
    elements.copyBtn.addEventListener('click', copyFormattedJSON);
    elements.downloadBtn.addEventListener('click', downloadJSON);

    // Saralash
    elements.sortBtn.addEventListener('click', () => {
      state.isSorted = !state.isSorted;
      elements.sortBtn.classList.toggle('active', state.isSorted);
      formatCurrentJSON();
      showToast(state.isSorted ? t('toastSortedOn') : t('toastSortedOff'));
    });

    // Namuna tanlash
    elements.sampleSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        state.currentSampleKey = e.target.value;
        loadSample(e.target.value, true);
      }
    });

    // Bo'shliq (Indentation)
    elements.indentSelect.addEventListener('change', (e) => {
      state.indent = e.target.value === 'tab' ? '\t' : parseInt(e.target.value, 10);
      formatCurrentJSON();
    });

    // Mavzuni o'zgartirish
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

    // Tree tugmalari
    elements.expandAllBtn.addEventListener('click', () => treeView.toggleAll(elements.treeContainer, true));
    elements.collapseAllBtn.addEventListener('click', () => treeView.toggleAll(elements.treeContainer, false));

    // Qidiruv
    elements.treeSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      elements.clearSearchBtn.classList.toggle('hidden', state.searchQuery === '');
      treeView.search(elements.treeContainer, state.searchQuery);
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.treeSearchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      treeView.search(elements.treeContainer, '');
    });
  }

  // ================= JSON-ni Formatlash va Tahlil Qilish =================
  function formatCurrentJSON() {
    const rawText = elements.jsonInput.value.trim();
    if (!rawText) {
      showError(t('toastEnterJson'));
      clearOutput();
      return;
    }

    try {
      let parsed = JSON.parse(rawText);

      if (state.isSorted) {
        parsed = utils.sortObjectKeys(parsed);
      }

      state.parsedData = parsed;
      hideError();

      const indentValue = state.indent === '\t' ? '\t' : Number(state.indent);
      state.formattedJson = JSON.stringify(parsed, null, indentValue);

      // Ko'rinishlarni yangilash
      treeView.render(elements.treeContainer, parsed, (text, msg) => {
        utils.copyToClipboard(text).then(() => showToast(msg));
      });
      codeView.render(elements.codeOutput, elements.outputLineNumbers, state.formattedJson);
      tableView.render(elements.tableContainer, parsed);
      updateMetaStats(rawText, parsed);

      setValidity(true, t('statusValid'));
    } catch (err) {
      handleJSONParseError(rawText, err);
    }
  }

  function handleJSONParseError(rawText, err) {
    setValidity(false, t('statusInvalid'));
    const { message } = errorParser.parse(rawText, err, state.lang);
    showError(message);
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
    elements.validityBadge.className = `status-badge ${isValid ? 'valid' : (text === t('statusWaiting') || text === t('statusEmpty') ? '' : 'invalid')}`;
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
      showToast(t('toastMinified'));
    } catch (err) {
      handleJSONParseError(rawText, err);
    }
  }

  // ================= Statistika va Yordamchilar =================
  function updateMetaStats(rawText, parsed) {
    const bytes = new Blob([state.formattedJson || rawText]).size;
    elements.statSize.textContent = `${t('statSize')} ${utils.formatBytes(bytes)}`;
    elements.statKeys.textContent = `${t('statKeys')} ${utils.countKeys(parsed)}`;
    elements.statDepth.textContent = `${t('statDepth')} ${utils.calculateDepth(parsed)}`;
  }

  function updateInputStats() {
    const text = elements.jsonInput.value;
    elements.charCount.textContent = t('charCount', { count: text.length });
    const lines = text.length === 0 ? 1 : text.split('\n').length;
    elements.lineCount.textContent = t('lineCount', { count: lines });
  }

  function updateInputLineNumbers() {
    const lines = elements.jsonInput.value.split('\n').length;
    let nums = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      nums += i + '\n';
    }
    elements.inputLineNumbers.textContent = nums;
  }

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.currentSampleKey = null;
      elements.jsonInput.value = e.target.result;
      updateInputStats();
      updateInputLineNumbers();
      formatCurrentJSON();
      showToast(t('toastFileLoaded', { name: file.name }));
    };
    reader.readAsText(file);
  }

  function loadSample(key, notify = true) {
    state.currentSampleKey = key;
    let data = null;
    if (getSample) {
      data = getSample(key, state.lang);
    }
    if (!data && sampleData && sampleData[key]) {
      data = sampleData[key];
    }

    if (data) {
      elements.jsonInput.value = JSON.stringify(data, null, 2);
      updateInputStats();
      updateInputLineNumbers();
      formatCurrentJSON();
      if (elements.sampleSelect) {
        elements.sampleSelect.value = key;
      }
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      state.currentSampleKey = null;
      elements.jsonInput.value = text;
      updateInputStats();
      updateInputLineNumbers();
      formatCurrentJSON();
      showToast(t('toastPasted'));
    } catch (e) {
      showToast(t('toastPasteError'));
    }
  }

  function copyFormattedJSON() {
    const text = state.formattedJson || elements.jsonInput.value;
    if (!text) return;
    utils.copyToClipboard(text)
      .then(() => showToast(t('toastCopied')))
      .catch(() => showToast(t('toastCopyError')));
  }

  function downloadJSON() {
    const text = state.formattedJson || elements.jsonInput.value;
    if (!text) {
      showToast(t('toastDownloadEmpty'));
      return;
    }
    const fileName = `formatted_${new Date().toISOString().slice(0, 10)}.json`;
    utils.downloadAsFile(text, fileName);
    showToast(t('toastDownloaded'));
  }

  function clearAll() {
    state.currentSampleKey = null;
    elements.jsonInput.value = '';
    clearOutput();
    hideError();
    updateInputStats();
    updateInputLineNumbers();
    setValidity(false, t('statusEmpty'));
    showToast(t('toastCleared'));
  }

  function clearOutput() {
    state.parsedData = null;
    state.formattedJson = '';
    elements.treeContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">{ }</div>
        <p id="emptyTreeMsg">${t('emptyTreeText')}</p>
      </div>
    `;
    elements.codeOutput.innerHTML = `<code>${t('codePlaceholder')}</code>`;
    elements.outputLineNumbers.textContent = '1';
    elements.tableContainer.innerHTML = `
      <div class="empty-state">
        <p id="emptyTableMsg">${t('emptyTableTitle')}</p>
      </div>
    `;
    elements.statSize.textContent = `${t('statSize')} 0 B`;
    elements.statKeys.textContent = `${t('statKeys')} 0`;
    elements.statDepth.textContent = `${t('statDepth')} 0`;
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2200);
  }

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

  // DOM tayyor bo'lganda ishga tushirish
  document.addEventListener('DOMContentLoaded', init);
})();
