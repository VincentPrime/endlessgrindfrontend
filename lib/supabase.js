import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

// Create Supabase client for file storage only
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // We're not using Supabase auth
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

export const uploadCoachImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `coach/${fileName}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from('promo')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('promo')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}