'use client';
import { login, signup } from './actions'
import Link from 'next/link'
import { useState } from 'react';
import styles from "./LoginPage.module.scss"



export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function handleLogin(){
    login(email, password).then(res => {
      if(res.ok){
        window.location.href = '/'
      }
    })
  }
  return (
    <form className={styles.loginForm}>
      <h2>Welcome back</h2>
      <p>Sign in to your Calerate account</p>
      
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email"
        autoComplete='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required />
      <button className={styles.login} formAction={() => handleLogin()}>Log in</button>
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