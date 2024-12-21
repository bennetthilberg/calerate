'use server';

import { createClient } from "@/utils/supabase/server";
import validateEmail from "@/utils/validateEmail";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function signUp(email, password) {

    if (!validateEmail(email)) {
        throw new Error('Invalid email')
    }
    if (!password || password?.length < 6) {
        throw new Error('Invalid password')
    }

    const supabase = await createClient()
    const data = {
        email, password
    }

    const { data: userData, error } = await supabase.auth.signUp(data)
    if (error) {
        throw new Error(error.message);
    }
    console.log('userData:', userData);
    if (!userData?.user?.id) {
        throw new Error('Error signing up')
    }

    const {error: tableInsertError} = await supabase
        .from('users')
        .insert([
            {
                uuid: userData.user.id,
                email: userData.user.email
            }
        ])
    if(tableInsertError){
        throw new Error(tableInsertError.message);
    }

    revalidatePath('/', 'layout')
    return { ok: true }


}