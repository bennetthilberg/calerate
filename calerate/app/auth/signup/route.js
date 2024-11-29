import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server";
export async function POST(req) {
    const supabase = await createClient()

    const {email, password} = await req.json();

    const { data: newUserData, error: newUserError } = await supabase.auth.signUp({email, password});
    if(newUserError){
        return NextResponse.json({ error: newUserError.message }, { status: 400 });
    }
    

    const {data: dbData, error: dbError} = await supabase
        .from('users')
        .insert({
            uuid: newUserData.user.id,
            created_at: newUserData.user.created_at,
            updated_at: newUserData.user.updated_at,
            email: newUserData.user.email
        })
        .select()

    if(dbError){
        return NextResponse.json({ error: dbError.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Sign-up successful! Please check your email to verify your account.' }, { status: 200 });
}