import { createClient } from "@/utils/supabase/server";
import styles from "./Foods.module.scss";
import AddMiscCalories from "../components/AddMiscCalories/AddMiscCalories";
import ServingItem from "./ServingItem";


export const revalidate = 1;

async function getTodayAndServings() {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user;
    if (!user) return [null, null];
    // get today's day row
    const { data: daysData } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    if (daysData.length === 0 || !daysData) return [null, null];
    const today = daysData[0];
    // get today's servings
    const { data: servingsData } = await supabase
        .from('servings')
        .select('*')
        .eq('day_id', today.id);
    const servings = servingsData;

    return [servings, today];
}

export default async function Foods() {
    const [servings, today] = await getTodayAndServings() ?? [null, null];

    return (
        <div className={styles.foods}>
            <h1>Foods</h1>
            <h3>
                Total calories: {today?.total_calories ?? 0}
            </h3>
            <AddMiscCalories />
            <ul>
                {servings && servings.map(serving => (
                    <ServingItem key={serving.id} serving={serving} />
                ))}
            </ul>
        </div>
    )
}