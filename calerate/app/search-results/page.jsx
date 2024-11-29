import { Suspense } from "react";
import FoodSearchResult from "../components/FoodSearchResult/FoodSearchResult";
import styles from "./SearchResults.module.scss";

async function fetchSearchResults(query) {
    const apiKey = process.env.DATA_GOV_API_KEY;
    const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query,
            pageSize: 25,
            sortBy: 'dataType.keyword',
            sortOrder: 'asc',
        }),
        next: { revalidate: 60 }, 
    });

    if (!response.ok) {
        throw new Error('Failed to fetch search results');
    }

    return response.json();
}


export default async function SearchResults({ searchParams }) {
    const query = searchParams.query || '';

    // Fetch search results at the top level
    const searchResults = await fetchSearchResults(query);

    if (!searchResults.foods || searchResults.foods.length === 0) {
        return <p>No results found.</p>;
    }
    return (
        <>
            <div className={styles.searchResults}>
                <h1>Search Results for "{query}"</h1>
                <Suspense fallback={<h3>Loading</h3>}>
                    <ul>
                        {searchResults.foods.map((food) => (
                            <FoodSearchResult food={food} key={food.fdcId} />
                        ))}
                    </ul>
                </Suspense>
            </div >
        </>
    );


}