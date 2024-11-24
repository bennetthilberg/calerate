import "./globals.scss";


export const metadata = {
  title: "Calerate",
  description: "Free, snappy calorie tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <body>
        {children}
      </body>
    </html>
  );
}
