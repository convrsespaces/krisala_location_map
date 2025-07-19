const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MAPS_DIR = path.join(__dirname, "../public/maps");

async function generateLowQualityMaps() {
  try {
    const files = fs
      .readdirSync(MAPS_DIR)
      .filter((file) => file.startsWith("map-") && file.endsWith(".webp"));

    for (const file of files) {
      const inputPath = path.join(MAPS_DIR, file);
      const outputPath = path.join(
        MAPS_DIR,
        file.replace("map-", "").replace(".webp", "-low.webp")
      );

      await sharp(inputPath)
        .resize(50, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 50,
          effort: 0,
        })
        .toFile(outputPath);
    }
  } catch {
    process.exit(1);
  }
}

generateLowQualityMaps();
