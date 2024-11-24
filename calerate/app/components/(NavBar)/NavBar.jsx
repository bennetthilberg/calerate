import Link from "next/link";
import styles from "./NavBar.module.scss";
import { createClient } from "@/utils/supabase/server";
import SignInOut from "./SignInOut";

export default async function NavBar() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    return (
        <div className={styles.navBar}>
            <h1>Calerate</h1>
            <SignInOut />
        </div>
    )
}