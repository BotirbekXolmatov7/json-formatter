/**
 * JSON Interaktiv Daraxt (Tree View) Moduli
 */

window.JSONViewer = window.JSONViewer || {};

window.JSONViewer.treeView = (function() {
  const utils = window.JSONViewer.utils;

  function getValueType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

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

  function createNodeActions(path, valueString, onCopy) {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'node-actions';
    const i18n = window.JSONViewer && window.JSONViewer.i18n;

    if (path) {
      const copyPathBtn = document.createElement('button');
      copyPathBtn.className = 'btn-mini';
      copyPathBtn.title = i18n ? i18n.t('btnPathTitle', { path }) : `Yo'lni nusxalash: ${path}`;
      copyPathBtn.textContent = i18n ? i18n.t('btnPath') : "Yo'l";
      copyPathBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const msg = i18n ? i18n.t('toastPathCopied', { path }) : `Yo'l nusxalandi: ${path}`;
        if (onCopy) onCopy(path, msg);
      });
      actionsEl.appendChild(copyPathBtn);
    }

    const copyValBtn = document.createElement('button');
    copyValBtn.className = 'btn-mini';
    copyValBtn.title = i18n ? i18n.t('btnCopyValTitle') : "Qiymatni nusxalash";
    copyValBtn.textContent = i18n ? i18n.t('btnCopyVal') : "Nusxa";
    copyValBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = i18n ? i18n.t('toastValCopied') : "Qiymat nusxalandi!";
      if (onCopy) onCopy(valueString, msg);
    });
    actionsEl.appendChild(copyValBtn);

    return actionsEl;
  }

  function buildTreeNode(key, value, parentPath = '', isRoot = false, onCopy) {
    let currentPath = '';
    if (!isRoot) {
      if (typeof key === 'number') {
        currentPath = parentPath ? `${parentPath}[${key}]` : `[${key}]`;
      } else if (key !== null) {
        currentPath = parentPath ? `${parentPath}.${key}` : key;
      }
    }
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
      toggleEl.innerHTML = '&#9660;';
      toggleEl.title = "Ochish / Yopish";
    } else {
      toggleEl.className += ' empty-toggle';
    }
    lineEl.appendChild(toggleEl);

    // Kalit nomi
    if (!isRoot && key !== null) {
      const keyEl = document.createElement('span');
      keyEl.className = 'tree-key';
      keyEl.textContent = `"${key}"`;
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
      const i18n = window.JSONViewer && window.JSONViewer.i18n;
      const badge = document.createElement('span');
      badge.className = 'tree-badge';
      badge.textContent = isArray 
        ? (i18n ? i18n.badgeItems(itemsCount) : `${itemsCount} ta element`)
        : (i18n ? i18n.badgeKeys(itemsCount) : `${itemsCount} ta kalit`);
      lineEl.appendChild(badge);

      // Prevyu
      const preview = document.createElement('span');
      preview.className = 'tree-preview hidden';
      preview.textContent = getPreviewText(value, isArray);
      lineEl.appendChild(preview);

      // Hover actions
      lineEl.appendChild(createNodeActions(currentPath, JSON.stringify(value), onCopy));
      nodeEl.appendChild(lineEl);

      // Bolalar konteyneri
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'tree-children';

      if (isArray) {
        value.forEach((item, index) => {
          childrenContainer.appendChild(buildTreeNode(index, item, currentPath, false, onCopy));
        });
      } else {
        const keys = Object.keys(value);
        keys.forEach(k => {
          childrenContainer.appendChild(buildTreeNode(k, value[k], currentPath, false, onCopy));
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

      // Toggle click
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
      // Oddiy qiymatlar
      const valEl = document.createElement('span');
      valEl.className = `val-${type}`;
      valEl.textContent = type === 'string' ? `"${value}"` : String(value);
      lineEl.appendChild(valEl);

      lineEl.appendChild(createNodeActions(currentPath, JSON.stringify(value), onCopy));
      nodeEl.appendChild(lineEl);
    }

    return nodeEl;
  }

  return {
    render(container, data, onCopy) {
      container.innerHTML = '';
      const rootElement = buildTreeNode('root', data, '', true, onCopy);
      container.appendChild(rootElement);
    },

    toggleAll(container, expand) {
      const childrenContainers = container.querySelectorAll('.tree-children');
      const closeLines = container.querySelectorAll('.tree-close-bracket');
      const toggles = container.querySelectorAll('.tree-toggle:not(.empty-toggle)');
      const previews = container.querySelectorAll('.tree-preview');
      const badges = container.querySelectorAll('.tree-badge');

      childrenContainers.forEach(c => { c.style.display = expand ? 'block' : 'none'; });
      closeLines.forEach(l => { l.style.display = expand ? 'flex' : 'none'; });
      toggles.forEach(t => {
        if (expand) t.classList.remove('collapsed');
        else t.classList.add('collapsed');
      });
      previews.forEach(p => {
        if (expand) p.classList.add('hidden');
        else p.classList.remove('hidden');
      });
      badges.forEach(b => {
        if (expand) b.classList.remove('hidden');
        else b.classList.add('hidden');
      });
    },

    search(container, query) {
      const lines = container.querySelectorAll('.tree-line');
      if (!query) {
        lines.forEach(line => {
          line.style.backgroundColor = '';
        });
        return;
      }

      this.toggleAll(container, true);

      lines.forEach(line => {
        const text = line.textContent.toLowerCase();
        if (text.includes(query)) {
          line.style.backgroundColor = 'rgba(234, 179, 8, 0.2)';
        } else {
          line.style.backgroundColor = '';
        }
      });
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { treeView: window.JSONViewer.treeView };
}
