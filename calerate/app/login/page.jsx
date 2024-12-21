'use client';
import { login, signup } from './actions'
import Link from 'next/link'
import { useState } from 'react';
import styles from "./LoginPage.module.scss"
import { ClipLoader } from 'react-spinners';
import validateEmail from '@/utils/validateEmail';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  function handleLogin(e){
    e.preventDefault();
    setLoading(true);
    if(!validateEmail(email)){
      setError(true);
      setErrorText('Please enter a valid email');
      setLoading(false);
      return;
    }
    if(!password || password?.length < 6){
      setError(true);
      setErrorText('Please enter a valid password');
      setLoading(false);
      return;
    }
    setError(false);
    setErrorText(null);
    
    login(email, password).then(res => {
      if(res.ok){
        router.push('/foods')
      }
    }).catch(err => {
      console.error(err);
      setError(true);
      setErrorText(err.message);
      setLoading(false);
    })
  }
  function handleSignup(e){
    e.preventDefault();
    router.push('/signup')
  }
  return (
    <form className={styles.loginForm}>
      <h2>Log in to Calerate</h2>
      <p>Welcome back! Log in to get started</p>
      
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
        required />
      <div data-error={error} className={styles.errorRow}>
        {errorText && errorText}
      </div>
      <button className={`primary ${styles.loginButton}`} onClick={e => handleLogin(e)}>
      {
            loading && <ClipLoader speedMultiplier={1.5} size={28} color={"#fff"} />
          }
          {
            !loading && <span>Log in</span>
          }
      </button>
      <div className={styles.registerRow}>
        <span>Don't have an account?</span>
        <button onClick={e => handleSignup(e)} className="secondary">
          Sign up
        </button>
      </div>
      
      
    </form>
  )
}
