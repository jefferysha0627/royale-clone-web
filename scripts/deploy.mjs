// 部署：node scripts/deploy.mjs cf   → Cloudflare Pages（需要 wrangler 已登入，並設定 CLOUDFLARE_ACCOUNT_ID）
//       node scripts/deploy.mjs gh   → GitHub Pages（推到 gh-pages 分支，需要 gh 已登入）
// 兩個網站的分享預覽絕對網址不同，所以各自用自己的 SITE_URL 建置到不同資料夾。
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const GH_REPO = process.env.GH_REPO ?? 'jefferysha0627/royale-clone-web';
const CF_PROJECT = process.env.CF_PROJECT ?? 'royale-clone-web';
const TARGETS = {
  cf: { site: `https://${CF_PROJECT}.pages.dev/`, out: 'dist-cf' },
  gh: { site: `https://${GH_REPO.split('/')[0]}.github.io/${GH_REPO.split('/')[1]}/`, out: 'dist-gh' },
};

const target = process.argv[2];
if (!(target in TARGETS)) {
  console.error('用法：node scripts/deploy.mjs cf|gh');
  process.exit(1);
}
const { site, out } = TARGETS[target];
const outDir = join(root, out);

function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });
}

// 1. 檢查與建置
run('npx', ['tsc', '--noEmit']);
run('npx', ['vitest', 'run']);
run('npx', ['vite', 'build', '--outDir', out, '--emptyOutDir'], { env: { ...process.env, SITE_URL: site } });

if (target === 'cf') {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('請先設定 CLOUDFLARE_ACCOUNT_ID（要部署的 Cloudflare 帳號 ID，可用 npx wrangler whoami 查詢）。');
    process.exit(1);
  }
  run('npx', ['wrangler', 'pages', 'deploy', out, '--project-name', CF_PROJECT, '--branch', 'main', '--commit-dirty=true']);
} else {
  // GitHub Pages：不用 Jekyll 處理；把建置結果提交到 gh-pages 分支（一般 push，不強制覆蓋）
  writeFileSync(join(outDir, '.nojekyll'), '');
  const work = mkdtempSync(join(tmpdir(), 'royale-gh-pages-'));
  const url = `https://github.com/${GH_REPO}.git`;
  const git = (args) => run('git', ['-c', 'user.name=jefferysha0627', '-c', 'user.email=288326927+jefferysha0627@users.noreply.github.com', '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', ...args], { cwd: work });
  let hasBranch = true;
  try {
    execFileSync('git', ['ls-remote', '--exit-code', '--heads', url, 'gh-pages'], { stdio: 'ignore' });
  } catch {
    hasBranch = false;
  }
  if (hasBranch) git(['clone', '--branch', 'gh-pages', '--depth', '1', url, '.']);
  else {
    git(['init', '-q']);
    git(['checkout', '-q', '--orphan', 'gh-pages']);
    git(['remote', 'add', 'origin', url]);
  }
  for (const f of readdirSync(work)) if (f !== '.git') rmSync(join(work, f), { recursive: true, force: true });
  cpSync(outDir, work, { recursive: true });
  git(['add', '-A']);
  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: work }).toString().trim();
  if (!dirty) console.log('gh-pages 沒有變更，不需要推送。');
  else {
    git(['commit', '-q', '-m', `Deploy ${new Date().toISOString()}`]);
    git(['push', 'origin', 'gh-pages']);
  }
  if (existsSync(work)) rmSync(work, { recursive: true, force: true });
}
console.log(`\n完成：${site}`);
