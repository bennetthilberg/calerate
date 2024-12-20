import { createClient } from "./supabase/server";

export default async function createToday(){
    console.log('creating today...')
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user;
    if (!user) return null;
    const { data: daysData, error: daysError } = await supabase
        .from('days')
        .insert([
            {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                total_calories: 0,
            }
        ]);
    if(daysError){
        console.error('Error creating today:', daysError);
        return null;
    }
    if(!daysData || !daysData?.length > 0){
        console.error('Error creating today: no data returned');
        console.log('daysData:', daysData);
        return null;
    }
    return daysData[0];
}