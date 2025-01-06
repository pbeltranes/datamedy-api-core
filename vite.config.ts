import swc from 'unplugin-swc';
import type { UserConfigExport } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        compact: true,
        preserveModules: true,
      },
    },
    // sourcemap: tsconfig.sourceMap,
    ssr: 'src/main.ts',
    // target: tsconfig.target,
    terserOptions: { keep_classnames: true },
  },
  plugins: [swc.vite({ tsconfigFile: 'tsconfig.json' }), tsconfigPaths()],
} satisfies UserConfigExport;

/**
 * Generates build package.json.
 */
