import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const manifestPath = resolve(process.cwd(), 'android/app/src/main/AndroidManifest.xml');
let xml;
try {
  xml = readFileSync(manifestPath, 'utf8');
} catch {
  console.error('AndroidManifest.xml was not found. Run `npx cap add android` first.');
  process.exit(1);
}

const activityPattern = /<activity\b(?=[^>]*android:name=["'][^"']*MainActivity["'])[^>]*>/s;
const match = xml.match(activityPattern);
if (!match) {
  console.error('Could not find the MainActivity element in AndroidManifest.xml.');
  process.exit(1);
}

let activityTag = match[0];
if (/android:screenOrientation=/.test(activityTag)) {
  activityTag = activityTag.replace(/android:screenOrientation=["'][^"']*["']/, 'android:screenOrientation="portrait"');
} else {
  activityTag = activityTag.replace(/>$/, ' android:screenOrientation="portrait">');
}
xml = xml.replace(match[0], activityTag);
writeFileSync(manifestPath, xml, 'utf8');
console.log('Android orientation locked to portrait.');
