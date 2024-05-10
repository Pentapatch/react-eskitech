import { NavBar } from "@root/components/nav-bar/nav-bar";

export const Header = () => {
  return (
    <div className="bg-white w-full fixed top-0 left-0 flex flex-col gap-2 z-10">
      <div className="w-full h-16 flex justify-center items-center gap-2">
        <h1 className="text-blue-500 font-bold text-4xl">Eskitech</h1>
        <p className="text-black">
          <span className="text-lg">|</span> Proof of concept API interface
        </p>
      </div>
      <NavBar />
    </div>
  );
};
