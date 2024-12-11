export const revalidate = 0;
import { createClient } from "@/utils/supabase/server";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import ManageGoalCalories from "../ManageGoalCalories/ManageGoalCalories";

export default async function CaloriesDisplay() {

    let totalCalories = 0;
    let goalCalories;
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const user = userData?.data?.user;
    let todayId;
    const { data, error } = await supabase
        .from('days')
        .select('total_calories, id, goal_calories')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    if (error) {
        console.error('Error fetching total calories:', error.message);
    }
    if (data[0]) {
        totalCalories = data[0].total_calories;
        goalCalories = data[0].goal_calories;
        todayId = data[0].id;
    }

    return (
        <div>
            {Math.round(totalCalories)} {goalCalories ?
                `/ ${goalCalories} calories` :
                "calories"
            }
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button>
                        Manage Goal
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="overlay" />
                    <Dialog.Content className="modalContent">
                        <VisuallyHidden.Root>
                            <Dialog.Title>Manage goal calories</Dialog.Title>
                            <Dialog.Description>Add or edit today's calore goal</Dialog.Description>
                        </VisuallyHidden.Root>
                        <ManageGoalCalories />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}