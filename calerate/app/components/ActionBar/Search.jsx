'use client';
import SearchFood from "../(SubNav)/SearchFood";
import { PlusIcon } from "@radix-ui/react-icons";
import styles from "./Search.module.scss"
import { useState, useRef, useEffect, useTransition } from "react";
export default function Search() {
    const [open, setOpen] = useState(false);
    return(
        <>
            <SearchFood open={open}/>
            <button className="secondary">
                <PlusIcon />
            </button>
        </>
    )
}