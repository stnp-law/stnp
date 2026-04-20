import NotFoundComponent from "@/components/NotFound/NotFound";
// Import global css to ensure base styles are loaded if this renders outside main layout
import "./globals.css";

export const metadata = {
  title: "Page Not Found | Soaloan Tua Nababan & Partners",
  description: "The page you are looking for has been moved or does not exist.",
};

export default function GlobalNotFound() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#060E1A' }}>
      <NotFoundComponent />
    </div>
  );
}
