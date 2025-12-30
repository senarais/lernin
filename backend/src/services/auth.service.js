import { supabaseAnon, supabaseSecret } from "../config/supabase.js";

export const registerUser = async ({email, password, username}) => {
    const { data, error } = await supabaseAnon.auth.signUp({
        email,
        password
    })
    if (error) throw error

    const {error: dbError} = await supabaseSecret
        .from('users')
        .insert({
            id: data.user.id,
            email,
            username
        })
    
    if (dbError) throw dbError

    return {id: data.user.id, email, username}
}

export const loginUser = async ({email, password}) => {
    const {data, error} = await supabaseAnon.auth.signInWithPassword({
        email,
        password
    })

    if (error) throw error

    const {data: user, error: userError} = await supabaseSecret
        .from('users')
        .select('id, email, username')
        .eq('id', data.user.id)
        .single()
    
    if (userError) throw userError

    return {
        ...user,
        accessToken: data.session.access_token
    }
}

export const getUser = async (userId) => {
    const {data, error} = await supabaseSecret
    .from('users')
    .select('id, email, username')
    .eq('id', userId)
    .single()

    console.log(data);

    if(error) throw error
    return data;
}