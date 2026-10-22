/**
 * JSON Matn & Sintaksis Bo'yash (Code View) Moduli
 */

const root = typeof window !== 'undefined' ? window : global;
root.JSONViewer = root.JSONViewer || {};

root.JSONViewer.codeView = (function() {
  function syntaxHighlight(json) {
    // HTML teglarni xavfsiz qilish (<, >, &) - lekin qo'shtirnoq regex uchun saqlanadi
    const safe = String(json)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return safe.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
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
      }
    );
  }

  return {
    syntaxHighlight,
    render(codeOutputEl, lineNumbersEl, jsonStr) {
      const highlighted = syntaxHighlight(jsonStr);
      codeOutputEl.innerHTML = `<code>${highlighted}</code>`;

      const lineCount = jsonStr.split('\n').length;
      let nums = '';
      for (let i = 1; i <= lineCount; i++) {
        nums += i + '\n';
      }
      lineNumbersEl.textContent = nums;
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { codeView: root.JSONViewer.codeView };
}
