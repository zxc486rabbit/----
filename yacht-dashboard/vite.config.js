import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/yacht-dashboard/', // 👈 這個必須寫你的 repo 名稱
})