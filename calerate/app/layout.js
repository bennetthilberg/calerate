import NavBar from "./components/(NavBar)/NavBar";
import "./globals.scss";


export const metadata = {
  title: "Calerate",
  description: "Free, snappy calorie tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
