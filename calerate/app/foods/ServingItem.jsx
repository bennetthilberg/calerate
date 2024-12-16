import DeleteServing from "./DeleteServing";
import EditServing from "./EditServing";
import styles from "./ServingItem.module.scss";


export default function ServingItem({ serving }) {
    
    return (
        <div className={styles.servingItem}>
            <div className={styles.info}>
                <h3 className={styles.servingName}>{serving.name}</h3>
                <p className={styles.amount}>{serving.amount} {serving.amount_unit} - <span className={styles.caloriesText}>{Math.round(serving.calories)} calories</span></p>
            </div>
            <div className={styles.actions}>
                <EditServing serving={serving} />
                <DeleteServing serving={serving} />
            </div>
        </div>
    )
}
