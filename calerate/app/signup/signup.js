'use server';
export default async function signup(email, password) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    /*
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
      */
    const data = {
        email: email,
        password: password
    }
  
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
      redirect('/error')
    }
    
    revalidatePath('/', 'layout')
    redirect('/')
  }