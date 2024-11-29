import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req){
    const {serving} = await req.json();
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user ?? null;
    if(!user){
        return new NextResponse.json({error: 'Not authenticated'}, {status: 401});
    }
    if(!serving){
        return new NextResponse.json({error: 'No serving provided'}, {status: 400});
    }
    try {

        const {data, error} = await supabase
            .from('servings')
            .select('id, day_id')
            .eq('id', serving.id)
            .single();
        if(error) throw error;
        const {id, day_id} = data;

        const {data: todayData, error: todayError} = await supabase
            .from('days')
            .select('user_id')
            .eq('id', day_id)
            .single();
        if(todayError) throw todayError;
        if(todayData.user_id !== user.id){
            return new NextResponse.json({error: 'Unauthorized'}, {status: 403});
        }

        const {error: deleteError} = await supabase
            .from('servings')
            .delete()
            .eq('id', id);
        if(deleteError) throw deleteError;
    } catch(error) {
        console.error('error:', error);
        return NextResponse.error(error);
    }
    console.log('Serving deleted');
    return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}