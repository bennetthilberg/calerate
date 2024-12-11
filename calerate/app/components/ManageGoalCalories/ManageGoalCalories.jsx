import { createClient } from "@/utils/supabase/server"
export default async function ManageGoalCalories() {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    // try to get today's day record
    try{
        const {data, error} = await supabase
            .from('days')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', new Date().toISOString().split('T')[0]);
        if(error) throw error;
        if(data[0]){
            
        }
        
    } catch{

    }

    return(
        <div>
            
        </div>
    )
}