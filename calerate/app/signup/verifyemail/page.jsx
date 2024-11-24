import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
export default async function VerifyEmail() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    else if(data.user.raw_user_meta_data?.email_verified){
        redirect('/')
    }
    return (
        <div>
            <h1>Verify your email</h1>
            <p>Thanks for signing up. To finish creating your account, click the verification link we sent to your email.</p>
        </div>
    )
}