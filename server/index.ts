import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import * as path from 'node:path'
import { generateContent } from '@feature/genai'
import { getPricesForCity } from '@feature/price_lookup'

// where the Vite build output goes
const dist = path.resolve(import.meta.dir, '../client/dist')

const app = new Elysia()
  // --- API routes (add yours here) ---
  .get('/api/health', () => ({ ok: true }))
  .get('/api/hello', () => ({ message: 'Hello from Elysia!' }))
  .get('/api/gentest', async () => ({ text: await generateContent("This is a test page, please produce a test output.") }))
  .get('/api/prices/:city', ({ params: { city }}) => getPricesForCity(city))

  // --- static files from Vite build ---
  .use(staticPlugin({ assets: dist, prefix: '/', }))

  // --- SPA fallback (send index.html for anything not matched above) ---
  .get('*', () => new Response(Bun.file(path.join(dist, 'index.html')), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }))

  .listen(3000)

console.log(`🚀 Elysia running on http://${app.server?.hostname}:${app.server?.port}`)


