import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://qzjdgcbsxquaujrbtluy.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6amRnY2JzeHF1YXVqcmJ0bHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMjcxMDQsImV4cCI6MjA0NTgwMzEwNH0.bsGIrdXSs8iojPX94DxK3bXuPrzE0Ojr7WPlFY__2Sc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
