export default function mockPrices(barcode) {
  // Simple deterministic seed so the same barcode always shows the same prices.
  const seed = (barcode || '')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  // Base price shifts by barcode, then each store adds its own margin.
  const base = 12.5 + (seed % 7) * 0.85;

  return [
    {
      store: 'Amazon',
      price: Number((base + 0.39).toFixed(2)),
      delivery: 1,
      stock: 'In stock',
    },
    {
      store: 'Walmart',
      price: Number((base + 0.92).toFixed(2)),
      delivery: 2,
      stock: 'Limited stock',
    },
    {
      store: 'Target',
      price: Number((base + 1.21).toFixed(2)),
      delivery: 2,
      stock: 'In stock',
    },
    {
      store: 'Best Buy',
      price: Number((base + 1.56).toFixed(2)),
      delivery: 3,
      stock: 'In stock',
    },
  ].sort((a, b) => a.price - b.price);
}
