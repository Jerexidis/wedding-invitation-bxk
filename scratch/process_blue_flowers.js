import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = [
    { id: 'watercolor-frame', path: 'C:\\Users\\Luisj\\.gemini\\antigravity-ide\\brain\\9aa52cea-cbe8-40ce-876a-8df1073b459f\\media__1787340269513.jpg' },
    { id: 'blue-cluster-soft', path: 'C:\\Users\\Luisj\\.gemini\\antigravity-ide\\brain\\9aa52cea-cbe8-40ce-876a-8df1073b459f\\media__1787340269543.jpg' },
    { id: 'blue-cluster-dark', path: 'C:\\Users\\Luisj\\.gemini\\antigravity-ide\\brain\\9aa52cea-cbe8-40ce-876a-8df1073b459f\\media__1787340269570.jpg' },
    { id: 'plumbago-stem', path: 'C:\\Users\\Luisj\\.gemini\\antigravity-ide\\brain\\9aa52cea-cbe8-40ce-876a-8df1073b459f\\media__1787340269622.jpg' },
    { id: 'blue-petals-scatter', path: 'C:\\Users\\Luisj\\.gemini\\antigravity-ide\\brain\\9aa52cea-cbe8-40ce-876a-8df1073b459f\\media__1787340269631.jpg' }
];

const outDir = 'c:\\Users\\Luisj\\Escritorio\\wedding-invitation-bxk\\public\\invitations\\eiza-camila\\img';

async function removeBackground(fileObj) {
    const image = sharp(fileObj.path);
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    // Sample corner pixels to detect background color
    let bgR = 0, bgG = 0, bgB = 0;
    let samples = 0;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const idx = (y * info.width + x) * 4;
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            samples++;
        }
    }
    bgR /= samples;
    bgG /= samples;
    bgB /= samples;
    console.log(`Processing ${fileObj.id}, detected BG: rgb(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`);

    const thresholdLow = 30; // distance at which pixel is 100% transparent
    const thresholdHigh = 80; // distance at which pixel is 100% opaque

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean distance to background color
        const dist = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
        );

        if (dist < thresholdLow) {
            data[i + 3] = 0;
        } else if (dist < thresholdHigh) {
            const alphaFactor = (dist - thresholdLow) / (thresholdHigh - thresholdLow);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
    }

    const outPath = path.join(outDir, `${fileObj.id}.webp`);
    await sharp(data, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    }).webp({ quality: 90, lossless: false }).toFile(outPath);
    console.log(`Saved transparent image to ${outPath}`);
}

async function run() {
    for (const f of files) {
        await removeBackground(f);
    }
}

run().catch(console.error);
