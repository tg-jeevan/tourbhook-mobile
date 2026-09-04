const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Create a 1x100 pixel image
const width = 1;
const height = 100;
const png = new PNG({ width, height });

// Generate gradient
for (let y = 0; y < height; y++) {
  const percent = y / (height - 1);
  let alphaVal = 0;

  if (percent <= 0.3) {
    // Interpolate between 0.6 and 0.3
    const t = percent / 0.3;
    alphaVal = 0.6 + t * (0.3 - 0.6);
  } else if (percent <= 0.6) {
    // Interpolate between 0.3 and 0.7
    const t = (percent - 0.3) / 0.3;
    alphaVal = 0.3 + t * (0.7 - 0.3);
  } else {
    // Interpolate between 0.7 and 0.9
    const t = (percent - 0.6) / 0.4;
    alphaVal = 0.7 + t * (0.9 - 0.7);
  }

  // PNG data is RGBA, so 4 bytes per pixel.
  const idx = y * 4;
  png.data[idx] = 0;     // Red
  png.data[idx + 1] = 0; // Green
  png.data[idx + 2] = 0; // Blue
  png.data[idx + 3] = Math.round(alphaVal * 255); // Alpha (0-255)
}

// Write to file
const dir = path.join(__dirname, '../assets/images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const filePath = path.join(dir, 'gradientOverlay.png');

png.pack()
  .pipe(fs.createWriteStream(filePath))
  .on('finish', () => {
    console.log('Successfully generated gradientOverlay.png!');
  });
