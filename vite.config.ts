import { defineConfig } from 'vite';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/wed.instant/' : '/',
});
