// src/pages/TurfBrowse.tsx
// (UI unchanged – only data/logic updated)

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';
import TurfCard from '../components/TurfCard';

// NEW: local demo data (no UI change)
import { sampleTurfs, sampleSports } from '../data/sampleData';

import { supabase } from '../lib/supabaseClient';
import type { Turf, Sport } from '../lib/supabaseClient';

// … full file unchanged UI; logic enhanced …

const TurfBrowse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [turfs, setTurfs] = useState<(Turf & { sport_names: string[] })[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [adjustedResults, setAdjustedResults] = useState<string>('');

  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    fetchTurfs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSport, selectedCity, priceRange, initialSearch, sports]);

  const fetchSports = async () => {
    try {
      const { data } = await supabase.from('sports').select('*').order('name');
      if (data && data.length) setSports(data as any);
      else setSports(sampleSports as any); // fallback
    } catch {
      setSports(sampleSports as any);
    }
  };

  // ---------- helpers (no UI changes) ----------
  const sportIdToName = (id?: string) => {
    if (!id) return '';
    const s = sports.find(x => String(x.id) === String(id));
    return s?.name || '';
  };

  const parseSearchQuery = (query: string) => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const sportTokens = sports.map(s => s.name.toLowerCase());
    const cityTokens = ['nashik','mumbai','pune','thane','aurangabad','nagpur','hyderabad','bengaluru','surat','delhi','chennai','kolkata'];
    const detectedSports:string[] = [];
    const detectedCities:string[] = [];
    const rest:string[] = [];
    for (const t of tokens) {
      if (sportTokens.includes(t)) detectedSports.push(t);
      else if (cityTokens.includes(t)) detectedCities.push(t);
      else rest.push(t);
    }
    return { sports: detectedSports, cities: detectedCities, query: rest.join(' ') };
  };

  const loadOwnerTurfs = () => {
    try {
      const raw = localStorage.getItem('tn_owner_turfs');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  };

  const normalizeTurf = (t: any): Turf & { sport_names: string[] } => {
    const names: string[] =
      Array.isArray(t.sport_names) && t.sport_names.length
        ? t.sport_names
        : Array.isArray(t.sports) && t.sports.length
        ? t.sports.map((sid:any) => sports.find(s=>String(s.id)===String(sid))?.name || String(sid)).filter(Boolean)
        : t.sport ? [String(t.sport)] : [];
    return { ...t, sport_names: names } as any;
  };

  const filterLocal = (
    data:any[],
    { q, sportId, city, price }:{ q:string; sportId:string; city:string; price:string }
  )=>{
    const parsed = parseSearchQuery(q||'');
    const sportName = sportIdToName(sportId).toLowerCase();
    const priceMM = (()=>{
      if(!price) return null;
      const [a,b]=price.split('-').map(Number);
      if(!isNaN(a) && !isNaN(b)) return {min:a,max:b};
      if(!isNaN(a)) return {min:a,max:Infinity};
      return null;
    })();

    const merged = [...loadOwnerTurfs(), ...data];

    let out = merged.map(normalizeTurf).filter(t=>{
      if(sportName){
        const has = (t.sport_names||[]).some((n:string)=>n.toLowerCase()===sportName);
        if(!has) return false;
      }
      if(city){
        if(String(t.city||'').toLowerCase()!==city.toLowerCase()) return false;
      }
      if(priceMM){
        const p = Number(((t as any).price_per_hour ?? (t as any).price ?? 0));
        if(isNaN(p) || p<priceMM.min || p>priceMM.max) return false;
      }
      if(q){
        const hay = `${t.name} ${t.area||''} ${t.city||''} ${(t as any).description||''} ${(t.sport_names||[]).join(' ')}`.toLowerCase();
        if(parsed.sports.length){
          const ok = parsed.sports.some(sp => (t.sport_names||[]).some((n:string)=>n.toLowerCase()===sp));
          if(!ok) return false;
        }
        if(parsed.cities.length){
          const ok = parsed.cities.some(c => String(t.city||'').toLowerCase()===c);
          if(!ok) return false;
        }
        if(parsed.query && !hay.includes(parsed.query)) return false;
      }
      return true;
    }).sort((a,b)=>{
      const an = String(a.city||'').toLowerCase()==='nashik';
      const bn = String(b.city||'').toLowerCase()==='nashik';
      if(an && !bn) return -1;
      if(!an && bn) return 1;
      return Number(b.rating||0)-Number(a.rating||0);
    });

    if(out.length===0){
      out = merged.map(normalizeTurf).filter(t=>{
        return sportName ? (t.sport_names||[]).some((n:string)=>n.toLowerCase()===sportName) : true;
      }).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
    }
    if(out.length===0){
      out = merged.map(normalizeTurf).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
    }
    return out.slice(0,50);
  };

  // ---------- fetch ----------
  const fetchTurfs = async()=>{
    setLoading(true);
    setAdjustedResults('');
    try{
      // Try live DB first (your original logic)
      let query = supabase.from('turfs').select('*').eq('is_active', true);

      if(initialSearch){
        const parsed = parseSearchQuery(initialSearch);
        const sportIds = parsed.sports
          .map(name=>sports.find(s=>s.name.toLowerCase()===name)?.id)
          .filter(Boolean);
        if(sportIds.length>0) query = query.contains('sports', sportIds);
        if(parsed.cities.length>0) query = query.in('city', parsed.cities.map(c=>c[0].toUpperCase()+c.slice(1)));
        if(parsed.query) query = query.or(`name.ilike.%${parsed.query}%,area.ilike.%${parsed.query}%`);
      }

      if(selectedSport) query = query.contains('sports', [selectedSport]);
      if(selectedCity)  query = query.eq('city', selectedCity);
      if(priceRange){
        const [min,max] = priceRange.split('-').map(Number);
        if(max) query = query.gte('price_per_hour',min).lte('price_per_hour',max);
        else    query = query.gte('price_per_hour',min);
      }

      const { data, error } = await query.order('rating',{ascending:false}).limit(50);
      if(!error && data && data.length){
        const rows = (data as any[]).map(t=>({
          ...t,
          sport_names:(t.sports||[]).map((sid:any)=>sports.find(s=>String(s.id)===String(sid))?.name||'').filter(Boolean)
        })).map(normalizeTurf);
        setTurfs(rows);
        setLoading(false);
        return;
      }

      // Fallback to local sample + owner turfs (never empty)
      const localRows = filterLocal(sampleTurfs as any[], {
        q: initialSearch,
        sportId: selectedSport,
        city: selectedCity,
        price: priceRange
      });
      setTurfs(localRows);
      setAdjustedResults('Showing high-quality demo turfs while live data is limited. (Nashik prioritized)');
    }catch{
      const localRows = filterLocal(sampleTurfs as any[], {
        q: initialSearch,
        sportId: selectedSport,
        city: selectedCity,
        price: priceRange
      });
      setTurfs(localRows);
      setAdjustedResults('Showing high-quality demo turfs while live data is limited. (Nashik prioritized)');
    }finally{
      setLoading(false);
    }
  };

  const handleSearch = (q:string)=> setSearchParams(q ? { search:q } : {});

  const cities = ['Nashik','Mumbai','Pune','Thane','Aurangabad','Nagpur','Hyderabad','Bengaluru','Surat'];
  const priceRanges = [
    { label: 'Under ₹500',   value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2000',value: '1000-2000' },
    { label: 'Above ₹2000',  value: '2000' },
  ];

  // ---------------- UI BELOW (unchanged) ----------------
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {/* Search Header */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">Browse Sports Turfs</h1>
            <p className="text-xl text-slate-600">Find the perfect turf for your game across India</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBox onSearch={handleSearch} placeholder="Search by sport, city, or turf name..." />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5" /><span>Filters</span>
              </h3>

              {/* Sport Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Sport</label>
                <select value={selectedSport} onChange={e=>setSelectedSport(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Sports</option>
                  {sports.map(s => <option key={s.id} value={s.id as any}>{s.name}</option>)}
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                <select value={priceRange} onChange={e=>setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Prices</option>
                  {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <button onClick={()=>{ setSelectedSport(''); setSelectedCity(''); setPriceRange(''); setSearchParams({}); }}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-800">
                  {initialSearch ? `Results for "${initialSearch}"` : 'All Turfs'}
                </h2>
                <p className="text-slate-600">{loading ? 'Loading...' : `${turfs.length} turfs found`}</p>
                {adjustedResults && <p className="text-sm text-amber-600 mt-1">Adjusted results: {adjustedResults}</p>}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <div key={i} className="bg-slate-200 rounded-xl h-80 animate-pulse"></div>)}
              </div>
            ) : turfs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {turfs.map(t => <TurfCard key={t.id} turf={t} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No turfs found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search criteria or browse our featured turfs</p>
                <button onClick={()=>{ setSelectedSport(''); setSelectedCity(''); setPriceRange(''); setSearchParams({}); }}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Show All Turfs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TurfBrowse;

