import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextCLI = require.resolve('next/dist/bin/next');
const result = spawnSync(process.execPath, [nextCLI, 'build', '--webpack'], {
  stdio: 'inherit',
  env: { ...process.env, AEON_STATIC_EXPORT: '1' },
});
process.exit(result.status ?? 1);
