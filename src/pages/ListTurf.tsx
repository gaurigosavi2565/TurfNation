// src/pages/ListTurf.tsx (Final Stabilized Version with Optional Fields)

import React, { useState, useMemo } from "react";
// Import RHF core function and types (using 'type' for compatibility)
import { useForm } from "react-hook-form";
import type { Resolver, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { Plus, X, ChevronDown, Check } from "lucide-react"; // Added icons
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
// Using local type definition for stability
type Sport = { id: string, name: string }; 

// --- Hardcoded Sports Data (Ensures the list is always available) ---
const ALL_SPORTS: Sport[] = [
  { id: "cricket", name: "Cricket" },
  { id: "football", name: "Football" },
  { id: "tennis", name: "Tennis" },
  { id: "badminton", name: "Badminton" },
  { id: "volleyball", name: "Volleyball" },
  { id: "basketball", name: "Basketball" },
  { id: "hockey", name: "Hockey" },
  { id: "squash", name: "Squash" },
];

// ---- Validation schema (FIXED to make sports and images optional) ----
const turfSchema = z.object({
  name: z.string().min(1, "Turf name is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  state: z.string().default("Maharashtra"),
  price_per_hour: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(1, "Price must be greater than 0"),
  
  // FIX: Make sports optional (removed .min(1))
  sports: z.array(z.string()).default([]), 
  
  // Amenities MUST still be required
  amenities: z.array(z.string()).min(1, "Add at least one amenity"),
  
  // FIX: Make images optional (removed .min(1))
  images: z.array(z.string()).optional().default([]), 
});

type TurfFormData = z.infer<typeof turfSchema>;

// Custom resolver (The error-free solution for RHF/Zod conflicts)
const customZodResolver: Resolver<TurfFormData> = (values) => {
  const result = turfSchema.safeParse(values);

  if (result.success) {
    // RHF will ONLY call onSubmit if success is true
    return { values: result.data, errors: {} };
  } else {
    // Transformation of Zod errors into RHF's FieldErrors<TurfFormData> structure
    const errors: FieldErrors<TurfFormData> = {};
    for (const error of result.error.errors) {
      if (error.path.length > 0) {
        const path = error.path.join('.') as keyof TurfFormData; 
        errors[path] = {
          type: error.code,
          message: error.message,
        };
      }
    }
    // Return empty data object and the formatted errors
    return { values: {}, errors: errors };
  }
};

const ListTurf: React.FC = () => {
  const sports = ALL_SPORTS; 
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false); 

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } =
    useForm<TurfFormData>({
      // Use the custom resolver function
      resolver: customZodResolver, 
      defaultValues: {
        name: "",
        city: "",
        area: "",
        state: "Maharashtra",
        price_per_hour: 0,
        sports: [], 
        amenities: [],
        images: [],
      },
    });

  const watchedSports = watch("sports");
  const watchedAmenities = watch("amenities");
  const watchedImages = watch("images");

  // Helper to display selected sport names in the dropdown button
  const selectedSportNames = useMemo(() => {
    if (!watchedSports || watchedSports.length === 0) {
      return "Select available sports (optional)";
    }
    const names = watchedSports.map(id => sports.find(s => s.id === id)?.name).filter(Boolean);
    return names.join(", ");
  }, [watchedSports, sports]);


  const handleSportToggle = (sportId: string) => {
    const current = watchedSports || [];
    const next = current.includes(sportId)
      ? current.filter((id) => id !== sportId)
      : [...current, sportId];
    setValue("sports", next);
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setValue("amenities", [...(watchedAmenities || []), newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (idx: number) => {
    setValue(
      "amenities",
      (watchedAmenities || []).filter((_, i) => i !== idx)
    );
  };

  const addImage = () => {
    if (newImage.trim()) {
      setValue("images", [...(watchedImages || []), newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (idx: number) => {
    setValue(
      "images",
      (watchedImages || []).filter((_, i) => i !== idx)
    );
  };

  const onSubmit = async (data: TurfFormData) => {
    setLoading(true);
    try {
      // Ensure images is defined, though Zod default should handle it
      const imagesToInsert = data.images || []; 
      const sportsToInsert = data.sports || [];

      // 1) Insert turf
      const { data: turfRow, error: turfError } = await supabase
        .from("turfs")
        .insert({
          name: data.name,
          city: data.city,
          area: data.area,
          state: data.state,
          price_per_hour: data.price_per_hour,
          sports: sportsToInsert, 
          amenities: data.amenities,
          images: imagesToInsert, 
          rating: 4.5,
          is_active: true,
        })
        .select()
        .single();

      if (turfError) throw turfError;

      // 2) Create default availability (Only if sports are selected)
      if (sportsToInsert.length > 0) {
        const availabilityRows = sportsToInsert.flatMap((sportId) => {
          const forDay = (weekday: number) => ([
            { turf_id: turfRow.id, sport_id: sportId, weekday, start_time: "06:00", end_time: "10:00", slot_minutes: 60 },
            { turf_id: turfRow.id, sport_id: sportId, weekday, start_time: "16:00", end_time: "22:00", slot_minutes: 60 },
          ]);
          return [1, 2, 3, 4, 5, 6, 7].flatMap(forDay);
        });

        const { error: availabilityError } = await supabase
          .from("turf_availability")
          .insert(availabilityRows);
        if (availabilityError) throw availabilityError;
      }

      // 3) Mirror to localStorage 
      try {
        const KEY = "tn_owner_turfs";
        const existing: any[] = JSON.parse(localStorage.getItem(KEY) || "[]");
        const sportNames =
          (sportsToInsert)
            .map((id) => ALL_SPORTS.find((s) => s.id === id)?.name)
            .filter(Boolean) as string[];

        const mirrored = {
          id: String(turfRow.id),
          name: data.name,
          area: data.area,
          city: data.city,
          state: data.state || "Maharashtra",
          rating: 4.5,
          price_per_hour: Number(data.price_per_hour),
          images: imagesToInsert, 
          amenities: [...data.amenities],
          sport_names: sportNames, 
          is_active: true,
        };

        const withoutDup = existing.filter((t) => String(t.id) !== String(mirrored.id));
        withoutDup.unshift(mirrored);
        localStorage.setItem(KEY, JSON.stringify(withoutDup));
      } catch (e) {
        console.warn("Local mirror failed (non-blocking):", e);
      }

      toast.success("Turf listed successfully!");
      reset();
    } catch (err) {
      console.error("Error listing turf:", err);
      // The original error handling here is correct
      toast.error("Failed to list turf. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cities = ["Nashik", "Mumbai", "Pune", "Thane", "Aurangabad", "Nagpur"];
  const commonAmenities = [
    "Free WiFi", "Parking Available", "Changing Rooms", "Washrooms", "Cafeteria", "Floodlights", 
    "Security", "CCTV", "Seating Gallery", "Equipment Rental",
  ];

  const sampleImages = [
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit-crop",
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit-crop",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit-crop",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">
            List Your Turf
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join TurfNation and start earning by listing your sports facility.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Turf Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Champions Sports Arena"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <select
                    {...register("city")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Area *
                  </label>
                  <input
                    {...register("area")}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Gangapur Road"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.area.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price per Hour (₹) *
                  </label>
                  <input
                    {...register("price_per_hour", { valueAsNumber: true })}
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 800"
                  />
                  {errors.price_per_hour && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price_per_hour.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sports - Multi-Select Dropdown (Now optional) */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">
                Available Sports
              </h2>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 text-left bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <span className="truncate pr-2 text-slate-700">
                    {selectedSportNames}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isSportDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {/* Dropdown Panel */}
                {isSportDropdownOpen && (
                  <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-slate-300 rounded-lg shadow-lg mt-1 p-3 space-y-1">
                    {sports.map((sport) => (
                      <button
                        key={sport.id}
                        type="button"
                        onClick={() => handleSportToggle(sport.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-sm"
                      >
                        <span className="text-slate-700">
                          {sport.name}
                        </span>
                        {watchedSports?.includes(sport.id) && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {watchedSports.length === 0 && (
                 <p className="mt-2 text-sm text-slate-500">
                    No sports selected. Turf will be listed without specific sports.
                 </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">
                Amenities *
              </h2>
              {/* Quick add common amenities */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Quick add common amenities:
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        const current = watchedAmenities || [];
                        if (!current.includes(amenity)) {
                          setValue("amenities", [...current, amenity]);
                        }
                      }}
                      className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      + {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add custom amenity */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Display added amenities */}
              <div className="flex flex-wrap gap-2">
                {watchedAmenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.amenities && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amenities.message}
                </p>
              )}
            </div>

            {/* Images (Now optional) */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">
                Images
              </h2>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Quick add sample images:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {sampleImages.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        const current = watchedImages || [];
                        if (!current.includes(image)) {
                          setValue("images", [...current, image]);
                        }
                      }}
                      className="relative aspect-video rounded-lg overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-colors"
                    >
                      <img
                        src={image}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Add image URL"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchedImages?.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-200"
                  >
                    <img
                      src={image}
                      alt={`Turf ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {watchedImages.length === 0 && (
                 <p className="mt-2 text-sm text-slate-500">
                    No images added. Your turf can still be listed.
                 </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Listing Turf..." : "List My Turf"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListTurf;