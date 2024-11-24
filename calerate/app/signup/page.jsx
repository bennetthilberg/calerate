'use client';
import { useEffect } from "react";
import styles from "./SignupPage.module.scss"
import { useRouter } from "next/navigation";


export default function SignupPage() {
    const router = useRouter();
    async function handleSignup(e) {
        e.preventDefault();
        const res = await fetch('auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e.target.email.value,
                password: e.target.password.value
            })
        });
        if(res.ok){
            // tell user to check their email
            router.push('/');
        }
    }

    return (
        <form className={styles.signupForm}
            onSubmit={e => handleSignup(e)}
        >
            <h2>Welcome</h2>
            <p>Create an account to save your meals</p>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email"
                autoComplete='email'
                required />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password"
                autoComplete="current-password"
                required />
            <button className={styles.signup} type="submit">Sign up</button>
        </form>
    )
}