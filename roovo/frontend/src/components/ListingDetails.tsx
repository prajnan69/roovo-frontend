"use client";

import React, { useState } from 'react';
import { Home, Tag, Info, List, User, Settings } from 'lucide-react';
import { ListingData } from '@/types';

// Accent token
const ACCENT = '#FF5A5F'; // Airbnb coral

// Reusable component for section-based settings
const SettingSection = ({ title, subtitle, children, isEditing }: { title: string; subtitle?: string; children: React.ReactNode; isEditing: boolean }) => (
  <section className={`p-6 rounded-2xl border border-white/6 bg-white/5 backdrop-blur-md shadow-lg transition-all duration-300 ${isEditing ? 'ring-2 ring-offset-2 ring-white/5' : ''}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className="mt-5 space-y-4">{children}</div>
  </section>
);

// Reusable component for individual setting items
const SettingItem = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div>
      <div className="text-sm text-gray-300 font-medium">{label}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
    <div className="min-w-[220px] flex items-center justify-end">{children}</div>
  </div>
);

// Reusable counter component
const Counter = ({ value, onIncrement, onDecrement, isEditing }: { value: number; onIncrement: () => void; onDecrement: () => void; isEditing: boolean }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onDecrement}
      disabled={!isEditing}
      aria-label="decrement"
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition transform ${isEditing ? 'bg-white/6 hover:scale-105' : 'bg-black/30 cursor-not-allowed'}`}>
      −
    </button>
    <div className="w-12 text-center text-white font-semibold">{value}</div>
    <button
      onClick={onIncrement}
      disabled={!isEditing}
      aria-label="increment"
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition transform ${isEditing ? 'bg-white/6 hover:scale-105' : 'bg-black/30 cursor-not-allowed'}`}>
      +
    </button>
  </div>
);

const sections = [
  { id: 'Property', label: 'Property', icon: Home },
  { id: 'Price', label: 'Price', icon: Tag },
  { id: 'Description', label: 'Description', icon: Info },
  { id: 'Amenities', label: 'Amenities', icon: List },
  { id: 'Host', label: 'Host', icon: User }
];

const ListingDetails = ({ data }: { data: ListingData }) => {
  const [listingData, setListingData] = useState({
    ...data,
    included_amenities: data.included_amenities || []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setListingData({ ...listingData, [name]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = listingData.included_amenities.includes(amenity);
    setListingData({
      ...listingData,
      included_amenities: exists
        ? listingData.included_amenities.filter(a => a !== amenity)
        : [...listingData.included_amenities, amenity]
    });
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Property':
        return (
          <SettingSection title="Property Details" subtitle="Basic property configuration" isEditing={isEditing}>
            <SettingItem label="Property type">
              {isEditing ? (
                <select name="property_type" value={listingData.property_type} onChange={handleChange} className="w-full md:w-1/2 p-2 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2" style={{boxShadow: isEditing ? `0 4px 18px ${ACCENT}20` : 'none'}}>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Guesthouse</option>
                  <option>Hotel</option>
                </select>
              ) : <p className="text-white">{listingData.property_type}</p>}
            </SettingItem>

            <SettingItem label="Listing type">
              {isEditing ? (
                <select name="listing_type" value={listingData.listing_type} onChange={handleChange} className="w-full md:w-1/2 p-2 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2">
                  <option>Entire place</option>
                  <option>Room</option>
                  <option>Shared room</option>
                </select>
              ) : <p className="text-white">{listingData.listing_type}</p>}
            </SettingItem>

            <SettingItem label="Floors in building">
              <Counter
                value={listingData.floors ?? 0}
                onIncrement={() => setListingData({ ...listingData, floors: (listingData.floors || 1) + 1 })}
                onDecrement={() => setListingData({ ...listingData, floors: Math.max(1, (listingData.floors || 1) - 1) })}
                isEditing={isEditing}
              />
            </SettingItem>

            <SettingItem label="Listing floor">
              <Counter
                value={listingData.floor ?? 0}
                onIncrement={() => setListingData({ ...listingData, floor: (listingData.floor || 1) + 1 })}
                onDecrement={() => setListingData({ ...listingData, floor: Math.max(1, (listingData.floor || 1) - 1) })}
                isEditing={isEditing}
              />
            </SettingItem>
          </SettingSection>
        );

      case 'Price':
        return (
          <SettingSection title="Pricing per Night" subtitle="Set a competitive price" isEditing={isEditing}>
            <SettingItem label="Price">
              {isEditing ? (
                <div className="flex items-center w-full md:w-1/2 gap-3">
                  <span className="text-gray-300">₹</span>
                  <input type="number" name="price_per_night" value={listingData.price_per_night} onChange={handleChange} className="w-full p-2 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2" />
                </div>
              ) : <p className="text-white">₹{listingData.price_per_night}</p>}
            </SettingItem>

            <SettingItem label="Cleaning fee" hint="Optional one-time cleaning fee">
              {isEditing ? (
                <input type="number" name="cleaning_fee" value={listingData.cleaning_fee || ''} onChange={handleChange} className="w-full md:w-1/2 p-2 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2" />
              ) : <p className="text-gray-300">{listingData.cleaning_fee ? `₹${listingData.cleaning_fee}` : '—'}</p>}
            </SettingItem>
          </SettingSection>
        );

      case 'Description':
        return (
          <SettingSection title="Listing Description" subtitle="Tell guests about the space" isEditing={isEditing}>
            {isEditing ? (
              <textarea name="the_space" value={listingData.the_space} onChange={handleChange} className="w-full h-40 p-3 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2" />
            ) : <p className="text-gray-300 leading-relaxed">{listingData.the_space || 'No description yet.'}</p>}
          </SettingSection>
        );

      case 'Amenities':
        return (
          <SettingSection title="Included Amenities" subtitle="Toggle what’s included" isEditing={isEditing}>
            <div className="flex flex-wrap gap-3">
              {['WiFi', 'Kitchen', 'Washer', 'Air conditioning', 'Heating', 'Parking'].map(amenity => {
                const active = listingData.included_amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => isEditing && toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${active ? 'bg-white/10 text-white' : 'bg-transparent text-gray-300 border border-white/5'}`}
                    aria-pressed={active}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </SettingSection>
        );

      case 'Host':
        return (
          <SettingSection title="Host Information" subtitle="Public profile for guests" isEditing={isEditing}>
            <SettingItem label="Host Name">
              {isEditing ? (
                <input name="host_name" value={listingData.host_name} onChange={handleChange} className="w-full md:w-1/2 p-2 bg-transparent border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2" />
              ) : <p className="text-white">{listingData.host_name}</p>}
            </SettingItem>
            <SettingItem label="Superhost Status">
              <span className={`px-3 py-1 rounded-full text-sm ${listingData.is_superhost ? 'bg-green-500 text-black' : 'bg-yellow-600 text-black'}`}>{listingData.is_superhost ? 'Superhost' : 'Standard'}</span>
            </SettingItem>
          </SettingSection>
        );

      default:
        return null;
    }
  };

  const getLocationString = (location: any): string => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location !== null && 'city' in location) {
      return location.city;
    }
    return 'Location not set';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#000000, #0b0b0b)' }} className="text-white py-10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div style={{ width: 56, height: 56 }} className="rounded-xl bg-gradient-to-br from-white/6 to-white/3 flex items-center justify-center border border-white/6">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 7v7c0 5-4 9-8 9s-8-4-8-9V7l8-5z" fill={ACCENT} />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{listingData.title}</h1>
              <p className="text-sm text-gray-400 mt-1">{getLocationString(listingData.location)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-250 shadow-sm border ${isEditing ? 'bg-white text-black border-white/10' : 'bg-transparent border-white/5 text-white hover:scale-105'}`}
              style={{ boxShadow: isEditing ? `0 6px 30px ${ACCENT}33` : undefined }}
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={() => alert('Saved (demo)')}
                className="px-5 py-2 rounded-full font-semibold transition-all duration-250 bg-gradient-to-r from-[#FF7A7D] to-[#FF5A5F] text-white shadow-md"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Save
              </button>
            )}
          </div>
        </div>

        <div className="md:flex md:gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block md:w-72">
            <div className="sticky top-24 p-4 rounded-2xl bg-white/3 backdrop-blur-md border border-white/6">
              <nav className="flex flex-col gap-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-200 ${active ? 'bg-white/8 text-white scale-100' : 'text-gray-300 hover:bg-white/3'}`}
                      style={{ borderLeft: active ? `3px solid ${ACCENT}` : '3px solid transparent' }}
                    >
                      <span className={`p-2 rounded-md`} style={{ background: active ? 'rgba(255,90,95,0.12)' : 'transparent' }}>
                        <Icon size={18} color={active ? ACCENT : 'rgba(255,255,255,0.6)'} />
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs text-gray-400">{section.id === 'Price' ? 'Pricing' : section.label}</div>
                      </div>
                      <div className="text-xs text-gray-400">›</div>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-xs text-gray-400">Listing status</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="text-sm">Published</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 mt-6 md:mt-0">
            <div className="grid grid-cols-1 gap-6">
              {renderSectionContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Small-screen bottom nav */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] p-3 rounded-2xl bg-white/6 backdrop-blur-md border border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {sections.slice(0,3).map(s => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex flex-col items-center gap-1 ${active ? 'text-white' : 'text-gray-300'}`}>
                <Icon size={18} color={active ? ACCENT : 'rgba(255,255,255,0.6)'} />
                <div className="text-xs">{s.label}</div>
              </button>
            );
          })}
        </div>
        <div>
          <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A7D] to-[#FF5A5F] text-white font-medium">{isEditing ? 'Done' : 'Edit'}</button>
        </div>
      </div>

      <style jsx>{`
        :root { --accent: ${ACCENT}; }
        /* small shadow accent for focused inputs */
        input:focus, textarea:focus, select:focus { box-shadow: 0 6px 24px var(--accent, ${ACCENT})33; }
      `}</style>
    </div>
  );
};

export default ListingDetails;
