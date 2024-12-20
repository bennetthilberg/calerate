'use client';
import * as Dialog from "@radix-ui/react-dialog";
import styles from './ResultAddServing.module.scss';
import { useEffect, useState } from "react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
//import { addServingAction } from "./actions";

export default function ResultAddServing({ food }) {
    const [servingSizeValue, setServingSizeValue] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [logOk, setLogOk] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (food && servingSizeValue) {
            const calsPer100g = food.calsPer100g;
            const totalCals = (calsPer100g / 100) * Number(servingSizeValue);
            setTotalCalories(totalCals);
        }
        if (servingSizeValue === '') {
            setTotalCalories(0);
        }
    }, [servingSizeValue]);
    useEffect(() => {
        if (!isNaN(servingSizeValue) && servingSizeValue > 0) {
            setLogOk(true);
        }
        else {
            setLogOk(false);
        }
    }, [servingSizeValue])
    function handleServingSizeChange(e) {
        if (/[^0-9.]/.test(e.target.value)) {
            return;
        }
        setServingSizeValue(e.target.value);
    }
    async function handleLog(e) {
        e.preventDefault();
        if (!logOk) return;
        setAdding(true);
        const res = await fetch('/api/add-serving', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                food,
                servingSizeValue,
                calories: totalCalories,
                name: food.foodTitle,
                calsPer100g: food.calsPer100g
                // we'll assume it's always grams, but could pass other units
                // here in the future
            })
        })
        if (res.ok) {
            router.refresh();
            setAdding(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
            }, 600);
        } else {
            console.error('Failed to log serving');
            setAdding(false);
        }

    }
    return (
        <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
            <Dialog.Trigger asChild>
                <div className={styles.foodSearchResult}>
                    <h3>{food.foodTitle}</h3>

                    <div>
                        <span className={styles.calsText}>{food.calsPer100g} cals</span>
                        <span>per 100g</span>
                    </div>
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={`${styles.overlay} overlay`} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                    className="dialogContent"
                >
                    <form className={styles.content} onSubmit={e => handleLog(e)}>
                        <Dialog.Close asChild>
                            <button className={styles.closeButton}>
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className={styles.title}>
                            {food.foodTitle}
                        </Dialog.Title>
                        <p>
                            {Math.round(totalCalories)} calories
                        </p>
                        <span className={styles.addInputHolder}>
                            <input type="tel"
                                value={servingSizeValue}
                                autoFocus
                                onChange={e => handleServingSizeChange(e)}
                                maxLength={6}
                            />
                            <span>g</span>
                        </span>
                        <button
                            data-available={logOk}
                            className={styles.logButton}
                            type="submit">
                            {
                                adding && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="blue" size={21.25} />
                            }
                            {
                                success && <CheckIcon color="green" className={styles.checkIcon} />
                            }
                            {
                                !adding && !success && 'Log'
                            }
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}