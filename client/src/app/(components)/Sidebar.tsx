"use client";

import {
  Brush,
  CalendarCog,
  Home,
  LucideIcon,
  Projector,
  Users,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/StoreProvider";

import Image from "next/image";
import Link from "next/link";
import { setIsSidebarCollapsed } from "@/store";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
}

const SidebarLink = ({
  href,
  icon: Icon,
  title,
  onClick,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || (pathName === "/" && href === "/dashboard");
  const screenWidth = window.innerWidth;
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <Link href={href}>
      <div
        className={`relative flex cursor-pointer items-center justify-start gap-3 px-8 py-3 text-gray-800 transition-colors ${isActive ? "bg-gray-200" : ""} hover:bg-gray-100`}
      >
        <Icon className="h-6 w-6 text-gray-800" />
        <span className="font-medium text-gray-800">{title}</span>
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] border-[1.5px] bg-blue-400" />
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl border-y-[1.5px] border-y-[1.5px] border-gray-100
    transition-all duration-300 h-full z-40  overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0  " : "w-64"}
  `;
  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-50 flex h-16 min-h-[56px] w-64 items-center justify-between border-y-[1.5px] border-gray-200 bg-white px-6">
          <Image src="/icons/inventory.png" alt="LOGO" width={40} height={40} />
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <X className="mt-[0.1rem] h-6 w-6 cursor-pointer font-bold text-gray-800 hover:text-gray-500" />
          </button>
        </div>

        <nav className="z-10 w-full">
          <SidebarLink href="/" icon={Home} title="Dashboard" />
          <SidebarLink href="/projects" icon={Projector} title="Project" />
          <SidebarLink href="/employees" icon={Users} title="Employees" />
          <SidebarLink href="/sprints" icon={CalendarCog} title="Sprint" />
          <SidebarLink href="/labels" icon={Brush} title="Labels" />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
