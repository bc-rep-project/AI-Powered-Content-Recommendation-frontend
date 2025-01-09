import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Content-related Supabase queries
export const contentQueries = {
    getRecommendations: async () => {
        const { data, error } = await supabase
            .from('contents')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },
    
    getContentById: async (id: string) => {
        const { data, error } = await supabase
            .from('contents')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }
};

// User interaction queries
export const interactionQueries = {
    recordInteraction: async (interaction: any) => {
        const { data, error } = await supabase
            .from('user_interactions')
            .insert([interaction]);
        
        if (error) throw error;
        return data;
    },
    
    getUserInteractions: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_interactions')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    }
}; 