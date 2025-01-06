import type { UserConfigExport } from 'vitest/config';

import vite from './vite.config';

export default {
  plugins: vite.plugins,
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        '**/*.{d,config,mock,fixture,interface,bench}.{ts}',
        '**/{index,main}.{ts}',
        '**/__{tests,mocks,fixtures}__',
        '**/*.dto.ts',
        '**/*.module.ts',
        '**/*.entity.ts',
        '**/main.ts',
      ],
      include: ['src/**/*.ts'],
      reporter: ['lcov', 'html', 'json'],
    },
    include: ['src/**/*.{spec,test}.ts'],

    reporters: ['verbose'],
    silent: false,
    testTimeout: 6000,
  },
} satisfies UserConfigExport;
