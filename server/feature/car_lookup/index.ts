import { getPricesForCity } from "@feature/price_lookup";
import { Car, CompoundPricing, FuelType } from "@model/data";
import { CompoundFilter } from "@model/filter";
import { CarCsvEntry } from "@model/load";
import { parse } from "csv-parse/sync";

const fuelKeyMap: Record<FuelType, keyof CompoundPricing> = {
  Gasoline: 'gasoline',
  Diesel: 'diesel',
  Hybrid: 'electric',
  Other: 'electric',
};

export async function getAvailableVehicles(filters: CompoundFilter): Promise<Car[]> {
    const text = await Bun.file("data/toyota.csv").text();
    const rows = parse(text, {
        columns: true,          // use header row as keys
        skip_empty_lines: true,
        trim: true
    }) as CarCsvEntry[];

    const gasPrice = await getPricesForCity(filters.city) ?? {
        gasoline: 3,
        diesel: 4,
        electric: 0
    };

    return Promise.all(rows.map(async (r) => ({
        model: r.model,
        year: r.year,
        stickerPrice: r.price,
        downPayment: r.price * 0.2,
        monthlyPayment: r.price * 0.8 / 12 * 1.05,
        transmission: r.transmission,
        mileage: r.mileage,
        fuelType: r.fuelType,
        mpg: r.mpg,
        engineSize: r.engineSize,
        estimatedDailyCost: gasPrice[fuelKeyMap[r.fuelType]] * filters.commuteDistance / r.mpg
    } as Car)));
}