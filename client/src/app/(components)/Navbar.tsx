import { Menu, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/StoreProvider";

import Link from "next/link";
import NotificationDropDown from "./NotificationDropDown";
import { setIsSidebarCollapsed } from "@/store";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Left section: Logo + Nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0">LOGO</div>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              <button
                onClick={() =>
                  dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
                }
                className="group flex items-center gap-2 rounded-md bg-neutral-100 px-1.5 py-1.5 text-sm font-medium text-neutral-950"
              >
                <Menu className="h-6 w-6" />
              </button>

              <a
                href="#"
                className="group flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-950"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-950"
              >
                Projects
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-950"
              >
                Team
              </a>
            </div>
          </div>

          {/* Right section: Notifications + User Menu */}
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
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
                  <div className="absolute right-0 z-10 mt-12 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                      onClick={() => signOut()}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                >
                  SignIn
                </button>
                <Link
                  href={"/login"}
                  type="button"
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-blue-500 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-neutral-300 hover:text-white active:border-neutral-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
