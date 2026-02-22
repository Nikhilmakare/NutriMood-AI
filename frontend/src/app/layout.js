import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata = {
  title: "NutriMoodAI",
  description: "Get your meal recommendations based on your mood and calorie",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
