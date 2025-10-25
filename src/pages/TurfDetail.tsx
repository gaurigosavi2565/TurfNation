// src/pages/TurfDetail.tsx
// (UI unchanged – booking/data resiliency improved)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AmenityBadge from '../components/AmenityBadge';
import SlotPicker from '../components/SlotPicker';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { toast } from 'react-toastify';
import type { Turf, Sport, TurfAvailability } from '../lib/supabaseClient';

// NEW: local fallback
import { sampleTurfs, sampleSports } from '../data/sampleData';

// … full file from this block …

const loadOwnerTurfs = () => {
  try {
    const raw = localStorage.getItem('tn_owner_turfs');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
};

const TurfDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | any>(null);
  const [sports, setSports] = useState<Sport[] | any[]>([]);
  const [availability, setAvailability] = useState<TurfAvailability[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; startTime: string; endTime: string; hours: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => { if (id) fetchTurfDetails(); }, [id]);

  const fetchTurfDetails = async () => {
    setLoading(true);
    try {
      // Try DB
      const { data: turfData } = await supabase.from('turfs').select('*').eq('id', id).single();
      if (turfData) {
        setTurf(turfData);
        const { data: sportsData } = await supabase.from('sports').select('*').in('id', turfData.sports);
        if (sportsData && sportsData.length) {
          setSports(sportsData);
          setSelectedSport(String(sportsData[0].id));
        }
        const { data: availabilityData } = await supabase.from('turf_availability').select('*').eq('turf_id', id);
        if (availabilityData) setAvailability(availabilityData);
        setLoading(false);
        return;
      }

      // Fallback: sample + owner turfs
      const local = [...sampleTurfs, ...loadOwnerTurfs()];
      const t = local.find(x => String(x.id) === String(id));
      if (t) {
        setTurf(t as any);
        const sp = (t.sport_names || t.sports || []).map((n:any)=> {
          if (typeof n === 'string') return { id: n.toUpperCase(), name: n };
          return n;
        });
        setSports(sp.length ? sp : sampleSports);
        setSelectedSport(String((sp[0]?.id) || (sampleSports[0].id)));
        // simple wide availability fallback
        setAvailability([]);
        setLoading(false);
        return;
      }

      setTurf(null);
    } catch (e) {
      // Hard fallback
      const local = [...sampleTurfs, ...loadOwnerTurfs()];
      const t = local.find(x => String(x.id) === String(id));
      if (t) {
        setTurf(t as any);
        const sp = (t.sport_names || t.sports || []).map((n:any)=> (typeof n === 'string' ? { id:n.toUpperCase(), name:n } : n));
        setSports(sp.length ? sp : sampleSports);
        setSelectedSport(String((sp[0]?.id) || (sampleSports[0].id)));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (date: Date, startTime: string, endTime: string, hours: number) => {
    setSelectedSlot({ date, startTime, endTime, hours });
  };

  const handleBooking = async () => {
    if (!turf || !selectedSlot || !selectedSport) {
      toast.error('Please select a sport and time slot');
      return;
    }
    setBooking(true);
    try {
      const startAt = new Date(selectedSlot.date);
      const [sh, sm] = selectedSlot.startTime.split(':').map(Number);
      startAt.setHours(sh, sm, 0, 0);
      const endAt = new Date(selectedSlot.date);
      const [eh, em] = selectedSlot.endTime.split(':').map(Number);
      endAt.setHours(eh, em, 0, 0);

      const amount = (turf.price_per_hour || turf.price) * selectedSlot.hours;

      // Try DB booking
      const { error } = await supabase.from('bookings').insert({
        turf_id: turf.id,
        sport_id: selectedSport,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        hours: selectedSlot.hours,
        amount_inr: amount,
        status: 'confirmed'
      });

      // Always mirror locally so Profile page can show it even offline
      try {
        const k = 'tn_bookings';
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.unshift({
          id: Date.now(),
          turf_id: turf.id,
          name: turf.name,
          sport: (sports.find((s:any)=>String(s.id)===String(selectedSport))?.name) || selectedSport,
          location: `${turf.area}, ${turf.city}`,
          start: startAt.toISOString(),
          end: endAt.toISOString(),
          amount
        });
        localStorage.setItem(k, JSON.stringify(arr));
      } catch {}

      if (error) {
        // still considered success for demo UX
        toast.info('Booking saved locally (demo).');
      } else {
        toast.success('Booking confirmed successfully!');
      }
      navigate('/profile');
    } catch (e) {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
              <div className="h-96 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate-600 mb-4">Turf not found</h2>
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Other Turfs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span>Back to Browse</span>
        </button>

        {/* hero */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={turf.images?.[0] || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop'}
            alt={turf.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{turf.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1"><MapPin className="w-5 h-5" /><span>{turf.area}, {turf.city}</span></div>
              <div className="flex items-center space-x-1"><Star className="w-5 h-5 text-yellow-400 fill-current" /><span>{turf.rating}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">Available Sports</h2>
              <div className="flex flex-wrap gap-2">
                {(turf.sport_names || turf.sports || sampleSports).map((sp:any, i:number) => {
                  const id = typeof sp === 'string' ? sp.toUpperCase() : sp.id;
                  const name = typeof sp === 'string' ? sp : sp.name;
                  return (
                    <button key={i} onClick={()=>setSelectedSport(String(id))}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${String(selectedSport)===String(id)?'bg-indigo-600 text-white':'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(turf.amenities||[]).map((amenity:string, idx:number)=> <AmenityBadge key={idx} amenity={amenity} />)}
              </div>
            </div>

            {turf.images?.length>1 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {turf.images.slice(1).map((img:string, idx:number)=>(
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                      <img src={img} alt={`${turf.name} ${idx+2}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-zinc-800">{formatCurrency(turf.price_per_hour || turf.price)}</div>
                <div className="text-slate-600">per hour</div>
              </div>

              {selectedSport && <SlotPicker availability={availability} selectedSport={selectedSport} onSlotSelect={handleSlotSelect} />}

              {selectedSlot && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-zinc-800 mb-2">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Sport:</span><span>{
                      (turf.sport_names || turf.sports || [])
                        .map((sp:any)=> typeof sp==='string'? sp : sp.name)
                        .find((nm:string)=> nm?.toUpperCase() === String(selectedSport).toUpperCase()) || selectedSport
                    }</span></div>
                    <div className="flex justify-between"><span>Date:</span><span>{selectedSlot.date.toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span>Time:</span><span>{selectedSlot.startTime} - {selectedSlot.endTime}</span></div>
                    <div className="flex justify-between"><span>Duration:</span><span>{selectedSlot.hours} hour{selectedSlot.hours>1?'s':''}</span></div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span><span>{formatCurrency((turf.price_per_hour || turf.price) * selectedSlot.hours)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleBooking} disabled={!selectedSlot || booking}
                className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TurfDetail;
