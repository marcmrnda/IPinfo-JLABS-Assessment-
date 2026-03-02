import type { MouseEventHandler } from "react";
import { IoMdPin } from "react-icons/io";

interface NavbarProps {
  handleLogout: () => Promise<void>
}

function Navbar({handleLogout}: NavbarProps) {
  return (
    <div className="bg-zinc-500 w-full h-17.5 flex justify-center items-center">
       <section className="flex justify-center items-center gap-1 absolute left-3">
         <IoMdPin className="text-3xl text-amber-200"/>
        <h1 className="font-Orbitron text-2xl text-amber-200">IPinfo</h1>
       </section>
        <button
        onClick={handleLogout}
        className='bg-yellow-200 text-black absolute right-5 w-30 h-10 m-auto rounded-md font-Orbitron text-sm cursor-pointer hover:bg-blue-400 '
      >
        Sign out
      </button>
    </div>
  )
}

export default Navbar
