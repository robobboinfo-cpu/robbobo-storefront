import test from 'node:test'
import assert from 'node:assert/strict'
import { getProductOptions, validateProductSelection, cartItemKey } from './productOptions.js'

const product = { id: 'shirt', name: 'Shirt', specs: { __options: { enabled: true, groups: [{ name: 'Size', values: ['M', 'L'] }, { name: 'Colour', values: ['Black', 'White'] }] } } }

test('only explicitly enabled choices appear, regardless of category', () => {
  assert.deepEqual(getProductOptions({ category: 'Fashion', specs: { sizes: 'M,L' } }), [])
  assert.deepEqual(getProductOptions({ ...product, specs: { __options: { ...product.specs.__options, enabled: false } } }), [])
  assert.equal(getProductOptions(product).length, 2)
})
test('missing, invalid and retired selections cannot pass checkout validation', () => {
  assert.ok(validateProductSelection(product, {}))
  assert.ok(validateProductSelection(product, { Size: 'XXL', Colour: 'Black' }))
  assert.ok(validateProductSelection(product, { Size: 'M', Colour: 'Black', Waist: '32' }))
  assert.equal(validateProductSelection(product, { Size: 'M', Colour: 'Black' }), '')
  assert.equal(validateProductSelection({ id: 'simple' }, {}), '')
  assert.ok(validateProductSelection({ id: 'simple' }, { Size: 'M' }))
})
test('variants have stable separate cart identities without changing product IDs', () => {
  const medium = { ...product, selectedOptions: { Size: 'M', Colour: 'Black' } }
  assert.equal(cartItemKey(medium), cartItemKey({ ...product, selectedOptions: { Colour: 'Black', Size: 'M' } }))
  assert.notEqual(cartItemKey(medium), cartItemKey({ ...product, selectedOptions: { Size: 'L', Colour: 'Black' } }))
  assert.equal(cartItemKey({ id: 'legacy' }), 'legacy')
  assert.equal(medium.id, 'shirt')
})
