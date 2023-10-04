"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

// menu list
const navLinks = [
  {
    title: "Overall Dashboard",
    link: "/",
  },
  {
    title: "Daily Summary Report",
    link: "/summary",
  },
  {
    title: "Daily Record",
    link: "/daily",
  },
  // {
  //   title: "Manpower Survey",
  //   link: "/survey",
  // },
  // {
  //   title: "Skill Evaluation",
  //   link: "/skill",
  // },
  // {
  //   title: "Personal Information",
  //   link: "/information",
  // },
];

export function Navigation() {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // ฟังก์ชันเพื่อปิด Drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <nav className="bg-white">
      {/* nav main button มี sidebar,home link page,login link page */}
      <div className="flex px-6 py-2 justify-between items-center">
        <div className="flex justify-around items-center space-x-5">
          <button onClick={() => setDrawerOpen(true)} className="square-btn ">
            <MenuIcon fontSize="medium" className="h-6 w-auto" />
          </button>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box className="flex flex-col gap-10 p-7 overflow-y-auto h-full items-center rounded-md">
              {navLinks.map(({ link, title }) => (
                <Link
                  key={title}
                  href={link}
                  className={`${
                    pathname == link
                      ? "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-red-500 text-white text-center ring-4 ring-red-200"
                      : "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-red-500 text-red-500 hover:text-white text-center ring-2 ring-red-500 "
                  } w-full justify-center`} // Add flex-grow class
                  onClick={closeDrawer}
                >
                  {title}
                </Link>
              ))}
            </Box>
          </Drawer>

          <Image
            alt="logo"
            height={120}
            width={120}
            priority
            className="hidden md:block"
            src="/Denso_Logo.png"
          />
        </div>
        <h2 className="text-[#db0232] hidden md:block text-3xl">
          Mfg. Manpower allocation & skill Control
        </h2>

        <Link href="/login" className="nav-btn">
          <PersonIcon fontSize="medium" className="h-6 w-auto" />
        </Link>
      </div>
      {/* nav link to pages */}
      <div className="flex justify-between py-2 px-5 text-lg text-black text-center max-lg:hidden border-t items-center">
        {navLinks.map(({ link, title }) => (
          <Link
            key={title}
            href={link}
            className={`${
              pathname == link
                ? "p-2 bg-red-500 text-white rounded-md ring-4 ring-red-200 transition-all duration-150 flex-1 mx-5 text-sm text-limit"
                : "p-2 bg-white text-red-500 rounded-md ring-2 ring-red-500 hover:bg-red-500 hover:text-white transition-all duration-150 flex-1 mx-5 text-sm text-limit"
            }`}
          >
            {title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
