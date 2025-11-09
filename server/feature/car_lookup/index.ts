import { getPricesForCity } from "@feature/price_lookup";
import { Car, CompoundPricing, FuelType, SearchResult } from "@model/data";
import { CompoundFilter } from "@model/filter";
import { CarCsvEntry } from "@model/load";
import { parse } from "csv-parse/sync";

const fuelKeyMap: Record<FuelType, keyof CompoundPricing> = {
  Gasoline: 'gasoline',
  Diesel: 'diesel',
  Hybrid: 'electric',
  Other: 'electric',
};

function normalizeHigherBetter(value: number, target: number, average: number): number {
    if (value >= target) return 1;
    const diff = target - value;
    return Math.max(0, 1 - (diff / average));
}

function normalizeLowerBetter(value: number, target: number, average: number): number {
    if (value <= target) return 1;
    const diff = value - target;
    return Math.max(0, 1 - (diff / average));
}

function calculateScore(car: Car, filters: CompoundFilter, stats: { avgPrice: number, avgMpg: number, avgMileage: number }, priceWeight: number = 1): number {
    console.time(`calculateScore for ${car.model}`);
    let score = 0;
    
    if (filters.priceTarget) {
        score += normalizeLowerBetter(car.stickerPrice, filters.priceTarget, stats.avgPrice) 
            * filters.pricePriority * priceWeight;
    }
    
    if (filters.mpgTarget) {
        score += normalizeHigherBetter(car.mpg, filters.mpgTarget, stats.avgMpg) 
            * filters.mpgPriority;
    }
    
    if (filters.mileageTarget) {
        score += normalizeLowerBetter(car.mileage, filters.mileageTarget, stats.avgMileage) 
            * filters.mileagePriority;
    }
    
    // Handle hybrid scoring
    if (filters.electric) {
        const hybridScore = car.fuelType === 'Hybrid' ? 
            (filters.commuteDistance <= 30 ? 1 : 0.5) : 0;
        score += hybridScore * filters.electricPriority;
    }

    console.timeEnd(`calculateScore for ${car.model}`);
    return score;
}

export async function getAvailableVehicles(filters: CompoundFilter): Promise<SearchResult> {
    console.time('getAvailableVehicles');
    
    console.time('loading CSV');
    const text = await Bun.file("data/toyota.csv").text();
    const rows = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    }) as CarCsvEntry[];
    console.timeEnd('loading CSV');

    console.time('fetching gas prices');
    const gasPrice = await getPricesForCity(filters.city) ?? {
        gasoline: 3,
        diesel: 4,
        electric: 0
    };
    console.timeEnd('fetching gas prices');

    console.time('processing cars');
    const cars = await Promise.all(rows.map(async (r) => ({
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
        estimatedDailyCost: gasPrice[fuelKeyMap[r.fuelType]] * filters.commuteDistance / r.mpg,
        score: -1
    } as Car)));
    console.timeEnd('processing cars');

    console.time('calculating stats');
    const stats = {
        avgPrice: cars.reduce((sum, car) => sum + car.stickerPrice, 0) / cars.length,
        avgMpg: cars.reduce((sum, car) => sum + car.mpg, 0) / cars.length,
        avgMileage: cars.reduce((sum, car) => sum + car.mileage, 0) / cars.length,
    };
    console.timeEnd('calculating stats');

    console.time('scoring and sorting');
    const scoredCars = cars.map(car => {
        const normalScore = calculateScore(car, filters, stats);
        const budgetScore = calculateScore(car, filters, stats, 2);
        const luxuryScore = calculateScore(car, filters, stats, 0.5);
        return {
            car: { ...car, score: normalScore },
            normalScore,
            budgetScore,
            luxuryScore
        };
    });

    // Sort functions with different tiebreakers for each category
    const sortByOverall = (a: typeof scoredCars[0], b: typeof scoredCars[0]) => {
        const scoreDiff = b.normalScore - a.normalScore;
        if (Math.abs(scoreDiff) < 0.001) {
            // Tiebreaker: Average of mileage rank and year rank
            const mileageA = Number(a.car.mileage);
            const mileageB = Number(b.car.mileage);
            const yearA = Number(a.car.year);
            const yearB = Number(b.car.year);
            return (mileageA - mileageB) / stats.avgMileage - (yearB - yearA) / 10; // Lower mileage and higher year is better
        }
        return scoreDiff;
    };

    const sortByBudget = (a: typeof scoredCars[0], b: typeof scoredCars[0]) => {
        const scoreDiff = b.budgetScore - a.budgetScore;
        if (Math.abs(scoreDiff) < 0.001) {
            return Number(a.car.stickerPrice) - Number(b.car.stickerPrice); // Lower price wins
        }
        return scoreDiff;
    };

    const sortByLuxury = (a: typeof scoredCars[0], b: typeof scoredCars[0]) => {
        const scoreDiff = b.luxuryScore - a.luxuryScore;
        if (Math.abs(scoreDiff) < 0.001) {
            // Find the one closest to 25% above target price
            const targetPrice = filters.priceTarget ? filters.priceTarget * 1.25 : stats.avgPrice * 1.25;
            const diffA = Math.abs(Number(a.car.stickerPrice) - targetPrice);
            const diffB = Math.abs(Number(b.car.stickerPrice) - targetPrice);
            return diffA - diffB; // Smaller difference wins
        }
        return scoreDiff;
    };

    // Sort and select cars using new criteria
    scoredCars.sort(sortByOverall);
    const bestFit = scoredCars[0].car;

    const budgetSorted = [...scoredCars].sort(sortByBudget);
    const budgetPick = budgetSorted.find(sc => sc.car.model !== bestFit.model) ?? budgetSorted[0];

    const luxurySorted = [...scoredCars].sort(sortByLuxury);
    const luxuryPick = luxurySorted.find(sc => 
        sc.car.model !== bestFit.model && 
        sc.car.model !== budgetPick.car.model
    ) ?? luxurySorted[0];

    const result = {
        bestFit,
        budgetPick: { ...budgetPick.car, score: budgetPick.budgetScore },
        luxuryPick: { ...luxuryPick.car, score: luxuryPick.luxuryScore },
        otherOptions: scoredCars
            .filter(sc => 
                sc.car.model !== bestFit.model && 
                sc.car.model !== budgetPick.car.model && 
                sc.car.model !== luxuryPick.car.model
            )
            .map(sc => sc.car)
    };
    
    console.timeEnd('getAvailableVehicles');
    return result;
}