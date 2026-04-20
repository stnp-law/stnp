/**
 * Decode HTML entities from WordPress API responses.
 * WP returns titles with entities like &#8211; &#8217; etc.
 */
export function decodeHtmlEntities(str) {
  if (!str) return '';
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8216;': '\u2018',
    '&#8217;': '\u2019',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
    '&#8230;': '…',
    '&nbsp;': ' ',
  };
  
  let decoded = str;
  // Replace named/numeric entities
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replaceAll(entity, char);
  }
  // Handle any remaining numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
  // Strip any remaining HTML tags
  decoded = decoded.replace(/<[^>]+>/g, '');
  return decoded;
}

/**
 * Strip HTML tags from a string (for excerpts)
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}
