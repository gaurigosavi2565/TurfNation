import { createClient } from "@supabase/supabase-js";
import { seedTurfs, seedSports, seedCities, Turf } from "@/data/seedTurfs";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;
const sb = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const OWNER_KEY = "tn_owner_turfs";

export async function loadSports(): Promise<string[]> {
  try {
    if (sb) {
      const { data, error } = await sb.from("sports").select("name");
      if (!error && data?.length) return data.map(s => s.name);
    }
  } catch {}
  return seedSports;
}

export async function loadTurfsRaw(): Promise<Turf[]> {
  const ownersLocal: Turf[] = JSON.parse(localStorage.getItem(OWNER_KEY) || "[]");
  try {
    if (sb) {
      const { data, error } = await sb.from("turfs").select("*");
      if (!error && Array.isArray(data) && data.length) {
        const map = new Map<string, Turf>();
        data.forEach((t:any) => map.set(String(t.id), normalize(t)));
        ownersLocal.forEach(t => map.set(String(t.id), t));
        return [...map.values()];
      }
    }
  } catch {}
  const map = new Map<string, Turf>();
  seedTurfs.forEach(t => map.set(String(t.id), t));
  ownersLocal.forEach(t => map.set(String(t.id), t));
  return [...map.values()];
}

export type Filters = { q?: string; sport?: string; city?: string; price?: "low"|"mid"|"high"|"all" };

export function filterTurfs(all: Turf[], f: Filters): Turf[] {
  const priceBand = (p:number) => p < 600 ? "low" : p <= 1200 ? "mid" : "high";
  const norm = (s?:string) => (s||"").trim().toLowerCase();

  let rows = all.filter(t => {
    const bySport = f.sport && f.sport !== "All Sports" ? t.sport === f.sport : true;
    const byCity  = f.city  && f.city  !== "All Cities" ? t.city  === f.city  : true;
    const byPrice = f.price && f.price !== "all"        ? priceBand(t.price_per_hour) === f.price : true;
    const byQ     = f.q ? (norm(t.name).includes(norm(f.q)) || norm(t.city).includes(norm(f.q)) || norm(t.sport).includes(norm(f.q))) : true;
    return bySport && byCity && byPrice && byQ;
  });

  // Never empty: relax price/city if needed, then show all
  if (rows.length === 0) {
    rows = all.filter(t => {
      const bySport = f.sport && f.sport !== "All Sports" ? t.sport === f.sport : true;
      const byQ     = f.q ? (norm(t.name).includes(norm(f.q)) || norm(t.city).includes(norm(f.q)) || norm(t.sport).includes(norm(f.q))) : true;
      return bySport && byQ;
    });
    if (rows.length === 0) rows = all;
  }

  // Rank: Nashik first; then exact city/sport; then rating desc; then cheaper
  const wantedCity  = f.city && f.city !== "All Cities" ? f.city : undefined;
  const wantedSport = f.sport && f.sport !== "All Sports" ? f.sport : undefined;

  rows.sort((a,b) => {
    const nA = a.city === "Nashik" ? 1 : 0, nB = b.city === "Nashik" ? 1 : 0;
    const cA = wantedCity  ? (a.city  === wantedCity  ? 1 : 0) : 0;
    const cB = wantedCity  ? (b.city  === wantedCity  ? 1 : 0) : 0;
    const sA = wantedSport ? (a.sport === wantedSport ? 1 : 0) : 0;
    const sB = wantedSport ? (b.sport === wantedSport ? 1 : 0) : 0;
    if (nA !== nB) return nB - nA;
    if (cA !== cB) return cB - cA;
    if (sA !== sB) return sB - sA;
    if (a.rating !== b.rating) return b.rating - a.rating;
    return a.price_per_hour - b.price_per_hour;
  });

  return rows;
}

export function addOwnerTurfLocal(t: Turf) {
  const list: Turf[] = JSON.parse(localStorage.getItem(OWNER_KEY) || "[]");
  const map = new Map<string, Turf>();
  list.forEach(x => map.set(String(x.id), x));
  map.set(String(t.id), t);
  localStorage.setItem(OWNER_KEY, JSON.stringify([...map.values()]));
}

function normalize(row:any): Turf {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    name: row.name,
    sport: row.sport,
    city: row.city,
    address: row.address ?? "",
    availability: row.availability ?? "Mon–Sun, 6AM–10PM",
    rating: Number(row.rating ?? 4.5),
    price_per_hour: Number(row.price_per_hour ?? 800),
    description: row.description ?? "",
    images: Array.isArray(row.images) ? row.images : (row.image ? [row.image] : [])
  };
}
