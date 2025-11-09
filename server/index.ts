import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import * as path from 'node:path'
import { generateContent, generatePriorityAdjustments } from '@feature/genai'
import { getPricesForCity } from '@feature/price_lookup'
import { getAvailableVehicles } from '@feature/car_lookup'
import { CompoundFilter } from '@model/filter'
import { FuelType, Transmission } from '@model/data'

// where the Vite build output goes
const dist = path.resolve(import.meta.dir, '../client/dist')

const app = new Elysia()
  // --- API routes (add yours here) ---
  .get('/api/health', () => ({ ok: true }))
  .get('/api/hello', () => ({ message: 'Hello from Elysia!' }))
  .get('/api/gentest', async () => ({ text: await generateContent("This is a test page, please produce a test output.") }))
  .get('/api/prices/:city', ({ params: { city }}) => getPricesForCity(city))
  .get('/api/cars', ({ query }) => {
    const filter = {
      priceTarget: query.priceTarget ? Number(query.priceTarget) : undefined,
      pricePriority: Number(query.pricePriority ?? 1),
      mpgTarget: query.mpgTarget ? Number(query.mpgTarget) : undefined,
      mpgPriority: Number(query.mpgPriority ?? 1),
      transmission: query.transmission as Transmission | undefined,
      transmissionPriority: Number(query.transmissionPriority ?? 1),
      electric: query.electric === 'true',
      electricPriority: Number(query.electricPriority ?? 1),
      mileageTarget: query.mileageTarget ? Number(query.mileageTarget) : undefined,
      mileagePriority: Number(query.mileagePriority ?? 1),
      fuelType: query.fuelType as FuelType | undefined,
      fuelTypePriority: Number(query.fuelTypePriority ?? 1),
      city: query.city as string,
      commuteDistance: Number(query.commuteDistance ?? 0)
    } as CompoundFilter;

    return getAvailableVehicles(filter)
  })
  .post('/api/refine', async ({ body }) => {
    const { refinementQuery, currentFilters } = body as { refinementQuery: string, currentFilters: CompoundFilter };
    
    // Extract current priorities
    const currentPriorities = {
      pricePriority: currentFilters.pricePriority,
      mpgPriority: currentFilters.mpgPriority,
      transmissionPriority: currentFilters.transmissionPriority,
      electricPriority: currentFilters.electricPriority,
      mileagePriority: currentFilters.mileagePriority,
      fuelTypePriority: currentFilters.fuelTypePriority,
    };
    
    // Get adjusted priorities from Gemini (only priorities, not values)
    const adjustedPriorities = await generatePriorityAdjustments(refinementQuery, currentPriorities);
    
    // Clamp priorities to 1-10 range
    const clampPriority = (p: number) => Math.max(1, Math.min(10, Math.round(p)));
    
    // Return updated filters with new priorities but same values
    const updatedFilters: CompoundFilter = {
      ...currentFilters,
      pricePriority: clampPriority(adjustedPriorities.pricePriority),
      mpgPriority: clampPriority(adjustedPriorities.mpgPriority),
      transmissionPriority: clampPriority(adjustedPriorities.transmissionPriority),
      electricPriority: clampPriority(adjustedPriorities.electricPriority),
      mileagePriority: clampPriority(adjustedPriorities.mileagePriority),
      fuelTypePriority: clampPriority(adjustedPriorities.fuelTypePriority),
    };
    
    return updatedFilters;
  })

  // --- static files from Vite build ---
  .use(staticPlugin({ assets: dist, prefix: '/', }))

  // --- SPA fallback (send index.html for anything not matched above) ---
  .get('*', () => new Response(Bun.file(path.join(dist, 'index.html')), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  }))

  .listen(3000)

console.log(`🚀 Elysia running on http://${app.server?.hostname}:${app.server?.port}`)


