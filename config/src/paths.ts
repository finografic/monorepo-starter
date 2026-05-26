import fs from 'node:fs';
import path from 'node:path';

export function findRootDir(): string {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return process.cwd();
}

const rootDir = findRootDir();
const dataDir = process.env.DATA_DIR || 'data';

export const paths = {
  root: rootDir,
  data: {
    dir: path.join(rootDir, dataDir),
    path: (...segments: string[]): string => path.join(rootDir, dataDir, ...segments),
  },
} as const;
