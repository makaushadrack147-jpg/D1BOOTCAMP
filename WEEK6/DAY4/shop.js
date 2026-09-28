const products = require("./products");

function findProduct(productName) {
  return products.find(
    (product) => product.name.toLowerCase() === productName.toLowerCase(),
  );
}

for (const productName of ["Laptop", "Coffee Maker", "Unknown Product"]) {
  const product = findProduct(productName);
  console.log(product ?? `${productName}: product not found`);
}
