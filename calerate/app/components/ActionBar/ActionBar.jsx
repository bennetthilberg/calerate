import getOrCreateToday from "@/utils/getOrCreateToday"
import ManageGoalCaloriesActionBar from "../ManageGoalCalories/ManageGoalCaloriesActionBar"
import styles from "./ActionBar.module.scss"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link";
import Search from "./Search";

export default async function ActionBar() {
    const today = await getOrCreateToday();
    const goalCalories = today?.goal_calories ?? null;
    return (
        <div className={styles.actionBar}>
            <ManageGoalCaloriesActionBar goalCalories={goalCalories} />
            <Link href='/search-results' prefetch={true} className={styles.plus}>
                <PlusIcon />
            </Link>
            <Link className={styles.log} href="/foods" prefetch={true}>
                <img src="/log-icon.svg" />
                <span>View Log</span>
            </Link>
        </div>
    )
}