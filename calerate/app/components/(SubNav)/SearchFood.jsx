'use client';
import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // New import for navigation
import styles from "./SearchFood.module.scss";
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ClipLoader } from "react-spinners";

export default function SearchFood({ initialQuery }) {
    const [searchValue, setSearchValue] = useState("");
    const [isTyping, setIsTyping] = useState(initialQuery);
    const router = useRouter();
    const debounceTimeout = useRef(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        router.prefetch('/search-results');
    }, [router]);

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchValue(value);

        // Clear any existing timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set new timeout
        debounceTimeout.current = setTimeout(() => {
            startTransition(() => {
                if (value.trim()) {
                    router.prefetch(`/search-results?query=${value}`);
                    router.push(`/search-results?query=${value}`);
                }
            })
        }, 100); // 300ms delay
    }

    function handleSubmit(e) {
        e.preventDefault();
        //setSearching(true);
        startTransition(() => {
            searchValue.trim() && router.push(`/search-results?query=${searchValue}`);
        });
    }

    return (
        <form className={styles.searchFood} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search to add foods"
                value={searchValue}
                onChange={e => handleSearchChange(e)}
                onFocus={e => e.target.select()}
            />
            <button type="submit">
                {
                    isPending ?
                        <ClipLoader color="#fff" size={20} speedMultiplier={1.75} /> :
                        <MagnifyingGlassIcon />
                }

            </button>
        </form>
    );
}
