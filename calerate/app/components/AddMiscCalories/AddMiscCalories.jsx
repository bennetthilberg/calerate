'use client';
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import styles from "./AddMiscCalories.module.scss";

export default function AddMiscCalories() {
    const [calories, setCalories] = useState('');
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setCalories('');
            setAdding(false);
            setSuccess(false);
        }
    },[open]);

    async function handleAdd(e){
        e.preventDefault();
        setAdding(true);
        const caloriesNum = Number(calories);
        console.log('calories:', calories);
        if (isNaN(caloriesNum)) {
            console.error('Invalid calories value');
            setAdding(false);
            return;
        }

        const res = await fetch('/api/add-misc-calories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ calories: caloriesNum }),
        })
        console.log('res:', res);
        if(res.ok){
            router.refresh();
            setAdding(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(true);
                setOpen(false);
            }, 800);
        }
        else{
            console.error('Error adding misc. calories');
            setAdding(false);
        }

    }

    return (
        <Dialog.Root open={open}
            onOpenChange={() => setOpen(!open)}
            onCloseAutoFocus={e => e.preventDefault()}
        >
            <Dialog.Trigger asChild>
                <button className={styles.triggerButton}>
                    <span>
                    Add Misc. Calories
                    </span>
                    <PlusIcon />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay" />
                <Dialog.Content className={`dialogContent ${styles.content}`} aria-describedby={undefined}>
                    <VisuallyHidden>
                        <Dialog.Title>Add Misc. Calories</Dialog.Title>
                    </VisuallyHidden>
                    <Dialog.Close asChild>
                        <button className='dialogCloseButton'>
                            <Cross1Icon />
                        </button>
                    </Dialog.Close>
                    <form className={styles.entryForm}
                        onSubmit={e => handleAdd(e)}
                    >
                        <h2>
                            Add Miscellaneous Calories
                        </h2>
                        <div className={styles.inputHolder}>
                            <input
                                type="tel"
                                maxLength={6}
                                id="calories"
                                value={calories}
                                onChange={e => setCalories(e.target.value)}
                            />
                            <span>
                                calories
                            </span>
                        </div>
                        <button type='submit'>
                            {
                                adding && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="blue" size={21.25} />
                            }
                            {
                                success && <CheckIcon color="green" className={styles.checkIcon} />
                            }
                            {
                                !adding && !success && 'Add'
                            }
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}