const desiredResults = 12;

export default async function searchFoodsByType(query, dataType) {
  console.log('searching dataType:', dataType);
  const apiKey = process.env.DATA_GOV_API_KEY;
  const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`;
  const condensedQuery = removeFunctionWords(query);
  //const strictCondensedQuery = condensedQuery.split(' ').map(word => `+${word}`).join(' ');
  const strictCondensedQuery = condensedQuery.split(' ').map(word => `*${word}*`).join(' ');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        //query: strictCondensedQuery,
        query: condensedQuery,
        //query: query,
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
    const filteredFoods = data.foods.filter(hasCalories);
    console.log(`${dataType} search returned ${filteredFoods.length} valid results`);
    return filteredFoods;
  } catch (error) {
    console.error(`Error fetching ${dataType} foods:`, error);
    return [];
  }
}

function hasCalories(food) {
  return food.foodNutrients.some(nutrient => nutrient.nutrientId === 1008);
}

function removeFunctionWords(str) {
  const functionWords = [
    "and", "&",
    "on", "in", "with", "without",
    "of", "the", "a", "an",
    "to", "for", "from",
    "style", "type",
    "w/", "or", "plus",
    "per", "by", "'n",
    "as", "is", "served",
    "w", "about", "made"
  ];
  return str.split(' ').filter(word => !functionWords.includes(word)).join(' ');
}