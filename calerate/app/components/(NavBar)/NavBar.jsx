import Link from "next/link";
import styles from "./NavBar.module.scss";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getOrCreateToday from "@/utils/getOrCreateToday";
import SignOutLink from "./SignOutLink";

async function handleSignOut() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}

export default async function NavBar() {
    const supabase = await createClient()
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    const today = await getOrCreateToday();
    return (
        <div className={styles.navBar}>
            {
                today?.goal_calories > 0 &&
                <p>
                    <span>{today.goal_calories - (today.total_calories ?? 0)} </span>cals left
                </p>
            }
            <h1>Calerate</h1>
            {/*<SignInOut />*/}
            {user ?
                <SignOutLink handleSignOut={handleSignOut} />
                :
                <Link className={styles.logInOut} href='login'>Log in</Link>
            }
        </div>
        
    )
    
}

/*

                <form className={styles.logInOut} action={handleSignOut}>
                <button type="submit">Sign Out</button>
                </form>
                
*/