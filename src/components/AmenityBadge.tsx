import React from 'react';
import { 
  Wifi, 
  Car, 
  Coffee, 
  Shirt, 
  Droplets, 
  Shield, 
  Users, 
  Zap,
  Camera,
  Clock
} from 'lucide-react';

interface AmenityBadgeProps {
  amenity: string;
  className?: string;
}

const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
    return <Wifi className="w-4 h-4" />;
  }
  if (amenityLower.includes('parking')) {
    return <Car className="w-4 h-4" />;
  }
  if (amenityLower.includes('cafeteria') || amenityLower.includes('food')) {
    return <Coffee className="w-4 h-4" />;
  }
  if (amenityLower.includes('changing') || amenityLower.includes('room')) {
    return <Shirt className="w-4 h-4" />;
  }
  if (amenityLower.includes('shower') || amenityLower.includes('washroom')) {
    return <Droplets className="w-4 h-4" />;
  }
  if (amenityLower.includes('security')) {
    return <Shield className="w-4 h-4" />;
  }
  if (amenityLower.includes('seating') || amenityLower.includes('gallery')) {
    return <Users className="w-4 h-4" />;
  }
  if (amenityLower.includes('floodlight') || amenityLower.includes('lighting')) {
    return <Zap className="w-4 h-4" />;
  }
  if (amenityLower.includes('cctv')) {
    return <Camera className="w-4 h-4" />;
  }
  if (amenityLower.includes('24/7') || amenityLower.includes('hours')) {
    return <Clock className="w-4 h-4" />;
  }
  
  return <Shield className="w-4 h-4" />;
};

const AmenityBadge: React.FC<AmenityBadgeProps> = ({ amenity, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
      <span className="text-slate-600">
        {getAmenityIcon(amenity)}
      </span>
      <span className="text-sm font-medium text-slate-700">{amenity}</span>
    </div>
  );
};

export default AmenityBadge;