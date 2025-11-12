// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  zip_code: string | null;
  user_type: 'owner' | 'caregiver' | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age: number | null;
  special_needs: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface CaregiverProfile {
  id: string;
  services: string[];
  availability: string | null;
  experience_years: number | null;
  rating: number;
  total_reviews: number;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
  profiles?: Profile;
}

export interface Booking {
  id: string;
  owner_id: string;
  caregiver_id: string;
  pet_id: string;
  service_type: string;
  booking_date: string;
  start_time: string;
  duration_hours: number;
  special_requests: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  meet_and_greet: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  booking_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// App State Types
export type ScreenName = 
  | 'welcome'
  | 'signup'
  | 'login'
  | 'onboarding'
  | 'petProfile'
  | 'dashboard'
  | 'discovery'
  | 'caregiverProfile'
  | 'booking'
  | 'bookingConfirm'
  | 'messages'
  | 'chat'
  | 'profile';

export interface AuthState {
  session: any | null;
  user: Profile | null;
  loading: boolean;
}

// API Response Types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface CaregiverWithProfile extends CaregiverProfile {
  profiles: Profile;
}

// Service Types
export type ServiceType = 
  | 'Pet Sitting'
  | 'Dog Walking'
  | 'Grooming'
  | 'Playdate'
  | 'Training'
  | 'Boarding';

export interface ServiceCategory {
  id: string;
  name: ServiceType;
  icon: string;
  description: string;
}

// Booking Request
export interface BookingRequest {
  caregiver_id: string;
  pet_id: string;
  service_type: ServiceType;
  booking_date: Date;
  start_time: string;
  duration_hours: number;
  special_requests?: string;
  meet_and_greet: boolean;
}

// Search Filters
export interface SearchFilters {
  services?: ServiceType[];
  maxDistance?: number;
  minRating?: number;
  availability?: string;
  verified?: boolean;
}

// User Preferences
export interface UserPreferences {
  notifications: boolean;
  locationSharing: boolean;
  emailUpdates: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export default {
  Profile,
  Pet,
  CaregiverProfile,
  Booking,
  Message,
  Review,
};
