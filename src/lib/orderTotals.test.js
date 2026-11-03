import test from 'node:test'
import assert from 'node:assert/strict'
import { orderTotals } from './orderTotals.js'

test('cart and checkout charge product totals without threshold-based fees or discounts', () => {
  for (const subtotal of [0, 130, 385, 499.99, 500, 600, 12300]) {
    assert.deepEqual(orderTotals(subtotal), { subtotal, shipping: 0, tax: 0, total: subtotal })
  }
  assert.equal(orderTotals(0.1 + 0.2).total, 0.3)
})
