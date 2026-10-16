import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chhath Puja 2026 | Wonderwall",
  description:
    "Celebrate Chhath Puja 2026, its traditions, sacred rituals, and the spirit of community.",
  openGraph: {
    title: "Chhath Puja 2026",
    description: "आस्था, परंपरा और प्रकृति का महापर्व",
    type: "website",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Chhath Puja 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chhath Puja 2026",
    description: "आस्था, परंपरा और प्रकृति का महापर्व",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <footer className="footer">
          <b>CHHATH PUJA 2026 · WONDERWALL</b>
          <p>Keeping our traditions alive, together.</p>
          <span>जय छठी मैया।</span>
        </footer>
      </body>
    </html>
  );
}