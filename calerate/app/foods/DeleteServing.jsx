'use client';
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Cross1Icon, CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";
import styles from "./DeleteServing.module.scss";
import { useRouter } from "next/navigation";

export default function DeleteServing({ serving }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [success, setSuccess] = useState(false);

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
            setSuccess(true);
            router.refresh();
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
            }, 600);
        } else {
            console.error('Error deleting serving. Res:', res);
            setEditing(false);
        }
    }
    useEffect(() => {
        console.log({ serving });
    }, [])
    return (
        <Dialog.Root
            open={open}
            onOpenChange={() => setOpen(!open)}
        >
            <Dialog.Trigger asChild>
                <button className={styles.triggerButton}>
                    <span>Delete</span> <TrashIcon width={'16px'} height={'16px'}/>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={'overlay'} />
                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                    className="dialogContent"
                >
                    <form
                        className={styles.content}
                        onSubmit={e => handleDelete(e)}
                    >
                        <Dialog.Close asChild>
                            <button className={styles.closeButton}>
                                <Cross1Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className={styles.title}>
                            Delete {serving.name}
                        </Dialog.Title>
                        <p>
                            Are you sure you want to delete {serving.amount}{serving.amount_unit} of {serving.name}? ({Math.round(serving.calories)} calories)
                        </p>
                        <button className={styles.deleteButton} type="submit">
                            {
                                deleting && <ClipLoader className={styles.spinner} speedMultiplier={1.4} color="blue" size={21.25} />
                            }
                            {
                                success && <CheckIcon color="green" className={styles.checkIcon} />
                            }
                            {
                                !deleting && !success && 'Delete'
                            }
                        </button>
                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}