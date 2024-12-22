'use client';

import { useEffect, useState } from "react";
import styles from './PwaReminder.module.scss';
import * as Tabs from "@radix-ui/react-tabs";
import { IoShareOutline } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";

export default function PwaReminder() {
    const [standalone, setStandalone] = useState(true);
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setStandalone(true);
        } else {
            setStandalone(false);
        }
    },[]);
    return (
        <div className="pwaReminder">
            <div className="desktop">
                <p>
                    Calerate is made for mobile. Try it on your phone!
                </p>
            </div>
            {!standalone &&
                <div className={`${styles.mobileInstructions} pwaInstructions`}>
                    <div className={styles.introBox}>
                        <h3>
                            Welcome to Calerate!
                        </h3>
                        <p>
                            Add Calerate to your home screen to use it like an app. Here&apos;s how:
                        </p>
                    </div>
                    <Tabs.Root className={styles.tabsBox} defaultValue="iOS">
                        <Tabs.List className={styles.tabsList}>
                            <Tabs.Trigger className={styles.trigger} value="iOS">
                                iOS (Safari)
                            </Tabs.Trigger>
                            <Tabs.Trigger className={styles.trigger} value="android">
                                Android (Chrome)
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content
                            className={`${styles.content} ${styles.iOSSteps}`}
                            value="iOS"
                        >
                            <p>
                                <span>
                                    1. Tap the share icon
                                </span>
                                <IoShareOutline className={styles.shareIcon} />
                                <span>
                                    at the bottom of the screen.
                                </span>
                            </p>
                            <p>
                                <span>
                                    2. Scroll down and tap&nbsp;
                                </span>
                                <span className={styles.addToHomeSpan}>
                                    Add to Home Screen
                                    <img src="/add-square-icon.svg" className={styles.addSquareIcon} />
                                </span>
                                <span>.</span>
                            </p>
                            <p>
                                <span>
                                    3. Tap <span className={styles.addSpan}>Add</span> in the top right corner.
                                </span>
                            </p>
                        </Tabs.Content>
                        <Tabs.Content
                            className={`${styles.content} ${styles.androidSteps}`}
                            value="android"
                        >
                            <p>
                               <span>1. To the right of the address bar, tap More</span>
                                <MdMoreVert className={styles.moreIcon} />
                                <span>.</span>
                            </p>
                            <p>
                                <span>2. Tap </span>
                                <span className={styles.chromeBold}>
                                    Add to home screen
                                </span>
                                <span> then </span>
                                <span className={styles.chromeBold}>
                                    Create shortcut
                                </span>
                                <span>.</span>
                            </p>
                            <p>
                                <span>3. Tap </span>
                                <span className={styles.chromeBold}>
                                    Add
                                </span>
                                <span>.</span>
                            </p>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            }
        </div>
    )
}