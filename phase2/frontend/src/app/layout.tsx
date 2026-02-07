import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Organize Tasks. Amplify Productivity.",
  description: "The ultimate task management platform for modern teams. Collaborate seamlessly, track progress in real-time, and achieve your goals faster with intuitive Kanban boards and powerful automation.",
  keywords: ["task management", "project management", "kanban", "productivity", "collaboration", "team management"],
  authors: [{ name: "TaskFlow Team" }],
  openGraph: {
    title: "TaskFlow - Organize Tasks. Amplify Productivity.",
    description: "The ultimate task management platform for modern teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
