'use client';
import { useState,useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
import styles from "./EditServing.module.scss";
import { useRouter } from "next/navigation";

export default function EditServing({ serving }) {
    const [servingSizeValue, setServingSizeValue] = useState(serving.amount);
    const [totalCalories, setTotalCalories] = useState(serving.calories);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
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
        setEditing(true);

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
            setEditing(false);
            setSuccess(true);
            router.refresh();
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
            }, 600);
        } else {
            console.error('Error updating serving. Res:', res);
            setEditing(false);
        }
    }
    return (
        <Dialog.Root
            open={open}
            onOpenChange={() => setOpen(!open)}
            onCloseAutoFocus={e => e.preventDefault()}
        >
            <Dialog.Trigger asChild>
                <button>
                    Edit
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={'overlay'} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                    className="dialogContent"
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
                            {
                                editing && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="blue" size={21.25} />
                            }
                            {
                                success && <CheckIcon color="green" className={styles.checkIcon} />
                            }
                            {
                                !editing && !success && 'Save changes'
                            }
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}