import { createClient } from "@/utils/supabase/server";
import styles from "./Foods.module.scss";
import AddMiscCalories from "../components/AddMiscCalories/AddMiscCalories";
import ServingItem from "./ServingItem";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";

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
            <h1>Today's Foods</h1>
            <p className={styles.dateText}>
                {new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                }).format(new Date())}
            </p>
            <Link href={'/food-history'} className={styles.prevDays}>
                <span>
                    View previous days
                </span>
                <ChevronRightIcon />
            </Link>
            {today?.goal_calories ?
                <div className={styles.caloriesLeftDisplay}>
                    <h2 className={styles.remaining}>
                        <span>{today.goal_calories - today.total_calories}</span> calories remaining
                    </h2>
                    <div className={styles.meterContainer}>
                        <div
                            className={styles.meterFill}
                            style={{
                                width: `${Math.min((today.total_calories / today.goal_calories) * 100, 100)}%`,
                                backgroundColor: `hsl(${Math.max(120 * (1 - today.total_calories / today.goal_calories), 0)}, 70%, 45%)`
                            }}
                        />
                    </div>
                    <p className={styles.figuresText}>
                        <span>
                            {`${today.total_calories} `} 
                        </span>
                        consumed of
                        <span>
                            {` ${today.goal_calories} `}
                        </span>
                        goal
                    </p>
                </div>
                : <h2>{today.total_calories} consumed</h2>
            }

            <AddMiscCalories />
            <ul>
                {servings && servings.map(serving => (
                    <ServingItem key={serving.id} serving={serving} />
                ))}
            </ul>
        </div>
    )
}