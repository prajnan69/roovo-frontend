import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export const fetchListings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/listings`);
  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }
  return response.json();
};

export const fetchListingById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch listing ${id}: ${response.status} ${response.statusText}`, errorText);
    throw new Error('Failed to fetch listing');
  }
  const data = await response.json();
  console.log(`Successfully fetched listing ${id}:`, data);
  return data;
};

export const getListingsByHostId = async (hostId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/listings/host/${hostId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch listings by host ID');
  }
  const result = await response.json();
  return result.data;
};

export default supabase;
