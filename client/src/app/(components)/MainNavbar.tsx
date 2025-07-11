import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
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

  const handleLogout = async () => {
    const response = await signOut();
    console.log(response);
  };
  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[60px] border-b border-gray-200 bg-white py-3 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link aria-label="Home" href="/" className="flex items-center">
              <CompanyIcon />
            </Link>
            <div className="md:block">
              <div>
                <button
                  onClick={() =>
                    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
                  }
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
            </div>
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
            {session?.user ? (
              <div className="relative ml-4 flex gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                    id="dropdown-notifications"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                    aria-haspopup="true"
                  >
                    <div className="absolute -end-2 -top-2">
                      <span className="rounded-full bg-green-700 px-1.5 py-0.5 text-xs font-semibold text-white">
                        3
                      </span>
                    </div>
                    <svg
                      className="hi-outline hi-bell-alert inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                  onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                >
                  account
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-20 z-10 mt-12 w-[24rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <NotificationDropDown />
                  </div>
                )}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-12 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <button
                      onClick={() => handleLogout()}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
