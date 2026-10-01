import react from '@vitejs/plugin-react'
import { defineConfig, transformWithOxc } from 'vite'

const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.includes('/src/') || !id.endsWith('.js')) return null

    const result = await transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
    })

    return { code: result.code, map: result.map }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [jsxInJs, react()],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: { '.js': 'jsx' },
      transform: { jsx: 'react-jsx' },
    },
  },
})
