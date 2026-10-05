export const OPTIONS_KEY = '__options'

export const getProductOptions = (product = {}) => {
  const config = product.specs?.[OPTIONS_KEY]
  if (config?.enabled !== true || !Array.isArray(config.groups)) return []
  return config.groups.filter((group) => typeof group.name === 'string' && Array.isArray(group.values))
    .map((group) => ({ name: group.name.trim(), values: [...new Set(group.values.filter((value) => typeof value === 'string').map((value) => value.trim()).filter(Boolean))] }))
    .filter((group) => group.name && group.values.length)
}

export const validateProductSelection = (product, selected = {}) => {
  const groups = getProductOptions(product)
  if (!selected || typeof selected !== 'object' || Array.isArray(selected)) return 'Please choose the product options.'
  for (const group of groups) {
    if (!group.values.includes(selected[group.name])) return `Please choose an available ${group.name.toLowerCase()} for ${product.name}.`
  }
  if (Object.keys(selected).some((key) => !groups.some((group) => group.name === key))) return `The options for ${product.name} have changed. Please remove it from your cart and choose again.`
  return ''
}

export const optionSummary = (selected = {}) => Object.entries(selected || {}).filter(([, value]) => typeof value === 'string').map(([name, value]) => `${name}: ${value}`).join(' / ')

export const cartItemKey = (item) => {
  const entries = Object.entries(item.selectedOptions || {}).filter(([, value]) => typeof value === 'string').sort(([a], [b]) => a.localeCompare(b))
  return entries.length ? `${item.id}::${JSON.stringify(entries)}` : String(item.id)
}
