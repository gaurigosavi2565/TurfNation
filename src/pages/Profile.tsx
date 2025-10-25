import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trophy, ToggleLeft, ToggleRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { toast } from 'react-toastify';
import type { Booking, Turf, Sport } from '../lib/supabaseClient';

interface BookingWithDetails extends Booking {
  turf_name: string;
  turf_city: string;
  turf_area: string;
  sport_name: string;
}

const Profile: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (isOwnerMode) {
      fetchOwnerBookings();
    }
  }, [isOwnerMode]);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          turfs!inner(name, city, area),
          sports!inner(name)
        `)
        .order('start_at', { ascending: false });

      if (bookingsData) {
        const formattedBookings = bookingsData.map(booking => ({
          ...booking,
          turf_name: booking.turfs.name,
          turf_city: booking.turfs.city,
          turf_area: booking.turfs.area,
          sport_name: booking.sports.name,
        }));
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerBookings = async () => {
    try {
      // For demo purposes, showing all bookings as owner bookings
      // In a real app, this would filter by turf ownership
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          turfs!inner(name, city, area),
          sports!inner(name)
        `)
        .order('start_at', { ascending: false });

      if (bookingsData) {
        const formattedBookings = bookingsData.map(booking => ({
          ...booking,
          turf_name: booking.turfs.name,
          turf_city: booking.turfs.city,
          turf_area: booking.turfs.area,
          sport_name: booking.sports.name,
        }));
        setOwnerBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      toast.error('Failed to load owner bookings');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const displayBookings = isOwnerMode ? ownerBookings : bookings;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-zinc-800 mb-2">
                {isOwnerMode ? 'Owner Dashboard' : 'My Profile'}
              </h1>
              <p className="text-slate-600">
                {isOwnerMode 
                  ? 'Manage your turf bookings and view analytics' 
                  : 'View and manage your turf bookings'
                }
              </p>
            </div>
            
            {/* Owner Mode Toggle */}
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <span className="text-sm font-medium text-slate-700">Player</span>
              <button
                onClick={() => setIsOwnerMode(!isOwnerMode)}
                className="flex items-center"
              >
                {isOwnerMode ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
              <span className="text-sm font-medium text-slate-700">Owner</span>
            </div>
          </div>
        </div>

        {/* Stats Cards (Owner Mode) */}
        {isOwnerMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-zinc-800">{ownerBookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-zinc-800">
                    {formatCurrency(ownerBookings.reduce((sum, booking) => sum + booking.amount_inr, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Turfs</p>
                  <p className="text-3xl font-bold text-zinc-800">
                    {new Set(ownerBookings.map(b => b.turf_id)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-zinc-800">
              {isOwnerMode ? 'Recent Bookings' : 'My Bookings'}
            </h2>
            <p className="text-slate-600 mt-1">
              {loading ? 'Loading...' : `${displayBookings.length} bookings found`}
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : displayBookings.length > 0 ? (
              displayBookings.map((booking) => {
                const startDateTime = formatDateTime(booking.start_at);
                const endDateTime = formatDateTime(booking.end_at);
                
                return (
                  <div key={booking.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-6 h-6 text-indigo-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-zinc-800 truncate">
                              {booking.turf_name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.turf_area}, {booking.turf_city}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Trophy className="w-4 h-4" />
                                <span>{booking.sport_name}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{startDateTime.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{startDateTime.time} - {endDateTime.time}</span>
                              </div>
                              <span className="text-slate-400">•</span>
                              <span>{booking.hours} hour{booking.hours > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-zinc-800">
                            {formatCurrency(booking.amount_inr)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No bookings yet
                </h3>
                <p className="text-slate-500 mb-6">
                  {isOwnerMode 
                    ? "You haven't received any bookings yet. Make sure your turfs are listed and available."
                    : "You haven't made any bookings yet. Start by browsing our amazing turfs!"
                  }
                </p>
                <a
                  href={isOwnerMode ? "/list-turf" : "/browse"}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {isOwnerMode ? 'List Your Turf' : 'Browse Turfs'}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;