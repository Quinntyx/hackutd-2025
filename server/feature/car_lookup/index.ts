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

function calculatePercentageDifference(actual: number, target: number): number {
    return Math.abs((actual - target) / target);
}

function normalizeScore(percentDiff: number): number {
    // Within 10% difference -> full score
    if (percentDiff <= 0.1) percentDiff = 0.1;
    // Otherwise, inverse relationship with percentage difference
    return 1 / (1 + percentDiff);
}

function calculateCarScore(car: Car, filters: CompoundFilter, priceWeight: number = 1): number {
    let totalScore = 0;
    const monthlyPriceTarget = (filters.priceTarget ?? 0) / 12;
    const totalMonthlyPrice = car.monthlyPayment + (car.estimatedDailyCost * 30);

    if (filters.priceTarget) {
        const priceDiff = calculatePercentageDifference(totalMonthlyPrice, monthlyPriceTarget);
        totalScore += normalizeScore(priceDiff) * filters.pricePriority * priceWeight;
    }

    if (filters.mpgTarget) {
        const mpgDiff = calculatePercentageDifference(car.mpg, filters.mpgTarget);
        totalScore += normalizeScore(mpgDiff) * filters.mpgPriority;
    }

    if (filters.mileageTarget) {
        const mileageDiff = calculatePercentageDifference(car.mileage, filters.mileageTarget);
        totalScore += normalizeScore(mileageDiff) * filters.mileagePriority;
    }

    if (filters.electric && car.fuelType === 'Hybrid') {
        const hybridScore = filters.commuteDistance <= 30 ? 1 : 0.5;
        totalScore += hybridScore * filters.electricPriority;
    }

    return totalScore;
}

export async function getAvailableVehicles(filters: CompoundFilter): Promise<SearchResult> {
    console.time('getAvailableVehicles');
    
    const text = await Bun.file("data/toyota.csv").text();
    const rows = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    }) as CarCsvEntry[];

    const gasPrice = await getPricesForCity(filters.city) ?? {
        gasoline: 3,
        diesel: 4,
        electric: 0
    };

    const cars = rows.map((r) => {
        const dailyCost = r.fuelType === 'Hybrid' && filters.commuteDistance > 30
            ? gasPrice.electric * 30 / r.mpg + // First 30 miles on electric
              gasPrice.gasoline * (filters.commuteDistance - 30) / r.mpg // Remaining miles on gas
            : gasPrice[fuelKeyMap[r.fuelType]] * filters.commuteDistance / r.mpg;

        return {
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
            estimatedDailyCost: dailyCost,
            score: 0
        } as Car;
    });

    const scoredCars = cars.map(car => {
        const normalScore = calculateCarScore(car, filters);
        const budgetScore = calculateCarScore(car, filters, 2);
        const luxuryScore = calculateCarScore(car, filters, 0.5);
        return {
            car: { ...car, score: normalScore },
            normalScore,
            budgetScore,
            luxuryScore
        };
    });

    scoredCars.sort((a, b) => b.normalScore - a.normalScore);
    const bestFit = scoredCars[0].car;

    // Find budget pick that's different from bestFit
    const budgetSorted = [...scoredCars].sort((a, b) => b.budgetScore - a.budgetScore);
    const budgetPick = budgetSorted.find(sc => sc.car.model !== bestFit.model)?.car ?? budgetSorted[0].car;

    // Find luxury pick that's different from both bestFit and budgetPick
    const luxurySorted = [...scoredCars].sort((a, b) => b.luxuryScore - a.luxuryScore);
    const luxuryPick = luxurySorted.find(sc => 
        sc.car.model !== bestFit.model && 
        sc.car.model !== budgetPick.model
    )?.car ?? luxurySorted[0].car;

    // Round scores for display
    const roundScore = (car: Car): Car => ({
        ...car,
        score: Math.round(car.score * 100) / 100
    });

    const result: SearchResult = {
        bestFit: roundScore(bestFit),
        budgetPick: roundScore(budgetPick),
        luxuryPick: roundScore(luxuryPick),
        otherOptions: scoredCars
            .filter(sc => 
                sc.car.model !== bestFit.model && 
                sc.car.model !== budgetPick.model && 
                sc.car.model !== luxuryPick.model
            )
            .map(sc => roundScore(sc.car))
    };
    
    console.timeEnd('getAvailableVehicles');
    return result;
}