'use client';
import Link from "next/link";
import styles from './NavBar.module.scss';
import { useRouter } from "next/navigation";
export default function SignOutLink({handleSignOut}){
    const router = useRouter();
    function handleClick(){
        handleSignOut();
        router.refresh();
    }
    return(
        <Link className={styles.logInOut} href='/' onClick={() => handleClick()}>Sign out</Link>
    )
}