import NavBar from "./components/(NavBar)/NavBar";
import SubNav from "./components/(SubNav)/SubNav";
import "./globals.scss";
import { createClient } from "@/utils/supabase/server";


export const metadata = {
  title: "Calerate",
  description: "Free, snappy calorie tracking",
};

export default async function RootLayout({ children, searchParams }) {
  const supabase = await createClient();
  const userData = await supabase.auth.getUser();
  const user = userData?.data?.user;
  const query = searchParams?.query ?? "";
  return (
    <html lang="en">
      <body>
        <NavBar />
        {user && <SubNav initialQuery={query}/>}
        {children}
      </body>
    </html>
  );
}
