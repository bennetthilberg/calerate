import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    const { serving, newServingSizeValue, newCalories } = await req.json();
    console.log('serving:', serving);
    console.log('newServingSizeValue:', newServingSizeValue);
    console.log('newCalories:', newCalories);

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    try {
        const { data: updatedServingData, error: updatedServingError } = await supabase
            .from('servings')
            .update({
                amount: newServingSizeValue,
                calories: newCalories
            })
            .eq('id', serving.id)
            .select('*');
        if (updatedServingError) throw updatedServingError;
        console.log('updatedServingData:', updatedServingData);
        revalidatePath('/');
        return new NextResponse(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('error:', error);
        return NextResponse.error(error);
    }
}