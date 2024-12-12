'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // New import for navigation
import styles from "./SearchFood.module.scss";
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function SearchFood({ initialQuery }) {
    const [searchValue, setSearchValue] = useState("");
    const [isTyping, setIsTyping] = useState(initialQuery);
    const router = useRouter();
    const debounceTimeout = useRef(null); // To manage debouncing
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        // Prefetch the search results page on component mount
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
            if (value.trim()) {
                router.prefetch(`/search-results?query=${value}`);
                router.push(`/search-results?query=${value}`);
            }
        }, 300); // 300ms delay
    }

    function handleSubmit(e) {
        e.preventDefault();
        //setSearching(true);
        if (searchValue.trim()) {
            router.push(`/search-results?query=${searchValue}`); // Navigate to search results
        }
    }

    return (
        <form className={styles.searchFood} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search to add foods"
                value={searchValue}
                onChange={e => handleSearchChange(e)}
            />
            <button type="submit">
                <MagnifyingGlassIcon />
            </button>
        </form>
    );
}
