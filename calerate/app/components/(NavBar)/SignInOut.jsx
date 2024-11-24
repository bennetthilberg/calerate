'use client';
//import { createClient } from "@/utils/supabase/client"
import supabase from "@/utils/supabase/persistentClient";
import Link from "next/link";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function SignInOut() {
    //const supabase = createClient()
    const [signedIn, setSignedIn] = useState(false);
    const router = useRouter();
    useEffect(() => {
        console.log('useEffect running')
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('auth state change')
            console.log('event:', event)
            console.log('session:', session)
            if (event === 'SIGNED_IN') {
                setSignedIn(true);
            }
            else if (event === 'SIGNED_OUT') {
                setSignedIn(false);
            }
        });

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSignedIn(true);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    function handleSignOut() {
        supabase.auth.signOut()
        router.push('/login')
    }

    // call unsubscribe to remove the callback
    //data.subscription.unsubscribe()
    return (
        <>
            {signedIn ?
                <button onClick={() => handleSignOut()}>Sign Out</button> :
                <Link href='login'>Log in</Link>
            }
        </>
    )
}