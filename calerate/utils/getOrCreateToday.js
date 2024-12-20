import createToday from "./createToday";
import { createClient } from "./supabase/server";

export default async function getOrCreateToday() {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    if (!user) return null;
    const { data: daysData, error: daysError } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    if (daysError) {
        console.error('Error getting today:', daysError);
        return null;
    }
    if (daysData.length > 0) {
        return daysData[0];
    }
    else{
        return await createToday();
    }
}