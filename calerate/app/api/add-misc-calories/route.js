import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import getOrCreateToday from "@/utils/getOrCreateToday";

export async function POST(req) {
    const {calories} = await req.json();
    if (!calories) return new NextResponse({ error: 'No calories provided' }, { status: 400 });
    
    const supabase = await createClient();
    try{
        const userData = await supabase.auth.getUser();
        const user = userData?.data?.user;
        if(!user) throw new Error('No user found');

        const today = await getOrCreateToday();

        const { error: insertError } = await supabase
            .from('servings')
            .insert({
                day_id: today.id,
                fdc_id: 0,
                calories: calories,
                name: 'Miscellaneous Calories',
            })
        if(insertError) throw new Error('Error inserting serving: ' + insertError.message);

    } catch (error) {
        console.error('Error:', error);
        return new NextResponse({ error: 'Error logging misc. calories' }, { status: 500 });
    }
    return new NextResponse({}, { status: 200 });
}

async function createToday(){
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user;
    if (!user) return null;
    const { data: daysData } = await supabase
        .from('days')
        .insert([
            {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                total_calories: 0,
            }
        ]);
    return daysData[0];
}