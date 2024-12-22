import NavBar from "./components/(NavBar)/NavBar";
import SubNav from "./components/(SubNav)/SubNav";
import ActionBar from "./components/ActionBar/ActionBar";
import "./globals.scss";
import { createClient } from "@/utils/supabase/server";
import { Open_Sans } from 'next/font/google'
import PwaReminder from "./components/PwaReminder/PwaReminder";



export const metadata = {
  title: "Calerate",
  description: "Free, snappy calorie tracking",
};

const openSans = Open_Sans({subsets: ['latin']});


export default async function RootLayout({ children, searchParams }) {
  const supabase = await createClient();
  const userData = await supabase.auth.getUser();
  const user = userData?.data?.user;
  const query = searchParams?.query ?? "";
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-128.png" />
        <link rel="apple-touch-icon" href="/icon-128.png" />
      </head>
      <body className={openSans.className}>
        <PwaReminder />
        <div className="app">
          <NavBar />
          {children}
          {user && <ActionBar />}
        </div>
      </body>
    </html>
  );
}
