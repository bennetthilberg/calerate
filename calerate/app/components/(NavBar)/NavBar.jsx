import Link from "next/link";
import styles from "./NavBar.module.scss";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    return (
        <div className={styles.navBar}>
            <h1>Calerate</h1>
            {/*<SignInOut />*/}
            {user ?
                <form className={styles.logInOut} action={handleSignOut}>
                    <button type="submit">Sign Out</button>
                </form>
                :
                <Link className={styles.logInOut} href='login'>Log in</Link>
            }
        </div>
    )
}