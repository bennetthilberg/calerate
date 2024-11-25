export default function SearchResults({searchParams}) {
    return(
        <div>
            <h1>Search Results</h1>
            <p>Query: {searchParams.query}</p>
        </div>
    )
}