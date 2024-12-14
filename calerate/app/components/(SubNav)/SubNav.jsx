import styles from "./SubNav.module.scss";
import SearchFood from "./SearchFood";
import CaloriesDisplay from "./CaloriesDisplay";
import Link from "next/link";

export default function SubNav() {
    return (
        <div className={styles.subNav}>
            <CaloriesDisplay />
            <SearchFood />
            <Link href="/foods" prefetch={true} className={styles.todayLink}>
                <span>
                    Today's
                </span>
                <span>
                    Foods
                </span>
            </Link>
        </div>
    )
}