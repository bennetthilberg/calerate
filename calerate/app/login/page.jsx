'use client';
import { login, signup } from './actions'
import Link from 'next/link'

import styles from "./LoginPage.module.scss"



export default function LoginPage() {
  
  
  return (
    <form className={styles.loginForm}>
      <h2>Welcome back</h2>
      <p>Sign in to your Calerate account</p>
      
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email"
        autoComplete='email'
        required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password"
        autoComplete="current-password"
        required />
      <button className={styles.login} formAction={login}>Log in</button>
      <p>
        Don't have an account? <Link prefetch={true} href="/signup">Sign up</Link>
      </p>
      {/* 
      <p>
        Don't have an account?
      </p>
      <button className={styles.signup} formAction={signup}>Sign up</button>
        */}
    </form>
  )
}