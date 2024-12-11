import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function POST(req) {
    const { newDailyCalorieGoal } = await req.json();
    const supabase = await createClient();
    const user = await getUser(supabase);
    if (!user) {
        return new NextResponse(JSON.stringify({}), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const currentDate = new Date().toISOString().split('T')[0];

    let today = await getOrCreateDay(supabase, user.id, currentDate);

    const updatedDayData = await updateDay(supabase, today.id, newDailyCalorieGoal);
    if (updatedDayData.error) throw updatedDayData.error;
    return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

async function getUser(supabase) {
    const { data: userData } = await supabase.auth.getUser();
    return userData?.user;
}

async function getOrCreateDay(supabase, userId, currentDate) {
    const { data: daysData, error: daysError } = await supabase
        .from('days')
        .select('id')
        .eq('user_id', userId)
        .eq('date', currentDate);
    if (daysError) throw daysError;
    if (daysData.length === 0) {
        const { data: newDayData, error: newDayError } = await supabase
            .from('days')
            .insert({ user_id: userId, date: currentDate })
            .select('*');
        if (newDayError) throw newDayError;
        return newDayData[0];
    }
    else {
        return daysData[0];
    }
}

async function updateDay(supabase, dayId, newDailyCalorieGoal) {
    return await supabase
        .from('days')
        .update({
            goal_calories: newDailyCalorieGoal
        })
        .eq('id', dayId);
}