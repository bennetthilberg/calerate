'use client';
import signup from './signup';
import Link from 'next/link'
import { useState } from 'react';
import styles from "./SignupPage.module.scss"
import { ClipLoader } from 'react-spinners';
import validateEmail from '@/utils/validateEmail';
import { useRouter } from 'next/navigation';
import signUp from '../search-results/signUp';


export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [errorText, setErrorText] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    async function handleSignup(e) {
        /*
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
        */
        e.preventDefault();
        setLoading(true);
        if (!validateEmail(email)) {
            setError(true);
            setErrorText('Please enter a valid email');
            setLoading(false);
            return;
        }
        if (!password || password?.length < 6) {
            setError(true);
            setErrorText('Please enter a valid password');
            setLoading(false);
            return;
        }
        setError(false);
        setErrorText(null);
        signUp(email, password).then(res => {
            if (res.ok) {
                router.push('/foods')
            }
        }).catch(err => {
            console.error(err);
            setError(true);
            setErrorText(err.message);
            setLoading(false);
        })
    }
    function handleLogin(e) {
        e.preventDefault();
        router.push('/login')
    }
    return (
        <form className={styles.signUpForm}>
            <h2>Create your account</h2>
            <p>
                Welcome! Let's set up your account
            </p>

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email"
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-valid={validateEmail(email)}
                required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type={passwordFocused ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                data-valid={password?.length >= 6}
                className={styles.passwordInput}
                required />
            <p className={styles.passwordHint}>
                Use at least 6 characters
            </p>
            <div data-error={error} className={styles.errorRow}>
                {errorText && errorText}
            </div>
            <button className={`primary ${styles.signUpButton}`} onClick={e => handleSignup(e)}>
                {
                    loading && <ClipLoader speedMultiplier={1.5} size={28} color={"#fff"} />
                }
                {
                    !loading && <span>Sign up</span>
                }
            </button>
            <div className={styles.registerRow}>
                <span>Already have an account?</span>
                <button onClick={e => handleLogin(e)} className="secondary">
                    Log in
                </button>
            </div>


        </form>
    )
}