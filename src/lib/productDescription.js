// Images are stored as standalone Markdown image lines. All other content is
// rendered as plain text; never execute HTML from product descriptions.
export const descriptionParts = (value = '') => String(value).split(/\r?\n/).map((line) => {
  const match = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s]+)\)$/)
  if (match) {
    try {
      const url = new URL(match[2])
      if (['https:', 'http:'].includes(url.protocol)) return { type: 'image', alt: match[1] || 'Product detail', url: url.href }
    } catch { /* Keep invalid image markup as text. */ }
  }
  return { type: 'text', text: line }
})

export const descriptionPreview = (value) => descriptionParts(value).filter((part) => part.type === 'text').map((part) => part.text).join('\n').trim()
