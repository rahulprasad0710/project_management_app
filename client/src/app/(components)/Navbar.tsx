import { Menu, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/StoreProvider";

import Link from "next/link";
import { setIsSidebarCollapsed } from "@/store";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
  //   <Menu className="h-8 w-8" />
  // </button>;

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
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500"
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            >
              <span className="sr-only">View notifications</span>
              {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 z-10 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-gray-700">
                  No new notifications
                </div>
              </div>
            )}

            {/* Profile dropdown */}
            <div className="relative ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              >
                account
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )} */}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Projects
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Team
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
