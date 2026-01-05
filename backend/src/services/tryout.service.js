import { supabaseSecret } from "../config/supabase"

export const getTryoutList = async () => {
    const {data, error} = await supabaseSecret
        .from('tryouts')
        .select('id, title, description, duration_minutes, created_at')
        .order('id')
    if(error) throw error

    return data;
}

export const getTryoutDetail = async(tryoutId) => {
    const {data, error} = await supabaseSecret
        .from('tryouts')
        .select(`
            id,
            title,
            description,
            duration_minutes,
            questions ( id )
        `)
}