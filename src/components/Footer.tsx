import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TurfNation</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              India's premier platform for discovering and booking premium sports turfs. 
              Find the perfect venue for your game across major cities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/browse" className="text-slate-400 hover:text-white transition-colors">Browse Turfs</a></li>
              <li><a href="/list-turf" className="text-slate-400 hover:text-white transition-colors">List Your Turf</a></li>
              <li><a href="/profile" className="text-slate-400 hover:text-white transition-colors">My Bookings</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help & Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <span>support@turfnation.in</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>Nashik, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 TurfNation. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            Built with ❤️ by <a rel="nofollow" target="_blank" href="https://meku.dev" className="text-indigo-400 hover:text-indigo-300">Meku.dev</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;