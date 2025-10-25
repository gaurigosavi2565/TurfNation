# TurfNation - Premium Sports Turf Booking Platform

A modern, responsive web application for discovering and booking premium sports turfs across India, with a special focus on Nashik.

## Features

- **Search & Discovery**: Find turfs by sport, city, or facility name
- **Advanced Filtering**: Filter by sport, city, and price range
- **Detailed Turf Pages**: View amenities, images, ratings, and availability
- **Smart Booking System**: Select date, time slots, and duration
- **User Profiles**: Track bookings and manage preferences
- **Owner Dashboard**: List turfs and manage bookings
- **Responsive Design**: Mobile-first approach with elegant UI
- **Real-time Updates**: Instant booking confirmations and notifications

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI Themes
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Notifications**: React Toastify

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd turfnation
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file:
   ```
   VITE_SUPABASE_URL=https://sprluopvueumokftuqys.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcmx1b3B2dWV1bW9rZnR1cXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODg2MTMsImV4cCI6MjA3Njg2NDYxM30.-WeRrjkqgJeo55kTc_WQ3gJQCdq13OrdapaXkih55GY
   ```

3. **Database Setup**
   Run the seed script in your Supabase SQL editor:
   ```bash
   # Copy contents of supabase/seed.sql and run in Supabase dashboard
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Database Schema

### Tables
- **sports**: Available sports (Cricket, Football, Badminton, Tennis, Hockey)
- **turfs**: Turf details with location, amenities, pricing
- **turf_availability**: Time slots for each turf and sport
- **profiles**: User profiles (player/owner roles)
- **bookings**: Booking records with status tracking

### Row Level Security (RLS)
- Public read access on all tables
- Anonymous insert permissions for demo purposes
- Secure policies for production deployment

## Key Features Explained

### Smart Search
- Searches across sport names, turf names, cities, and areas
- Fallback to Nashik recommendations when no results found
- Debounced input for optimal performance

### Booking Flow
1. Browse turfs or search for specific requirements
2. View detailed turf information and amenities
3. Select sport, date, and time slot from availability
4. Choose duration (1-4 hours)
5. Confirm booking with instant feedback
6. View booking in profile dashboard

### Owner Features
- Toggle between player and owner modes
- List new turfs with comprehensive details
- View booking analytics and revenue
- Manage turf availability and pricing

## Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Preview Build**
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel/Netlify**
   - Connect your repository
   - Add environment variables
   - Deploy with automatic builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ by [Meku.dev](https://meku.dev)