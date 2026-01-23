const targetPath = require('path').resolve(__dirname, 'src/packages');

const { execSync } = require('child_process');

const localCommitId = execSync('git rev-parse HEAD', {
  cwd: targetPath,
  encoding: 'utf8',
});

const remoteCommitId = execSync('git ls-remote origin master', {
  cwd: targetPath,
  encoding: 'utf8',
});

if (!remoteCommitId.trim().startsWith(localCommitId.trim())) {
  throw new Error('请检查src/packages是否为最新代码');
}
