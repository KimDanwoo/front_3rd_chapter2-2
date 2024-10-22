import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/origin/components',
        '@hooks': '/src/origin/hooks',
        '@pages': '/src/origin/pages',
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }),
)
