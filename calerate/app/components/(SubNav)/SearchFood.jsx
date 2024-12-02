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
        setSearching(false);
    }, [])


    function handleSearchChange(e) {

        const value = e.target.value;
        setSearchValue(value);
        router.prefetch(`/search-results?query=${value}`); // Prefetch the results page
        router.push(`/search-results?query=${value}`); // Navigate to search results
        // Prefetch search results with debouncing
        /*
        setIsTyping(true);
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (value.trim()) {
                router.prefetch(`/search-results?query=${value}`); // Prefetch the results page
            }
            setIsTyping(false);
        }, 10); // Debounce delay
        */
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
