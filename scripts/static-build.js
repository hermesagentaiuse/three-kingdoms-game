// 靜態匯出（GitHub Pages）建置腳本：
// 1. 暫時把 src/app/api（Next route handlers，需要伺服器）移出
// 2. 以 output:export 模式 build
// 3. 移回 api 目錄
// 用法：node scripts/static-build.js [basePath]
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const apiDir = path.join(root, 'src', 'app', 'api');
const apiStash = path.join(root, 'src', 'app', '_api_stash');

const basePath = process.argv[2] || '';

function main() {
  const hadApi = fs.existsSync(apiDir);
  if (hadApi) fs.renameSync(apiDir, apiStash);
  try {
    execSync('npx next build', {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        BUILD_EXPORT: '1',
        NEXT_PUBLIC_BASE_PATH: basePath,
        NEXT_PUBLIC_STATIC: '1',
      },
    });
  } finally {
    if (hadApi && fs.existsSync(apiStash)) fs.renameSync(apiStash, apiDir);
  }
}

main();
