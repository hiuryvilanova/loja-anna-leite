import { defineConfig } from 'vite';

export default defineConfig({
  base: '/loja-anna-leite/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        politica: './politica-privacidade.html',
        termos: './termos-uso.html'
      }
    }
  }
});
