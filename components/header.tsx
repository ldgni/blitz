import NavLinks from "@/components/nav-links";

export default function Header() {
  return (
    <header className="mb-16 flex items-center justify-between sm:mb-24 md:mb-32 lg:mb-40">
      <NavLinks />
    </header>
  );
}
