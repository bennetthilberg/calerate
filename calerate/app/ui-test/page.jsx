import styles from "./uiTest.module.scss";

export default function UiTest() {
    return (
        <div className={styles.uiTest}>
            <h1>UI Test</h1>
            <p>Calerate is a calorie tracking app. The quick brown fox jumps over the lazy dog</p>
            <h2>Buttons</h2>
            <div className={styles.buttons}>
                <button className="primary">
                    <span>
                        Primary
                    </span>
                </button>
                <button className="secondary">
                    Secondary
                </button>
                <button className="danger">
                    Danger
                </button>
            </div>
            <h2>Inputs</h2>
            <input type="text" placeholder="Placeholder..." />
            <h2>Colors</h2>
            <h3>Primary</h3>
            <div className={styles.primaries}>
                <div className={styles.p1}>P1</div>
                <div className={styles.p2}>P2</div>
                <div className={styles.p3}>P3</div>
                <div className={styles.p4}>P4</div>
                <div className={styles.p5}>P5</div>
                <div className={styles.p6}>P6</div>
                <div className={styles.p7}>P7</div>
                <div className={styles.p8}>P8</div>
                <div className={styles.p9}>P9</div>
            </div>
            <p>
                askdfsd jabfkasdf dsfk asdfjh sdaf
            </p>
            <p>
                asjodfnsda fjasdfoj sdfosd afojasnfojsd afo
            </p>
            <p>
                askdfsd jabfkasdf dsfk asdfjh sdaf
            </p>
            <p>
                asjodfnsda fjasdfoj sdfosd afojasnfojsd afo
            </p>
        </div>
    )
}