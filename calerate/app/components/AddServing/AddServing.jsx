'use client';
import * as Dialog from "@radix-ui/react-dialog";
import styles from './AddServing.module.scss';
import { useEffect, useState } from "react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";

export default function AddServing({ food, titleCaseDescription }) {
    const [servingSizeValue, setServingSizeValue] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);
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
    async function handleLog(e) {
        e.preventDefault();
        const res = await fetch('/api/add-serving', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                food,
                servingSizeValue,
                calories: totalCalories,
                name: food.titleCaseDescription
                // we'll assume it's always grams, but could pass other units
                // here in the future
            })
        })


    }
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button>
                    Add
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                >
                    <form className={styles.content} onSubmit={e => handleLog(e)}>
                        <Dialog.Close asChild>
                            <button className={styles.closeButton}>
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className={styles.title}>
                            {food.titleCaseDescription}
                        </Dialog.Title>
                        <p>
                            {Math.round(totalCalories)} calories
                        </p>
                        <span className={styles.addInputHolder}>
                            <input type="text"
                                value={servingSizeValue}
                                autoFocus
                                onChange={e => setServingSizeValue(e.target.value)}
                                maxLength={6}
                            />
                            <span>g</span>
                        </span>
                        <button type="submit">
                            {
                                adding && <ClipLoader color="#fff" size={20} />
                            }
                            {
                                success && <CheckIcon />
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