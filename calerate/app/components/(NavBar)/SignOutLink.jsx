'use client';
import Link from "next/link";
import styles from './NavBar.module.scss';
export default function SignOutLink({handleSignOut}){
    return(
        <Link className={styles.logInOut} href='/' onClick={() => handleSignOut()}>Sign out</Link>
    )
}