/**
 * JSON Parsing Xatoliklarini Tahlil Qiluvchi Modul
 */

const rootErr = typeof window !== 'undefined' ? window : global;
rootErr.JSONViewer = rootErr.JSONViewer || {};

rootErr.JSONViewer.errorParser = {
  /**
   * JSON xatosini o'qib qator va ustunni aniqlash
   */
  parse(rawText, err, lang) {
    let message = (err && err.message) ? err.message : "Xatolik";
    let line = 1;
    let col = 1;

    const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    const posMatch = message.match(/position\s+(\d+)/i);

    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      col = parseInt(lineColMatch[2], 10);
    } else if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const beforePos = rawText.slice(0, pos);
      const lines = beforePos.split('\n');
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }

    const cleanMsg = message.replace(/\s*\(line \d+ column \d+\)/i, '').replace(/\s*at position \d+/i, '');
    const i18n = rootErr.JSONViewer.i18n;
    const lineColStr = i18n ? i18n.t('errorLineCol', { line, col }) : `(Qator: ${line}, Ustun: ${col})`;
    const formattedMessage = `${cleanMsg} ${lineColStr}`;

    return {
      message: formattedMessage,
      line,
      col
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { errorParser: rootErr.JSONViewer.errorParser };
}
