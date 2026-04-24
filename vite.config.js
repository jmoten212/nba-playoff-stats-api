import { defineConfig } from 'vite'
import {ViteEjsPlugin} from "vite-plugin-ejs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [ViteEjsPlugin()],
  base: '/nba-playoffs-api/'
})
