export const NavBar = () => {
  return (
    <div className="w-full h-10 bg-gray-200 flex align-middle justify-center drop-shadow-md left-0 z-10">
      <nav className="flex justify-center items-center gap-4">
        <a href="/" className="text-black font-bold">
          Externt API
        </a>
        <a href="/internal-crud" className="text-black font-bold">
          Intern CRUD
        </a>
        <a href="#" className="text-black font-bold">
          Om
        </a>
      </nav>
    </div>
  );
};
