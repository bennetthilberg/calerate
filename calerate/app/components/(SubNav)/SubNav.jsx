import styles from "./SubNav.module.scss";
import SearchFood from "./SearchFood";
import CaloriesDisplay from "./CaloriesDisplay";

export default function SubNav(){
    return (
        <div className={styles.subNav}>
            <CaloriesDisplay />
            <SearchFood />
        </div>
    )
}