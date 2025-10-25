-- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create sports table
    CREATE TABLE IF NOT EXISTS sports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create turfs table
    CREATE TABLE IF NOT EXISTS turfs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      state TEXT DEFAULT 'Maharashtra',
      lat NUMERIC,
      lng NUMERIC,
      amenities TEXT[] DEFAULT '{}',
      images TEXT[] DEFAULT '{}',
      rating NUMERIC DEFAULT 4.5,
      price_per_hour NUMERIC NOT NULL,
      sports UUID[] DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create turf_availability table
    CREATE TABLE IF NOT EXISTS turf_availability (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      turf_id UUID REFERENCES turfs(id) ON DELETE CASCADE,
      sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
      weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      slot_minutes INTEGER DEFAULT 60,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create profiles table
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT,
      role TEXT DEFAULT 'player' CHECK (role IN ('player', 'owner')),
      display_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create bookings table
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      turf_id UUID REFERENCES turfs(id) ON DELETE CASCADE,
      sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
      user_id UUID,
      start_at TIMESTAMP WITH TIME ZONE NOT NULL,
      end_at TIMESTAMP WITH TIME ZONE NOT NULL,
      hours INTEGER NOT NULL,
      amount_inr NUMERIC NOT NULL,
      status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
    ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE turf_availability ENABLE ROW LEVEL SECURITY;
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

    -- Create policies for public read access
    CREATE POLICY "Allow public read access on sports" ON sports FOR SELECT USING (true);
    CREATE POLICY "Allow public read access on turfs" ON turfs FOR SELECT USING (true);
    CREATE POLICY "Allow public read access on turf_availability" ON turf_availability FOR SELECT USING (true);
    CREATE POLICY "Allow public read access on profiles" ON profiles FOR SELECT USING (true);
    CREATE POLICY "Allow public read access on bookings" ON bookings FOR SELECT USING (true);

    -- Create policies for demo inserts
    CREATE POLICY "Allow anon insert on turfs" ON turfs FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anon insert on turf_availability" ON turf_availability FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anon insert on profiles" ON profiles FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anon insert on bookings" ON bookings FOR INSERT WITH CHECK (true);

    -- Insert sports data
    INSERT INTO sports (id, name) VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'Cricket'),
      ('550e8400-e29b-41d4-a716-446655440002', 'Football'),
      ('550e8400-e29b-41d4-a716-446655440003', 'Badminton'),
      ('550e8400-e29b-41d4-a716-446655440004', 'Tennis'),
      ('550e8400-e29b-41d4-a716-446655440005', 'Hockey'),
      ('550e8400-e29b-41d4-a716-446655440006', 'Basketball'),
      ('550e8400-e29b-41d4-a716-446655440007', 'Table Tennis'),
      ('550e8400-e29b-41d4-a716-446655440008', 'Squash'),
      ('550e8400-e29b-41d4-a716-446655440009', 'Volleyball'),
      ('550e8400-e29b-41d4-a716-446655440010', 'Swimming'),
      ('550e8400-e29b-41d4-a716-446655440011', 'Skating')
    ON CONFLICT (name) DO NOTHING;

    -- Insert turfs data (Nashik focused - 25+ turfs)
    INSERT INTO turfs (id, name, city, area, state, amenities, images, rating, price_per_hour, sports) VALUES
      -- Nashik turfs (20+)
      ('660e8400-e29b-41d4-a716-446655440001', 'Champions Sports Arena', 'Nashik', 'Gangapur Road', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Floodlights', 'Cafeteria'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.8, 1200, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']),
       
      ('660e8400-e29b-41d4-a716-446655440002', 'Elite Cricket Ground', 'Nashik', 'College Road', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Security', 'CCTV'], 
       ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'], 
       4.7, 800, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
       
      ('660e8400-e29b-41d4-a716-446655440003', 'Victory Sports Complex', 'Nashik', 'Indiranagar', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Floodlights', 'Seating Gallery', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.9, 1500, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004']),
       
      ('660e8400-e29b-41d4-a716-446655440004', 'Mahatma Nagar Sports Hub', 'Nashik', 'Mahatma Nagar', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Floodlights', 'Cafeteria'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop'], 
       4.6, 900, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440005', 'Nashik Premier Badminton Center', 'Nashik', 'Satpur', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Air Conditioning', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'], 
       4.8, 600, ARRAY['550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440006', 'Panchavati Sports Arena', 'Nashik', 'Panchavati', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Floodlights', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.5, 700, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']),
       
      ('660e8400-e29b-41d4-a716-446655440007', 'Pathardi Sports Complex', 'Nashik', 'Pathardi', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Cafeteria'], 
       ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop'], 
       4.7, 850, ARRAY['550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004']),
       
      ('660e8400-e29b-41d4-a716-446655440008', 'Dwarka Sports Hub', 'Nashik', 'Dwarka', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Floodlights'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.4, 650, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
       
      ('660e8400-e29b-41d4-a716-446655440009', 'Anjaneri Sports Center', 'Nashik', 'Anjaneri', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'], 
       4.6, 750, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440010', 'Sula Vineyards Sports', 'Nashik', 'Sula Vineyards', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Cafeteria', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.8, 1100, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004']),
       
      ('660e8400-e29b-41d4-a716-446655440011', 'Nashik Tennis Academy', 'Nashik', 'CIDCO', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Coaching Available'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.9, 1000, ARRAY['550e8400-e29b-41d4-a716-446655440004']),
       
      ('660e8400-e29b-41d4-a716-446655440012', 'Deolali Sports Complex', 'Nashik', 'Deolali', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Floodlights'], 
       ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.5, 600, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440013', 'Nashik Hockey Arena', 'Nashik', 'Ambad', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.7, 900, ARRAY['550e8400-e29b-41d4-a716-446655440005']),
       
      ('660e8400-e29b-41d4-a716-446655440014', 'Sula Sports Village', 'Nashik', 'Sula', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Cafeteria', 'Security', 'Seating Gallery'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.8, 1300, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440015', 'Nashik Basketball Court', 'Nashik', 'Mhasrul', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Air Conditioning'], 
       ARRAY['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.6, 800, ARRAY['550e8400-e29b-41d4-a716-446655440006']),
       
      ('660e8400-e29b-41d4-a716-446655440016', 'Table Tennis Hub Nashik', 'Nashik', 'Untwadi', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.5, 400, ARRAY['550e8400-e29b-41d4-a716-446655440007']),
       
      ('660e8400-e29b-41d4-a716-446655440017', 'Squash Court Nashik', 'Nashik', 'Canada Corner', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Air Conditioning'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.7, 700, ARRAY['550e8400-e29b-41d4-a716-446655440008']),
       
      ('660e8400-e29b-41d4-a716-446655440018', 'Volleyball Arena Nashik', 'Nashik', 'Vijaynagar', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Floodlights'], 
       ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.4, 500, ARRAY['550e8400-e29b-41d4-a716-446655440009']),
       
      ('660e8400-e29b-41d4-a716-446655440019', 'Swimming Pool Nashik', 'Nashik', 'RTO Corner', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Cafeteria', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'], 
       4.9, 2000, ARRAY['550e8400-e29b-41d4-a716-446655440010']),
       
      ('660e8400-e29b-41d4-a716-446655440020', 'Skating Rink Nashik', 'Nashik', 'Old Agra Road', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'], 
       4.6, 600, ARRAY['550e8400-e29b-41d4-a716-446655440011']),
       
      ('660e8400-e29b-41d4-a716-446655440021', 'Nashik Ultimate Sports', 'Nashik', 'Mumbai Naka', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Cafeteria', 'Security', 'Seating Gallery'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.8, 1400, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004']),

      -- Mumbai turfs
      ('660e8400-e29b-41d4-a716-446655440022', 'Mumbai Sports Arena', 'Mumbai', 'Andheri', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Floodlights', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'], 
       4.7, 2000, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']),
       
      ('660e8400-e29b-41d4-a716-446655440023', 'Bandra Football Ground', 'Mumbai', 'Bandra', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Floodlights', 'Seating Gallery'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop'], 
       4.6, 1800, ARRAY['550e8400-e29b-41d4-a716-446655440002']),

      -- Pune turfs
      ('660e8400-e29b-41d4-a716-446655440024', 'Pune Cricket Academy', 'Pune', 'Kothrud', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Coaching Available', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'], 
       4.8, 1000, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
       
      ('660e8400-e29b-41d4-a716-446655440025', 'Deccan Sports Complex', 'Pune', 'Deccan', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Floodlights', 'Cafeteria', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.7, 1400, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004']),

      -- Other cities
      ('660e8400-e29b-41d4-a716-446655440026', 'Aurangabad Sports Hub', 'Aurangabad', 'CIDCO', 'Maharashtra', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Floodlights'], 
       ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop'], 
       4.5, 700, ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']),
       
      ('660e8400-e29b-41d4-a716-446655440027', 'Nagpur Cricket Ground', 'Nagpur', 'Civil Lines', 'Maharashtra', 
       ARRAY['Parking Available', 'Changing Rooms', 'Washrooms', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop'], 
       4.6, 800, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
       
      ('660e8400-e29b-41d4-a716-446655440028', 'Hyderabad Sports Complex', 'Hyderabad', 'Banjara Hills', 'Telangana', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Cafeteria', 'Security'], 
       ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'], 
       4.8, 1200, ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']),
       
      ('660e8400-e29b-41d4-a716-446655440029', 'Bengaluru Football Academy', 'Bengaluru', 'Koramangala', 'Karnataka', 
       ARRAY['Parking Available', 'Changing Rooms', 'Floodlights', 'Equipment Rental'], 
       ARRAY['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'], 
       4.9, 1600, ARRAY['550e8400-e29b-41d4-a716-446655440002']),
       
      ('660e8400-e29b-41d4-a716-446655440030', 'Surat Sports Arena', 'Surat', 'Adajan', 'Gujarat', 
       ARRAY['Free WiFi', 'Parking Available', 'Changing Rooms', 'Air Conditioning'], 
       ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop'], 
       4.7, 900, ARRAY['550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'])

    ON CONFLICT (id) DO NOTHING;

    -- Insert availability data for all turfs
    INSERT INTO turf_availability (turf_id, sport_id, weekday, start_time, end_time, slot_minutes)
    SELECT 
      t.id as turf_id,
      unnest(t.sports) as sport_id,
      generate_series(1, 7) as weekday,
      '06:00'::time as start_time,
      '10:00'::time as end_time,
      60 as slot_minutes
    FROM turfs t
    WHERE t.id IN (
      '660e8400-e29b-41d4-a716-446655440001',
      '660e8400-e29b-41d4-a716-446655440002',
      '660e8400-e29b-41d4-a716-446655440003',
      '660e8400-e29b-41d4-a716-446655440004',
      '660e8400-e29b-41d4-a716-446655440005',
      '660e8400-e29b-41d4-a716-446655440006',
      '660e8400-e29b-41d4-a716-446655440007',
      '660e8400-e29b-41d4-a716-446655440008',
      '660e8400-e29b-41d4-a716-446655440009',
      '660e8400-e29b-41d4-a716-446655440010',
      '660e8400-e29b-41d4-a716-446655440011',
      '660e8400-e29b-41d4-a716-446655440012',
      '660e8400-e29b-41d4-a716-446655440013',
      '660e8400-e29b-41d4-a716-446655440014',
      '660e8400-e29b-41d4-a716-446655440015',
      '660e8400-e29b-41d4-a716-446655440016',
      '660e8400-e29b-41d4-a716-446655440017',
      '660e8400-e29b-41d4-a716-446655440018',
      '660e8400-e29b-41d4-a716-446655440019',
      '660e8400-e29b-41d4-a716-446655440020',
      '660e8400-e29b-41d4-a716-446655440021',
      '660e8400-e29b-41d4-a716-446655440022',
      '660e8400-e29b-41d4-a716-446655440023',
      '660e8400-e29b-41d4-a716-446655440024',
      '660e8400-e29b-41d4-a716-446655440025',
      '660e8400-e29b-41d4-a716-446655440026',
      '660e8400-e29b-41d4-a716-446655440027',
      '660e8400-e29b-41d4-a716-446655440028',
      '660e8400-e29b-41d4-a716-446655440029',
      '660e8400-e29b-41d4-a716-446655440030'
    )

    UNION ALL

    SELECT 
      t.id as turf_id,
      unnest(t.sports) as sport_id,
      generate_series(1, 7) as weekday,
      '16:00'::time as start_time,
      '22:00'::time as end_time,
      60 as slot_minutes
    FROM turfs t
    WHERE t.id IN (
      '660e8400-e29b-41d4-a716-446655440001',
      '660e8400-e29b-41d4-a716-446655440002',
      '660e8400-e29b-41d4-a716-446655440003',
      '660e8400-e29b-41d4-a716-446655440004',
      '660e8400-e29b-41d4-a716-446655440005',
      '660e8400-e29b-41d4-a716-446655440006',
      '660e8400-e29b-41d4-a716-446655440007',
      '660e8400-e29b-41d4-a716-446655440008',
      '660e8400-e29b-41d4-a716-446655440009',
      '660e8400-e29b-41d4-a716-446655440010',
      '660e8400-e29b-41d4-a716-446655440011',
      '660e8400-e29b-41d4-a716-446655440012',
      '660e8400-e29b-41d4-a716-446655440013',
      '660e8400-e29b-41d4-a716-446655440014',
      '660e8400-e29b-41d4-a716-446655440015',
      '660e8400-e29b-41d4-a716-446655440016',
      '660e8400-e29b-41d4-a716-446655440017',
      '660e8400-e29b-41d4-a716-446655440018',
      '660e8400-e29b-41d4-a716-446655440019',
      '660e8400-e29b-41d4-a716-446655440020',
      '660e8400-e29b-41d4-a716-446655440021',
      '660e8400-e29b-41d4-a716-446655440022',
      '660e8400-e29b-41d4-a716-446655440023',
      '660e8400-e29b-41d4-a716-446655440024',
      '660e8400-e29b-41d4-a716-446655440025',
      '660e8400-e29b-41d4-a716-446655440026',
      '660e8400-e29b-41d4-a716-446655440027',
      '660e8400-e29b-41d4-a716-446655440028',
      '660e8400-e29b-41d4-a716-446655440029',
      '660e8400-e29b-41d4-a716-446655440030'
    );