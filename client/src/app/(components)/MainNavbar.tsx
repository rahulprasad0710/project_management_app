import { Menu, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/StoreProvider";

import CompanyIcon from "./atoms/CompanyIcon";
import Link from "next/link";
import NotificationDropDown from "./NotificationDropDown";
import { setIsSidebarCollapsed } from "@/store";

const MainNavbar = () => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  console.log({
    session,
  });
  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link aria-label="Home" href="/" className="flex items-center">
              <CompanyIcon />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="dashboard"
              >
                Dashboard
              </Link>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="#testimonials"
              >
                {status}
              </a>
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="projects"
              >
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/login"
              >
                Login
              </Link>
            </div>
            <Link
              className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100"
              color="blue"
              href="/register"
            >
              <span>
                Sign in <span className="hidden lg:inline">today</span>
              </span>
            </Link>
            <div className="-mr-1 md:hidden">
              <div>
                <button
                  className="focus:not-data-focus:outline-hidden relative z-10 flex h-8 w-8 items-center justify-center"
                  aria-label="Toggle Navigation"
                  type="button"
                  aria-expanded="false"
                >
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path
                      d="M0 1H14M0 7H14M0 13H14"
                      className="origin-center transition"
                    />
                    <path
                      d="M2 2L12 12M12 2L2 12"
                      className="origin-center scale-90 opacity-0 transition"
                    />
                  </svg>
                </button>
              </div>
              <div
                style={{
                  position: "fixed",
                  top: 1,
                  left: 1,
                  width: 1,
                  height: 0,
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  borderWidth: 0,
                  display: "none",
                }}
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
