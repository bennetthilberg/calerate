import { createClient } from "@/utils/supabase/server";
import styles from "./Foods.module.scss";
import createToday from "@/utils/createToday";
import AddMiscCalories from "../components/AddMiscCalories/AddMiscCalories";
import ServingItem from "./ServingItem";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import EditGoalCalories from "../components/ManageGoalCalories/EditGoalCalories";
import EditServing from "./EditServing";
import getOrCreateToday from "@/utils/getOrCreateToday";

export const revalidate = 1;

async function getTodayAndServings() {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user;
    if (!user) return [null, null];
    // get today&apos;s day row
    const { data: daysData } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    const today = await getOrCreateToday();
    
    // get today&apos;s servings
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
            <h1>Today&apos;s Foods</h1>
            <p className={styles.dateText}>
                <span>
                    {new Intl.DateTimeFormat('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    }).format(new Date())}
                </span>
                <Link href={'/food-history'} className={styles.prevDays}>
                    <span>
                        View previous days
                    </span>
                </Link>
            </p>

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
                            {`${today?.total_calories ?? 0} `}
                        </span>
                        consumed of
                        <span>
                            {` ${today.goal_calories} `}
                        </span>
                        goal
                    </p>
                </div>
                : 
                <div className={styles.caloriesLeftDisplay}>
                    <h2 className={styles.remaining}>
                        Set a goal to track calories
                    </h2>
                    <div className={styles.meterContainer}>
                        <div
                            className={styles.meterFill}
                            style={{
                                width: `0%`,
                                backgroundColor: `hsl(120, 70.30%, 44.90%)`
                            }}
                        />
                    </div>
                    <p className={styles.figuresText}>
                        <span>
                            {`${today?.total_calories ?? 0} `}
                        </span>
                        consumed of
                        <span>
                            {` ${today.goal_calories ?? 0} `}
                        </span>
                        goal
                    </p>
                </div>
            }
            <div className={styles.buttonsHolder}>
                <AddMiscCalories />
                <EditGoalCalories goalCalories={today?.goal_calories ?? null}
                    totalCalories={today?.total_calories ?? null} />
            </div>
            <ul className={styles.servings}>
                {servings && servings.map(serving => (
                    <ServingItem key={serving.id} serving={serving} />
                ))}
            </ul>
        </div>
    )
}