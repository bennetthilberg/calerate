export const revalidate = 0;
import { createClient } from "@/utils/supabase/server";

export default async function CaloriesDisplay() {

    let totalCalories = 0;
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    let todayId;
    const { data, error } = await supabase
        .from('days')
        .select('total_calories, id')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    if (error) {
        console.error('Error fetching total calories:', error.message);
    }
    if (data[0]) {

        totalCalories = data[0].total_calories;
        todayId = data[0].id;
    }

    return (
        <div>
            {totalCalories} calories
        </div>
    )
}