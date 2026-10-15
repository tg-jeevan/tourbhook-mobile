const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const SOURCE_PATH = path.resolve(__dirname, '../assets/images/tourBhookOfficialLogoSymbol.png');

function sampleBilinear(src, x, y) {
  if (x < 0 || x >= src.width - 1 || y < 0 || y >= src.height - 1) {
    if (x >= -1 && x < src.width && y >= -1 && y < src.height) {
      const clampX = Math.max(0, Math.min(src.width - 1, Math.round(x)));
      const clampY = Math.max(0, Math.min(src.height - 1, Math.round(y)));
      const idx = (src.width * clampY + clampX) << 2;
      const a = src.data[idx + 3] < 8 ? 0 : src.data[idx + 3];
      return [src.data[idx], src.data[idx + 1], src.data[idx + 2], a];
    }
    return [0, 0, 0, 0];
  }

  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  const dx = x - x0;
  const dy = y - y0;

  const idx00 = (src.width * y0 + x0) << 2;
  const idx10 = (src.width * y0 + x1) << 2;
  const idx01 = (src.width * y1 + x0) << 2;
  const idx11 = (src.width * y1 + x1) << 2;

  const a00 = src.data[idx00 + 3] < 8 ? 0 : src.data[idx00 + 3];
  const a10 = src.data[idx10 + 3] < 8 ? 0 : src.data[idx10 + 3];
  const a01 = src.data[idx01 + 3] < 8 ? 0 : src.data[idx01 + 3];
  const a11 = src.data[idx11 + 3] < 8 ? 0 : src.data[idx11 + 3];

  const r00 = (src.data[idx00] * a00) / 255;
  const g00 = (src.data[idx00 + 1] * a00) / 255;
  const b00 = (src.data[idx00 + 2] * a00) / 255;

  const r10 = (src.data[idx10] * a10) / 255;
  const g10 = (src.data[idx10 + 1] * a10) / 255;
  const b10 = (src.data[idx10 + 2] * a10) / 255;

  const r01 = (src.data[idx01] * a01) / 255;
  const g01 = (src.data[idx01 + 1] * a01) / 255;
  const b01 = (src.data[idx01 + 2] * a01) / 255;

  const r11 = (src.data[idx11] * a11) / 255;
  const g11 = (src.data[idx11 + 1] * a11) / 255;
  const b11 = (src.data[idx11 + 2] * a11) / 255;

  const w00 = (1 - dx) * (1 - dy);
  const w10 = dx * (1 - dy);
  const w01 = (1 - dx) * dy;
  const w11 = dx * dy;

  const r = r00 * w00 + r10 * w10 + r01 * w01 + r11 * w11;
  const g = g00 * w00 + g10 * w10 + g01 * w01 + g11 * w11;
  const b = b00 * w00 + b10 * w10 + b01 * w01 + b11 * w11;
  const a = a00 * w00 + a10 * w10 + a01 * w01 + a11 * w11;

  return [r, g, b, a];
}

function renderIcon(src, size, occupancy = 0.74, subSamples = 3) {
  const dest = new PNG({ width: size, height: size });

  // Content bounding box: x in [187, 859], y in [131, 865]
  const contentW = 859 - 187 + 1; // 673
  const contentH = 865 - 131 + 1; // 735
  const cx = (187 + 859) / 2;
  const cy = (131 + 865) / 2;

  const maxDim = Math.max(contentW, contentH);
  const scale = (size * occupancy) / maxDim;

  const destCx = size / 2;
  const destCy = size / 2;

  const totalSub = subSamples * subSamples;

  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      let accR = 0, accG = 0, accB = 0, accA = 0;

      for (let sy = 0; sy < subSamples; sy++) {
        for (let sx = 0; sx < subSamples; sx++) {
          const subX = dx - 0.5 + (sx + 0.5) / subSamples;
          const subY = dy - 0.5 + (sy + 0.5) / subSamples;

          const srcX = cx + (subX - destCx) / scale;
          const srcY = cy + (subY - destCy) / scale;

          const [r, g, b, a] = sampleBilinear(src, srcX, srcY);
          accR += r;
          accG += g;
          accB += b;
          accA += a;
        }
      }

      const avgA = accA / totalSub;
      const dIdx = (size * dy + dx) << 2;

      if (avgA <= 0.5) {
        dest.data[dIdx] = 0;
        dest.data[dIdx + 1] = 0;
        dest.data[dIdx + 2] = 0;
        dest.data[dIdx + 3] = 0;
      } else {
        const finalA = Math.min(255, Math.round(avgA));
        const finalR = Math.min(255, Math.max(0, Math.round(((accR / totalSub) * 255) / avgA)));
        const finalG = Math.min(255, Math.max(0, Math.round(((accG / totalSub) * 255) / avgA)));
        const finalB = Math.min(255, Math.max(0, Math.round(((accB / totalSub) * 255) / avgA)));

        dest.data[dIdx] = finalR;
        dest.data[dIdx + 1] = finalG;
        dest.data[dIdx + 2] = finalB;
        dest.data[dIdx + 3] = finalA;
      }
    }
  }

  return dest;
}

function writePngSync(png, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(destPath, buffer);
}

function main() {
  console.log('Loading source image...');
  const srcBuffer = fs.readFileSync(SOURCE_PATH);
  const src = PNG.sync.read(srcBuffer);
  console.log(`Loaded source image: ${src.width}x${src.height}`);

  const androidDensities = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  const resBase = path.resolve(__dirname, '../android/app/src/main/res');

  for (const { dir, size } of androidDensities) {
    console.log(`Rendering ${dir} (${size}x${size})...`);
    const icon = renderIcon(src, size, 0.74, 3);
    writePngSync(icon, path.join(resBase, dir, 'ic_launcher.png'));
    writePngSync(icon, path.join(resBase, dir, 'ic_launcher_round.png'));
    console.log(`Saved ${dir}/ic_launcher.png and ic_launcher_round.png`);
  }

  // 512x512 Store icon
  console.log('Rendering 512x512 store icon...');
  const icon512 = renderIcon(src, 512, 0.74, 2);
  writePngSync(icon512, path.join(resBase, 'drawable', 'ic_launcher.png'));
  console.log('Saved drawable/ic_launcher.png (512x512)');

  console.log('SUCCESS: All app icons generated!');
}

main();
