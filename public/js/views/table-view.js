/**
 * JSON Jadval Ko'rinishi (Table View) Moduli
 */

window.JSONViewer = window.JSONViewer || {};

window.JSONViewer.tableView = (function() {
  return {
    render(container, data) {
      container.innerHTML = '';

      let tableData = null;

      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
        tableData = data;
      } else if (typeof data === 'object' && data !== null) {
        // Agar biror xususiyati massiv bo'lsa
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key]) && data[key].length > 0 && typeof data[key][0] === 'object') {
            tableData = data[key];
            break;
          }
        }
      }

      if (!tableData) {
        const i18n = window.JSONViewer && window.JSONViewer.i18n;
        const title = i18n ? i18n.t('emptyTableTitle') : 'Jadval ko\'rinishi faqat <strong>Obyektlar ro\'yxati (Array of Objects)</strong> uchun ishlaydi.';
        const hint = i18n ? i18n.t('emptyTableHint') : 'Masalan: <code>[{ "id": 1, "ism": "Ali" }, { "id": 2, "ism": "Vali" }]</code>';
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">[ ]</div>
            <p>${title}</p>
            <p style="font-size: 11px; margin-top: 6px; color: var(--text-dimmed);">${hint}</p>
          </div>
        `;
        return;
      }

      // Barcha ustunlarni to'plash
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

      // Thead
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

      // Tbody
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

      container.appendChild(table);
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tableView: window.JSONViewer.tableView };
}
