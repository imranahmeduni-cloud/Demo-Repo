const fetchProduct = async (barcode) => {
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );
  const data = await res.json();
  
  if (data.status === 1) {
    return data.product; // has name, ingredients, nutrition, etc.
  } else {
    return null; // product not found
  }
};
