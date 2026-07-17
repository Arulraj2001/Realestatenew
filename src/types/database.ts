export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'super_admin' | 'content_admin' | 'sales_admin';
export type PropertyStatus = 'Upcoming' | 'Ongoing' | 'Completed';
export type PropertyType = 'Plot' | 'Villa' | 'Apartment' | 'Commercial';
export type PriceDisplayMode = 'On Request' | 'Starting From' | 'Fixed';
export type AvailabilityStatus = 'Available' | 'Sold Out' | 'Fast Filling';
export type MediaType = 'image' | 'video';
export type ContentPageKey = 'home' | 'about' | 'services' | 'contact' | 'privacy' | 'terms';
export type MessageType = 'contact' | 'site_visit';
export type MessageStatus = 'new' | 'contacted' | 'site_visit_scheduled' | 'completed' | 'closed' | 'spam';

export interface AdminProfile {
  id: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  hero_image_path: string | null;
  hero_video_path: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  display_order: number;
  published: boolean;
  featured: boolean;
  location_status: 'current' | 'upcoming';
  show_in_navigation: boolean;
  created_at: string;
  updated_at: string;
  projects?: Project[];
}

export interface Project {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  project_status: PropertyStatus;
  approval_type: string | null;
  approval_number: string | null;
  total_area: string | null;
  total_plots: number;
  total_villas: number;
  starting_price: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  hero_image_path: string | null;
  hero_video_path: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;

  // Joins
  location?: Location;
  property_configurations?: PropertyConfiguration[];
  landmarks?: Landmark[];
  amenities?: Amenity[];
}

export interface PropertyConfiguration {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  property_type: PropertyType;
  bhk: number;
  plot_area: string | null;
  built_up_area: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: string | null;
  floors: number;
  starting_price: number | null;
  price_display_mode: PriceDisplayMode;
  availability_status: AvailabilityStatus;
  short_description: string | null;
  full_description: string | null;
  feature_list: Json;
  hero_image_path: string | null;
  gallery_images?: Json | string[];
  published: boolean;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;

  project?: Project;
}

export interface Amenity {
  id: string;
  name: string;
  icon_key: string | null;
  description: string | null;
  category?: 'land' | 'house' | 'general' | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectAmenity {
  project_id: string;
  amenity_id: string;
  custom_description: string | null;
  display_order: number;
  amenity?: Amenity;
}

export interface Landmark {
  id: string;
  project_id: string;
  name: string;
  distance_label: string;
  travel_time_label: string | null;
  image_url?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  location_id: string | null;
  project_id: string | null;
  property_configuration_id: string | null;
  media_type: MediaType;
  storage_path_or_url: string;
  thumbnail_path: string | null;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  video_url?: string | null;
  embed_type?: 'supabase' | 'youtube' | 'instagram' | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: string;
  page_key: ContentPageKey;
  title: string;
  slug: string;
  content: Json;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SEOMetadata {
  id: string;
  entity_type: string;
  entity_id: string | null;
  meta_title: string;
  meta_description: string;
  canonical_url: string | null;
  open_graph_title: string | null;
  open_graph_description: string | null;
  open_graph_image_path: string | null;
  index_enabled: boolean;
  json_ld_override: Json | null;
  sitemap_priority: number | null;
  sitemap_change_frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  message_type: MessageType;
  name: string;
  phone: string;
  email: string | null;
  location_id: string | null;
  project_id: string | null;
  property_configuration_id: string | null;
  preferred_visit_date: string | null;
  preferred_visit_time: string | null;
  message: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: MessageStatus;
  assigned_admin_id: string | null;
  admin_notes: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;

  location?: Location;
  project?: Project;
  property_configuration?: PropertyConfiguration;
  assigned_admin?: AdminProfile;
}

export interface SiteSetting {
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: AdminProfile;
        Insert: Omit<AdminProfile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<AdminProfile, 'id'>>;
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Location, 'id'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Project, 'id'>>;
      };
      property_configurations: {
        Row: PropertyConfiguration;
        Insert: Omit<PropertyConfiguration, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<PropertyConfiguration, 'id'>>;
      };
      amenities: {
        Row: Amenity;
        Insert: Omit<Amenity, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Amenity, 'id'>>;
      };
      project_amenities: {
        Row: ProjectAmenity;
        Insert: ProjectAmenity;
        Update: Partial<ProjectAmenity>;
      };
      landmarks: {
        Row: Landmark;
        Insert: Omit<Landmark, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Landmark, 'id'>>;
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<GalleryItem, 'id'>>;
      };
      content_pages: {
        Row: ContentPage;
        Insert: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ContentPage, 'id'>>;
      };
      seo_metadata: {
        Row: SEOMetadata;
        Insert: Omit<SEOMetadata, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<SEOMetadata, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at' | 'status' | 'assigned_admin_id' | 'admin_notes' | 'read_at'> & {
          id?: string;
          status?: MessageStatus;
          assigned_admin_id?: string | null;
          admin_notes?: string | null;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Message, 'id'>>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<SiteSetting, 'key'>>;
      };
    };
  };
}
