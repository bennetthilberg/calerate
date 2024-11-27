'use client';
import { useState,useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import styles from "./EditServing.module.scss";

export default function EditServing({ serving }) {
    const [servingSizeValue, setServingSizeValue] = useState(serving.amount);
    const [totalCalories, setTotalCalories] = useState(serving.calories);
    useEffect(() => {
        if (serving && servingSizeValue) {
            const calsPer100g = serving.calories_per_100g;
            const totalCals = (calsPer100g / 100) * Number(servingSizeValue);
            setTotalCalories(totalCals);
        }
        if (servingSizeValue === '') {
            setTotalCalories(0);
        }
    }, [servingSizeValue]);
    function handleServingSizeChange(e) {
        if (/[^0-9.]/.test(e.target.value)) {
            return;
        }
        setServingSizeValue(e.target.value);
    }
    async function handleEdit(e) {
        e.preventDefault();
        console.log(servingSizeValue);
        // todo validate
        const res = await fetch('/api/edit-serving', {
            method: 'PATCH',
            body: JSON.stringify({
                serving: serving,
                newServingSizeValue: servingSizeValue,
                newCalories: totalCalories
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(res.ok){
            console.log('success');
        } else {
            console.error('Error updating serving. Res:', res);
        }
    }
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button>
                    Edit
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                >
                    <form className={styles.content} onSubmit={e => handleEdit(e)}>
                        <Dialog.Close asChild>
                            <button className={styles.closeButton}>
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className={styles.title}>
                            {serving.name}
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
                            className={styles.logButton}
                            type="submit"
                        >
                            Save
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}