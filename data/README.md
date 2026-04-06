# Open Food Facts

A React barcode scanning app powered by the [Open Food Facts API](https://world.openfoodfacts.org/).

Scan a barcode -> get the product's name, ingredients, nutrition facts, allergens, and more. No API key needed. Free forever.

---

## Data Source

Product data comes from [Open Food Facts](https://world.openfoodfacts.org/), a free and open food database with millions of products worldwide. Data is licensed under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/).

Lookup any product by barcode:

```
GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json
```

Returns product name, brand, ingredients, nutrition facts (per 100g), allergens, images, Nutri-Score, and more.

---

## License

MIT
