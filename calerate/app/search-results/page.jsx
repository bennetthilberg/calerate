import { Suspense } from "react";
import FoodSearchResult from "../components/FoodSearchResult/FoodSearchResult";
import styles from "./SearchResults.module.scss";
import searchFoodsByType from "@/utils/searchFoodsByType";
import SearchFood from "../components/(SubNav)/SearchFood";
import Search from "../components/ActionBar/Search";

// todo: pagination or "load more" button
// todo: shimmer

export default async function SearchResults({ searchParams }) {
    const { query: rawQuery } = await searchParams || '';
    const query = rawQuery?.trim();



    let foods;
    let foundationFoods;
    let legacyFoods;
    let surveyFoods;
    let brandedFoods;
    if (query) {
        [foundationFoods, legacyFoods, surveyFoods, brandedFoods] = await Promise.all([
            searchFoodsByType(query, "Foundation"),
            searchFoodsByType(query, "SR Legacy"),
            searchFoodsByType(query, "Survey (FNDDS)"),
            searchFoodsByType(query, "Branded"),
        ]);
        foods = [
            ...foundationFoods,
            ...legacyFoods,
            ...surveyFoods,
            ...brandedFoods,
        ].slice(0, 12);
    }

    
    return (
        <div className={styles.searchResults}>
            <SearchFood />
            {query && foods &&
                <>
                    <Suspense fallback={<h3>Loading...</h3>}>
                        <ul>
                            {foods.map((food) => (
                                <FoodSearchResult food={food} key={food.fdcId} />
                            ))}
                        </ul>
                    </Suspense>
                </>
            }
        </div>
    );
}