import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'build');

const files = ['login.html', 'admin.html'];
const dirs = ['images'];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

function main() {
  ensureDir(outDir);

  for (const file of files) {
    const src = path.join(root, file);
    const dest = path.join(outDir, file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      console.log(`Copied ${file}`);
    } else {
      console.warn(`Skipping missing file: ${file}`);
    }
  }

  for (const dir of dirs) {
    const src = path.join(root, dir);
    const dest = path.join(outDir, dir);
    copyDir(src, dest);
    console.log(`Copied directory ${dir}`);
  }
}

main();
