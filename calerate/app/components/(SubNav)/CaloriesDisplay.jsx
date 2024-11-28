//'use client';
export const revalidate = 0;

//import { useEffect, useState } from "react";
//import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";

export default async function CaloriesDisplay() {
    /*
    const [totalCalories, setTotalCalories] = useState(0);
    useEffect(() => {
        async function fetchAndSubscribeCalories() {

            const supabase = await createClient();
            const userData = await supabase.auth.getUser();
            const user = userData.data.user;
            let todayId;
            console.log('user in cd:', user);
            if (!user) return;

            const { data, error } = await supabase
                .from('days')
                .select('total_calories, id')
                .eq('user_id', user.id)
                .eq('date', new Date().toISOString().split('T')[0]);
            data && console.log('data in cd:', data);
            if (error) {
                console.error('Error fetching total calories:', error.message);
            }
            if (data[0]) {
                setTotalCalories(data[0].total_calories);
                todayId = data[0].id;
            }
            console.log('todayId:', todayId);
            const subscription = supabase
                .channel('total_daily_calories')
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'days',
                    //filter: `id=eq.${todayId}`
                }, payload => {
                    console.log('Change received. payload:', payload);
                    setTotalCalories(payload.new.total_calories);
                })
                .subscribe()
        }
        fetchAndSubscribeCalories();
    }, [])
    */
    let totalCalories = 0;
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    let todayId;
    //console.log('user in cd:', user);
    //if (!user) return;
    const { data, error } = await supabase
        .from('days')
        .select('total_calories, id')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    //data && console.log('data in cd:', data);
    if (error) {
        console.error('Error fetching total calories:', error.message);
    }
    if (data[0]) {
        //setTotalCalories(data[0].total_calories);
        totalCalories = data[0].total_calories;
        todayId = data[0].id;
    }

    return (
        <div>
            {totalCalories} calories
        </div>
    )
}