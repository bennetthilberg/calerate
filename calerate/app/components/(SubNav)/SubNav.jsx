import styles from "./SubNav.module.scss";
import SearchFood from "./SearchFood";
import CaloriesDisplay from "./CaloriesDisplay";
import Link from "next/link";

export default function SubNav(){
    return (
        <div className={styles.subNav}>
            <CaloriesDisplay />
            <Link href="/foods" prefetch={true}>
                Today's Foods
            </Link>
            <SearchFood />
        </div>
    )
}