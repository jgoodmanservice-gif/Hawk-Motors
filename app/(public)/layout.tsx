import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { getSiteContact } from "@/lib/site";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSiteContact();
  return (
    <>
      <Navbar contact={contact} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer contact={contact} />
      <FloatingContact contact={contact} />
    </>
  );
}
