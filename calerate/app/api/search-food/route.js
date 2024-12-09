import { NextResponse } from "next/server";


const desiredResults = 12;

export async function GET(req) {
  console.log('search-food GET run');
  const {query: rawQuery} = await req.json();
  const query = rawQuery.trim();
  console.log('query:', query);
  if (!query) {
    return new NextResponse(
      JSON.stringify({ error: "No query provided" }),
      { status: 400 }
    );
  }

  const [foundationFoods, legacyFoods, surveyFoods, brandedFoods] = await Promise.all([
    fetchFoodsByType(query, "Foundation"),
    fetchFoodsByType(query, "SR Legacy"),
    fetchFoodsByType(query, "Survey (FNDDS)"),
    fetchFoodsByType(query, "Branded"),
  ]);

  let allResults = [
    ...foundationFoods,
    ...legacyFoods,
    ...surveyFoods,
    ...brandedFoods,
  ];
  allResults = allResults.slice(0, desiredResults);

  return new NextResponse(JSON.stringify(allResults), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function fetchFoodsByType(query, dataType) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`;
  const strictQuery = query.split(' ').map(word => `+${word}`).join(' ');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: strictQuery,
        pageSize: desiredResults,
        pageNumber: 1,
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
        dataType: [dataType],
        requireAllWords: true
      }),
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await response.json();
    return data.foods;
  } catch (error) {
    console.error(`Error fetching ${dataType} foods:`, error);
    return [];
  }
}
