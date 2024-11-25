import styles from "./SubNav.module.scss";
import SearchFood from "./SearchFood";

export default function SubNav(){
    return (
        <div className={styles.subNav}>
            <h2>SubNav</h2>
            <SearchFood />
        </div>
    )
}