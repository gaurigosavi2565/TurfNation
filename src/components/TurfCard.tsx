import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import type { Turf } from '../lib/supabaseClient';

interface TurfCardProps {
  turf: Turf & { sport_names?: string[] };
}

const TurfCard: React.FC<TurfCardProps> = ({ turf }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 bg-slate-200">
        <img
          src={turf.images[0] || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'}
          alt={turf.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-slate-700">{turf.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-zinc-800 mb-2">{turf.name}</h3>
        
        <div className="flex items-center space-x-1 text-slate-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{turf.area}, {turf.city}</span>
        </div>

        {/* Sports */}
        <div className="flex flex-wrap gap-1 mb-3">
          {turf.sport_names?.slice(0, 3).map((sport, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full"
            >
              {sport}
            </span>
          ))}
          {turf.sport_names && turf.sport_names.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              +{turf.sport_names.length - 3} more
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-zinc-800">
              {formatCurrency(turf.price_per_hour)}
            </span>
            <span className="text-sm text-slate-500">/hour</span>
          </div>
          <Link
            to={`/turf/${turf.id}`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View & Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;