import ViewTransitionGuard from "@/components/Components/ViewTransitionGuard/ViewTransitionGuard";
import { Geist, Newsreader, Julius_Sans_One } from "next/font/google";
import { getDictionary } from '@/lib/dictionaries';
import "flag-icons/css/flag-icons.min.css";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import LoadingProvider from "@/components/LoadingScreen/LoadingProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollReset from "@/components/Components/ScrollReset/ScrollReset";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const juliusSansOne = Julius_Sans_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-julius",
});

export const metadata = {
  title: {
    template: "%s | Soaloan Tua Nababan & Partners",
    default: "Soaloan Tua Nababan & Partners — Law Firm Jakarta",
  },
  description:
    "STNP is a full-service law firm based in Jakarta, specializing in bankruptcy, commercial litigation, corporate law, project financing, infrastructure, and plantation law.",
  keywords: [
    "law firm jakarta",
    "bankruptcy lawyer indonesia",
    "commercial litigation",
    "corporate law",
    "STNP",
    "Soaloan Tua Nababan",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stnp.co.id",
    siteName: "Soaloan Tua Nababan & Partners",
  },
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geist.variable} ${newsreader.variable} ${juliusSansOne.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LoadingProvider>
          <ScrollReset />
          <Navbar navDict={dict.nav} lang={lang} />
          {/* ViewTransition wraps only the page content, not the anchored Navbar/Footer */}
          <ViewTransitionGuard
            enter="page-fade"
            exit="page-fade"
          >
            <main style={{ minHeight: '100vh' }}>{children}</main>
          </ViewTransitionGuard>
          <Footer dict={dict} lang={lang} />
        </LoadingProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
