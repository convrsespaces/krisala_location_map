const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const LANDMARKS_DIR = path.join(__dirname, "../public/landmarks");

async function generateLowQualityLandmarks() {
  try {
    const files = fs
      .readdirSync(LANDMARKS_DIR)
      .filter((file) => file.endsWith(".webp"));

    for (const file of files) {
      const inputPath = path.join(LANDMARKS_DIR, file);
      const outputPath = path.join(
        LANDMARKS_DIR,
        file.replace(".webp", "-low.webp")
      );

      await sharp(inputPath)
        .resize({ width: 20 })
        .webp({
          quality: 20,
          effort: 0,
        })
        .toFile(outputPath);
    }
  } catch {
    process.exit(1);
  }
}

generateLowQualityLandmarks();
