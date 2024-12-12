import { createClient } from "@/utils/supabase/server"


async function getCalorieHistory(){
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData.data.user;
    const { data: calorieHistoryData } = await supabase
        .from('days')
        .select('total_calories, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    return calorieHistoryData;
}

function getDayOfWeek(isoString){
    const date = new Date(isoString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function getIntlDate(isoString){
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default async function FoodHistory() {    
    const days = await getCalorieHistory();
    const today = new Date().toISOString().split('T')[0];
    console.log('today:', today);

    return(
        <div>
            <h1>Food History</h1>
            <ul>
                {days.map(day => (
                    <li key={day.date}>
                        {/* 
                            when doing ui, have weekday big, then intldate as lighter colored subtext
                        */}
                        <p>{getDayOfWeek(day.date)}</p>
                        <p>
                            {getIntlDate(day.date)}
                        </p>
                        <p>{day.date}</p>
                        <p>{day.total_calories}</p>
                        {day.date === today && <p>(Today)</p>}
                    </li>
                ))}
            </ul>
        </div>
    )
}
