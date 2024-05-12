import Link from "next/link";

export const NavBar = () => {
  return (
    <div className="w-full h-10 bg-gray-100 flex align-middle justify-center left-0 z-10">
      <nav className="flex justify-center items-center gap-4">
        <Link href="/">Externt API</Link>
        <Link href="/internal-crud">CRUD (internt)</Link>
        <Link href="/about">Om showcase</Link>
      </nav>
    </div>
  );
};
