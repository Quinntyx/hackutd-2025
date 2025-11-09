import type { CompoundPricing } from "@model/data";

const BASE = "https://api.collectapi.com";

export async function getPricesForCity(city: string): Promise<CompoundPricing | null> {
    return { gasoline: 3.5, diesel: 4.0, electric: 0 }; // Mocked for testing

    const url = new URL("/gasPrice/fromCity", BASE);
    url.searchParams.set("city", city);

    const res = await fetch(url.toString(), {
        headers: {
        Authorization: process.env.COLLECTAPI_API_KEY ?? "",
        Accept: "application/json",
        },
    });

    if (!res.ok) return null;

    const json = await res.json();
    
    var rtn = {
        gasoline: json?.result.gasoline / (json?.result.unit == "liter" ? 0.264172 : 1),
        diesel: json?.result.diesel / (json?.result.unit == "liter" ? 0.264172 : 1),
        electric: 0
    }

    return rtn as CompoundPricing | null;
}
