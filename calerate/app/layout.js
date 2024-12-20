import NavBar from "./components/(NavBar)/NavBar";
import SubNav from "./components/(SubNav)/SubNav";
import ActionBar from "./components/ActionBar/ActionBar";
import "./globals.scss";
import { createClient } from "@/utils/supabase/server";
import {Open_Sans} from 'next/font/google'



export const metadata = {
  title: "Calerate",
  description: "Free, snappy calorie tracking",
};

const openSans = Open_Sans();


export default async function RootLayout({ children, searchParams }) {
  const supabase = await createClient();
  const userData = await supabase.auth.getUser();
  const user = userData?.data?.user;
  const query = searchParams?.query ?? "";
  return (
    <html lang="en">
      <body className={openSans.className}>
        <NavBar />
        {children}
        {user && <ActionBar />}
      </body>
    </html>
  );
}
