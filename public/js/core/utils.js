/**
 * Yordamchi Funksiyalar (Utilities)
 */

window.JSONViewer = window.JSONViewer || {};

window.JSONViewer.utils = {
  /**
   * Obyekt kalitlarini alifbo bo'yicha (A-Z) rekursiv saralash
   */
  sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
      return obj.map(window.JSONViewer.utils.sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .reduce((result, key) => {
          result[key] = window.JSONViewer.utils.sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  },

  /**
   * Obyektning ichma-ich chuqurligini hisoblash
   */
  calculateDepth(obj) {
    if (obj === null || typeof obj !== 'object') return 0;
    let maxChildDepth = 0;
    for (const key of Object.keys(obj)) {
      maxChildDepth = Math.max(maxChildDepth, this.calculateDepth(obj[key]));
    }
    return 1 + maxChildDepth;
  },

  /**
   * Jami kalitlar sonini hisoblash
   */
  countKeys(obj) {
    if (obj === null || typeof obj !== 'object') return 0;
    let count = 0;
    if (!Array.isArray(obj)) {
      count += Object.keys(obj).length;
    }
    for (const key of Object.keys(obj)) {
      count += this.countKeys(obj[key]);
    }
    return count;
  },

  /**
   * Baytlarni odam o'qiy oladigan formatga aylantirish (B, KB, MB)
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Xavfsiz HTML matn yaratish (XSS himoyasi)
   */
  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Vaqtinchalik xotiraga nusxalash
   */
  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (success) resolve();
        else reject(new Error("Nusxalash amalga oshmadi"));
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Faylni yuklab olish
   */
  downloadAsFile(content, fileName = 'formatted.json', mimeType = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
