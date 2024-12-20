'use client';
import DeleteServing from "./DeleteServing";
import EditServing from "./EditServing";
import styles from "./ServingItem.module.scss";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
//import styles from "./EditServing.module.scss";
import { useRouter } from "next/navigation";


export default function ServingItem({ serving }) {
    const [servingSizeValue, setServingSizeValue] = useState(serving.amount);
    const [totalCalories, setTotalCalories] = useState(serving.calories);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
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
        if (res.ok) {
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
    async function handleDelete(e) {
        e.preventDefault();
        console.log('Delete serving');
        setDeleting(true);
        
        const res = await fetch('/api/delete-serving', {
            method: 'DELETE',
            body: JSON.stringify({ serving }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.ok) {
            setDeleting(false);
            setDeleteSuccess(true);
            //router.refresh();
            setTimeout(() => {
                setDeleteSuccess(false);
                setOpen(false);
            }, 600);
        } else {
            console.error('Error deleting serving. Res:', res);
            setDeleting(false);
        }
    }
    return (
        <Dialog.Root
            open={open}
            onOpenChange={() => setOpen(!open)}
            onCloseAutoFocus={e => e.preventDefault()}
        >
            <Dialog.Trigger asChild>
                <div className={styles.servingItem}>
                    <h3 className={styles.servingName}>{serving.name}</h3>
                    <p className={styles.amount}>{serving.amount}{serving.amount_unit} - <span className={styles.caloriesText}>{Math.round(serving.calories)} calories</span></p>
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={'overlay'} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                >
                    <form className={`${styles.dialogContent} dialogContent`} onSubmit={e => handleEdit(e)}>
                        <Dialog.Close asChild>
                            <button className="dialogCloseButton">
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className={styles.title}>
                            {serving.name}
                        </Dialog.Title>
                        <p className={styles.calories}>
                            <span>{Math.round(totalCalories)}</span> calories

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
                        <div className={styles.actions}>
                            <span className={styles.delete} onClick={(e) => handleDelete(e)}>
                                {
                                    !deleting && !deleteSuccess && <img src="/trash-icon-red.svg" />
                                }
                                {
                                    deleting && <ClipLoader className={styles.deleteSpinner} speedMultiplier={1.4} color="hsl(2, 70%, 48%)" size={20} />
                                }
                                {
                                    deleteSuccess && <CheckIcon color="green" className={styles.deleteCheckIcon} />
                                }
                                
                                <span className={styles.deleteText}>Delete</span>
                            </span>
                            <button
                                className='primary'
                                type="submit"
                            >
                                {
                                    editing && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="white" size={24} />
                                }
                                {
                                    success && <CheckIcon color="white" className={styles.checkIcon} />
                                }
                                {
                                    !editing && !success && <><img className={styles.saveIcon} src="/save-icon.svg" /><span className={styles.saveText}>Save</span></>
                                }
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
