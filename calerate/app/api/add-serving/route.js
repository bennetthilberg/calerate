/*

1. check if the user already has a record for today in the days table
  if not, create a new record
2. add the serving to the servings table and associate it with the day_id
3. update the total calories for the day in the days table

*/
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { food, servingSizeValue, calories, name } = await req.json();
    //console.log('req', req);
    //console.log('food', food);
    //console.log('servingSizeValue', servingSizeValue);
    console.log('name:', name);
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    const currentDate = new Date().toISOString().split('T')[0];
    //console.log("user:", user);
    let today;
    try {
        const { data: daysData, error: daysError } = await supabase
            .from('days')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', currentDate);
        if (daysError) throw daysError;
        if (daysData.length === 0) {
            const { data: newDayData, error: newDayError } = await supabase
                .from('days')
                .insert({ user_id: user.id, date: currentDate })
                .select('*');
            if (newDayError) {
                throw newDayError;
            }
            today = newDayData[0];
        }
        else {
            today = daysData[0];
        }

        const { data: servingData, error: servingError } = await supabase
            .from('servings')
            .insert({
                day_id: today.id,
                fdc_id: food.fdcId,
                amount: servingSizeValue,
                name: name,
                //amount_unit: food.servingSizeUnit
                amount_unit: 'g',
                calories: calories.toFixed(1),
                calories_per_100g: food.calsPer100g
            })
            .select('*');
        if (servingError) throw servingError;


        // update today's total calories
        /*
        const currentCalories = today.total_calories ?? 0;
        const { data: updatedDayData, error: updatedDayError } = await supabase
            .from('days')
            .update({
                total_calories: (currentCalories + calories).toFixed(1)
            })
            .eq('id', today.id)
            .select('*');
        if (updatedDayError) throw updatedDayError;
        */
       // this is handled by the trigger in the database now


    } catch (error) {
        console.error('Error logging food:', error);
        return new NextResponse(JSON.stringify({}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    revalidatePath('/'); // todo make this work. calorie display isnt actually updating.
    return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}