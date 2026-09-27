/* ============================================================================
   VARENYA CAFE & BAKERY — Cloudinary photo lister (COMPUTER par chalao, website mein nahi)
   ----------------------------------------------------------------------------
   Ye script tumhare Cloudinary account se menu photos ki list nikaal kar
   `cloudinary-images.json` file banata hai. Us file se public_id copy karke
   menu.js mein  image: "public_id"  likh do.

   CHALANE KE STEPS (sirf ek baar setup):
   1. Is folder mein terminal kholo aur likho:
         npm install cloudinary dotenv
   2. `.env` naam ki file banao (`.env.example` dekho) aur apni keys likho.
   3. Phir likho:
         node fetch-images.js

   NOTE: Ye secret keys wali file kabhi website (index.html / menu.js)
   mein MAT daalo — .env hamesha sirf tumhare computer par rehta hai.
   ============================================================================ */

require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Logo / sample photos jo MENU mein nahi chahiye:
const excludedImages = new Set([
  "main-sample",
  "LOGO2",
  "BHOKALI_BHOJ_RESTRAUEANT_LOGO",
  "LOGO",
  "cld-sample-5",
  "cld-sample-3",
  "cld-sample-4",
  "cld-sample-2",
  "cld-sample",
  "sample",
]);

async function main() {
  try {
    let nextCursor = undefined;
    const menuImages = [];

    // Saari photos lao (500 ek baar mein, zaroorat ho to aur pages):
    do {
      const result = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        max_results: 500,
        next_cursor: nextCursor,
      });
      for (const image of result.resources) {
        if (excludedImages.has(image.public_id)) continue;
        menuImages.push({
          public_id: image.public_id,
          // Website ke liye ready optimized link (600px, auto quality/format):
          url: cloudinary.url(image.public_id, {
            width: 600,
            crop: "fill",
            quality: "auto",
            fetch_format: "auto",
            secure: true,
          }),
          width: image.width,
          height: image.height,
          format: image.format,
        });
      }
      nextCursor = result.next_cursor;
    } while (nextCursor);

    fs.writeFileSync("cloudinary-images.json", JSON.stringify(menuImages, null, 2));
    console.log(`\n✅ ${menuImages.length} photos mili — cloudinary-images.json mein save ho gayi.\n`);
    console.log("menu.js mein aise use karo (koi ek line per item):");
    console.log('   image: "PUBLIC_ID_YAHAN"   (CLOUDINARY_CLOUD_NAME set ho to)');
    console.log('   image: "https://...585_wala_url"   (direct link bhi chalega)\n');
    menuImages.slice(0, 20).forEach((m) => console.log(" -", m.public_id));
    if (menuImages.length > 20) console.log(` ... aur ${menuImages.length - 20} photos json file mein`);
  } catch (error) {
    console.error("\n❌ Error:");
    console.error(error.message);
    console.error("\nCheck karo: .env file mein 3 keys sahi likhi hain?");
  }
}

main();
