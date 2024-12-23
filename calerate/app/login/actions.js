'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import validateEmail from '@/utils/validateEmail'

import { createClient } from '@/utils/supabase/server'

export async function login(email, password) {
  if (!validateEmail(email)) {
    throw new Error('Invalid email')
  }
  if(!password || password?.length < 6){
    throw new Error('Invalid password')
  }
  const supabase = await createClient()


  const { error } = await supabase.auth.signInWithPassword({email, password})

  if (error) {
    throw new Error(error.message)
  }

  return { ok: true }
}

export async function signup(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }
  
  revalidatePath('/', 'layout')
  redirect('/')
}