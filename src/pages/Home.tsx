import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Search, MapPin, Star, ArrowRight, Users, Trophy, Clock } from 'lucide-react';
    import Header from '../components/Header';
    import Footer from '../components/Footer';
    import SearchBox from '../components/SearchBox';
    import TurfCard from '../components/TurfCard';
    import { supabase } from '../lib/supabaseClient';
    import type { Turf, Sport } from '../lib/supabaseClient';

    const Home: React.FC = () => {
      const [featuredTurfs, setFeaturedTurfs] = useState<(Turf & { sport_names: string[] })[]>([]);
      const [sports, setSports] = useState<Sport[]>([]);
      const [loading, setLoading] = useState(true);

      const popularSports = ['Cricket', 'Football', 'Badminton', 'Tennis'];

      useEffect(() => {
        fetchHomeData();
      }, []);

      const fetchHomeData = async () => {
        try {
          // Fetch sports
          const { data: sportsData } = await supabase
            .from('sports')
            .select('*')
            .order('name');

          if (sportsData) {
            setSports(sportsData);
          }

          // Fetch featured turfs (Nashik + high rated)
          const { data: turfsData } = await supabase
            .from('turfs')
            .select('*')
            .eq('is_active', true)
            .or('city.eq.Nashik,rating.gte.4.5')
            .order('rating', { ascending: false })
            .limit(6);

          if (turfsData && sportsData) {
            const turfsWithSports = turfsData.map(turf => ({
              ...turf,
              sport_names: turf.sports.map(sportId => 
                sportsData.find(s => s.id === sportId)?.name || ''
              ).filter(Boolean)
            }));
            setFeaturedTurfs(turfsWithSports);
          }
        } catch (error) {
          console.error('Error fetching home data:', error);
        } finally {
          setLoading(false);
        }
      };

      const handleSearch = (query: string) => {
        if (query.trim()) {
          window.location.href = `/browse?search=${encodeURIComponent(query)}`;
        }
      };

      return (
        <div className="min-h-screen bg-white">
          <Header />
          
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-800 text-white">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Find & Book Premium
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Sports Turfs in India
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                  Discover top-rated sports facilities across major Indian cities. 
                  Book instantly and play your favorite sport today.
                </p>
                
                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-8">
                  <SearchBox 
                    onSearch={handleSearch}
                    placeholder="Search by sport, city, or turf name..."
                    className="text-lg"
                  />
                </div>

                {/* Quick Sport Chips */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {popularSports.map((sport) => (
                    <Link
                      key={sport}
                      to={`/browse?search=${sport}`}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                      {sport}
                    </Link>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/browse"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Browse Turfs</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/list-turf"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    List Your Turf
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-800 mb-2">40+</h3>
                  <p className="text-slate-600">Premium Turfs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-800 mb-2">1000+</h3>
                  <p className="text-slate-600">Happy Players</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-800 mb-2">5</h3>
                  <p className="text-slate-600">Sports Available</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Turfs */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">
                  Featured Turfs in Nashik
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Discover the best sports facilities in Nashik and surrounding areas
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-200 rounded-xl h-80 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredTurfs.map((turf) => (
                    <TurfCard key={turf.id} turf={turf} />
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Link
                  to="/browse"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <span>View All Turfs</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-slate-600">
                  Book your favorite turf in just 3 simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-800 mb-3">1. Search & Discover</h3>
                  <p className="text-slate-600">
                    Find the perfect turf by searching for your preferred sport, location, or facility name
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-800 mb-3">2. Select Time Slot</h3>
                  <p className="text-slate-600">
                    Choose your preferred date, time, and duration from available slots
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-800 mb-3">3. Book & Play</h3>
                  <p className="text-slate-600">
                    Confirm your booking and enjoy playing at premium sports facilities
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      );
    };

    export default Home;