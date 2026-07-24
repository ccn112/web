import sharp from "sharp";
import fs from "node:fs";
const buf = await sharp("public/products/xbooking/xbk-15-contract-payment-progress.png").resize({ width: 820 }).jpeg({ quality: 72 }).toBuffer();
console.log("sharp OK, resized bytes:", buf.length);
