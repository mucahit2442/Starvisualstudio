import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const products = JSON.parse(readFileSync(path.join(root, "data/seed-products.json"), "utf8"));
const etsyLinks = JSON.parse(readFileSync(path.join(root, "data/etsy-links.json"), "utf8"));
const pages = ["index.html", "collection.html", "about.html", "contact.html"];
const errors = [];

if (products.length !== 120) errors.push(`Expected 120 seed products, found ${products.length}.`);

for (const product of products) {
  if (!Number.isInteger(product.id)) errors.push(`Product has an invalid id: ${product.title ?? "unknown"}`);
  if (!product.title || !product.category || !product.image) errors.push(`Product ${product.id} is missing required data.`);
  if (!product.image.startsWith("https://")) {
    const imagePath = path.join(publicDir, product.image.replace(/^\//, ""));
    if (!existsSync(imagePath)) errors.push(`Missing product image: ${product.image}`);
  }
}

for (const [id, url] of Object.entries(etsyLinks)) {
  if (!products.some((product) => String(product.id) === id)) errors.push(`Etsy link references unknown product ${id}.`);
  if (!/^https:\/\/(?:www\.)?etsy\.com\//.test(url)) errors.push(`Invalid Etsy URL for product ${id}.`);
}

for (const page of pages) {
  const filePath = path.join(publicDir, page);
  if (!existsSync(filePath)) {
    errors.push(`Missing page: ${page}`);
    continue;
  }
  const html = readFileSync(filePath, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1].split(/[?#]/, 1)[0];
    if (!reference || reference.startsWith("http") || reference.startsWith("tel:") || reference.startsWith("/api/") || reference === "/admin" || reference === "/account") continue;
    const target = path.join(publicDir, reference.replace(/^\//, ""));
    if (!existsSync(target)) errors.push(`${page} references missing file: ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${pages.length} pages, ${products.length} products and ${Object.keys(etsyLinks).length} direct Etsy links.`);
