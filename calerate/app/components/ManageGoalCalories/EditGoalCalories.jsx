'use client';
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./ManageGoalCalories.module.scss";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Cross1Icon, CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function EditGoalCalories({ goalCalories, totalCalories }) {
    const [goal, setGoal] = useState(goalCalories ?? '');
    const [open, setOpen] = useState(false);
    const [setting, setSetting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [valid, setValid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (goal && goal > 0) setValid(true);
        else setValid(false);
    }, [goal]);

    function handleGoalChange(e) {
        if (/[^0-9.]/.test(e.target.value)) {
            return;
        }
        setGoal(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!valid) return;
        setSetting(true);
        const response = await fetch('/api/set-daily-calorie-goal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newDailyCalorieGoal: Number(goal) })
        });
        if (response.ok) {
            router.refresh();
            setSetting(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
            }, 600);
        }
        else {
            console.error('Error setting goal');
            setSetting(false);
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={setOpen}
        >
            <Dialog.Trigger asChild>
                <button
                    className={`primary ${styles.editGoalButton}`}
                >
                    <Pencil1Icon/>
                    <span>Edit goal</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay" />
                <Dialog.Content asChild>


                    <form className={`dialogContent ${styles.content}`} onSubmit={e => handleSubmit(e)}>
                        <Dialog.Close asChild>
                            <button className="dialogCloseButton">
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <VisuallyHidden.Root>
                            <Dialog.Description>Add or edit today&apos;s calore goal</Dialog.Description>
                        </VisuallyHidden.Root>
                        <Dialog.Title>{goalCalories ? "Edit" : "Select"} your calorie goal</Dialog.Title>
                        <label>Today&apos;s goal:</label>
                        <div className={styles.goalInputHolder}>
                            <input type="tel" maxLength={4} autoFocus value={goal} onChange={e => handleGoalChange(e)} />
                            <span>calories</span>
                        </div>
                        <button className={`primary ${styles.submit}`} type="submit">
                            {
                                setting && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="white" size={24} />
                            }
                            {
                                success && <CheckIcon color="white" className={styles.checkIcon} />
                            }
                            {
                                !setting && !success && <><img className={styles.saveIcon} src="/save-icon.svg" /><span className={styles.saveText}>Set Goal</span></>
                            }
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}