import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  const apiKey = process.env.DATA_GOV_API_KEY; // Replace with your USDA API key
  const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        query: query,
        pageSize: 25,
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
     })
  });

  const data = await response.json();

  return new NextResponse(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}