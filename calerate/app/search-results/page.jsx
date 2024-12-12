import { Suspense } from "react";
import FoodSearchResult from "../components/FoodSearchResult/FoodSearchResult";
import styles from "./SearchResults.module.scss";
import searchFoodsByType from "@/utils/searchFoodsByType";

// todo: pagination or "load more" button
// todo: shimmer

export default async function SearchResults({ searchParams }) {
    const { query: rawQuery } = await searchParams || '';
    const query = rawQuery?.trim();
    
    if (!query) {
        return <p>No query provided</p>;
    }

    const [foundationFoods, legacyFoods, surveyFoods, brandedFoods] = await Promise.all([
        searchFoodsByType(query, "Foundation"),
        searchFoodsByType(query, "SR Legacy"),
        searchFoodsByType(query, "Survey (FNDDS)"),
        searchFoodsByType(query, "Branded"),
    ]);

    const foods = [
        ...foundationFoods,
        ...legacyFoods, 
        ...surveyFoods,
        ...brandedFoods,
    ].slice(0, 12);

    if (!foods || foods.length === 0) {
        return <p>No results found.</p>;
    }

    return (
        <div className={styles.searchResults}>
            <h1>Search Results for "{query}"</h1>
            <Suspense fallback={<h3>Loading...</h3>}>
                <ul>
                    {foods.map((food) => (
                        <FoodSearchResult food={food} key={food.fdcId} />
                    ))}
                </ul>
            </Suspense>
        </div>
    );
}