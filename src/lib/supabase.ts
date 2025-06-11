import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase configuration
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('supabase.co') && urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  return !!(key && key.length > 20 && key.startsWith('eyJ'));
};

const hasValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      isValidUrl(supabaseUrl) &&
                      isValidKey(supabaseAnonKey);

if (!hasValidConfig) {
  console.warn('⚠️ Supabase configuration invalid or missing.');
  if (!supabaseUrl) console.warn('Missing VITE_SUPABASE_URL');
  if (!supabaseAnonKey) console.warn('Missing VITE_SUPABASE_ANON_KEY');
  if (supabaseUrl && !isValidUrl(supabaseUrl)) console.warn('Invalid VITE_SUPABASE_URL format');
  if (supabaseAnonKey && !isValidKey(supabaseAnonKey)) console.warn('Invalid VITE_SUPABASE_ANON_KEY format');
}

// Create Supabase client with proper error handling
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'nomad-ai-pwa'
        }
      }
    })
  : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU1NjcyNDAsImV4cCI6MTk2MTE0MzI0MH0.placeholder');

// Export configuration status for components to check
export const isSupabaseConfigured = hasValidConfig;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          avatar_url?: string;
          bio?: string;
          location?: string;
          phone?: string;
          skills: string[];
          availability: string[];
          transport_means: string[];
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          avatar_url?: string;
          bio?: string;
          location?: string;
          phone?: string;
          skills?: string[];
          availability?: string[];
          transport_means?: string[];
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          location?: string;
          phone?: string;
          skills?: string[];
          availability?: string[];
          transport_means?: string[];
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          price_from: number;
          price_to?: number;
          price_unit: string;
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          price_from: number;
          price_to?: number;
          price_unit: string;
          category: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          price_from?: number;
          price_to?: number;
          price_unit?: string;
          category?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email?: string;
          phone?: string;
          address?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string;
          phone?: string;
          address?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          messages: Array<{
            role: 'user' | 'assistant';
            content: string;
            timestamp: string;
          }>;
          conversation_type: 'onboarding' | 'coaching' | 'support';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          messages: Array<{
            role: 'user' | 'assistant';
            content: string;
            timestamp: string;
          }>;
          conversation_type: 'onboarding' | 'coaching' | 'support';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          messages?: Array<{
            role: 'user' | 'assistant';
            content: string;
            timestamp: string;
          }>;
          conversation_type?: 'onboarding' | 'coaching' | 'support';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};