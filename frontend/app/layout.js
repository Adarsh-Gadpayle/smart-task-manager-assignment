import "./globals.css";

export const metadata = {
  title: "Smart Task Manager",
  description: "Full-stack task management assignment"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
