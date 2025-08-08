// Assume these icons are imported from an icon library
import {
    BoxCubeIcon,
    CalenderIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    ListIcon,
    PieChartIcon,
    PlugInIcon,
    UserCircleIcon,
} from "../icons";
import { CalendarCog, KanbanSquare } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAppSelector } from "@/store/reduxHook";
import useSidebar from "@/context/useSidebar";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: {
        name: string;
        path: string;
        pro?: boolean;
        new?: boolean;
        icon?: React.ReactNode;
    }[];
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    // const authenticateEmployee = useAppSelector(
    //     (state) => state.global.authenticateEmployee
    // );

    const navItems: NavItem[] = [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/admin/dashboard",
        },

        {
            icon: <CalenderIcon />,
            name: "Bookings",
            subItems: [
                {
                    name: "Tasks",
                    path: "/admin/features/booking/tasks",
                    pro: false,
                    icon: <KanbanSquare />,
                },
                {
                    name: "Listings",
                    path: "/admin/features/listings?status=NEW",
                    pro: false,
                    icon: <ListIcon />,
                },
                {
                    name: "Settings",
                    path: "/admin/features/settings",
                    pro: false,
                    icon: <CalendarCog />,
                },
            ],
        },
        {
            icon: <UserCircleIcon />,
            name: "Clients",
            path: "/admin/clients",
        },
        {
            icon: <UserCircleIcon />,
            name: "Projects",
            path: "/admin/projects",
        },
        {
            icon: <UserCircleIcon />,
            name: "Employees",
            path: "/admin/employees",
        },
    ];

    const othersItems: NavItem[] = [
        {
            icon: <BoxCubeIcon />,
            name: "Settings",
            subItems: [
                {
                    name: "Sprints",
                    path: "/admin/other-settings/sprints",
                    pro: false,
                },
                {
                    name: "Labels",
                    path: "/admin/other-settings/sprints",
                    pro: false,
                },
                {
                    name: "Task Status",
                    path: "/admin/settings/task-status",
                    pro: false,
                },
            ],
        },
        {
            icon: <PieChartIcon />,
            name: "Company Settings",
            subItems: [
                { name: "Line Chart", path: "/line-chart", pro: false },
                { name: "Bar Chart", path: "/bar-chart", pro: false },
            ],
        },

        {
            // PERMISSION ONLY TO ADMIN
            icon: <PlugInIcon />,
            name: "Admin Settings",
            subItems: [
                {
                    name: "Employee's Permissions",
                    path: "/admin/auth-settings/employees",
                    pro: false,
                },
                {
                    name: "Roles",
                    path: "/admin/auth-settings/roles",
                    pro: false,
                },
                {
                    name: "Permissions",
                    path: "/admin/auth-settings/permissions",
                    pro: false,
                },
                {
                    name: "Feature & Team",
                    path: "/admin/auth-settings/features",
                    pro: false,
                },
                {
                    name: "Internal Company",
                    path: "/admin/auth-settings/internal-company",
                    pro: false,
                },
            ],
        },
    ];
    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (
        index: number,
        menuType: "main" | "others"
    ) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
        <ul className='flex flex-col gap-4'>
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${
                                openSubmenu?.type === menuType &&
                                openSubmenu?.index === index
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                            } cursor-pointer ${
                                !isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                            }`}
                        >
                            <span
                                className={`menu-item-icon-size  ${
                                    openSubmenu?.type === menuType &&
                                    openSubmenu?.index === index
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className='menu-item-text'>
                                    {nav.name}
                                </span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? "rotate-180 text-brand-500"
                                            : ""
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path)
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                }`}
                            >
                                <span
                                    className={`menu-item-icon-size ${
                                        isActive(nav.path)
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className='menu-item-text'>
                                        {nav.name}
                                    </span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems &&
                        (isExpanded || isHovered || isMobileOpen) && (
                            <div
                                ref={(el) => {
                                    subMenuRefs.current[
                                        `${menuType}-${index}`
                                    ] = el;
                                }}
                                className='overflow-hidden transition-all duration-300'
                                style={{
                                    height:
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? `${
                                                  subMenuHeight[
                                                      `${menuType}-${index}`
                                                  ]
                                              }px`
                                            : "0px",
                                }}
                            >
                                <ul className='mt-2 space-y-1 ml-9'>
                                    {nav.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                to={subItem.path}
                                                className={`menu-dropdown-item ${
                                                    isActive(subItem.path)
                                                        ? "menu-dropdown-item-active"
                                                        : "menu-dropdown-item-inactive"
                                                }`}
                                            >
                                                {subItem.icon && (
                                                    <span
                                                        className={`menu-sub-item-icon-size`}
                                                    >
                                                        {subItem.icon}
                                                    </span>
                                                )}
                                                {subItem.name}
                                                <span className='flex items-center gap-1 ml-auto'>
                                                    {subItem.new && (
                                                        <span
                                                            className={`ml-auto ${
                                                                isActive(
                                                                    subItem.path
                                                                )
                                                                    ? "menu-dropdown-badge-active"
                                                                    : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge`}
                                                        >
                                                            new
                                                        </span>
                                                    )}
                                                    {subItem.pro && (
                                                        <span
                                                            className={`ml-auto ${
                                                                isActive(
                                                                    subItem.path
                                                                )
                                                                    ? "menu-dropdown-badge-active"
                                                                    : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge`}
                                                        >
                                                            pro
                                                        </span>
                                                    )}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
            isExpanded || isMobileOpen
                ? "w-[290px]"
                : isHovered
                ? "w-[290px]"
                : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-8 flex ${
                    !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                }`}
            >
                <Link to='/'>
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img
                                className='dark:hidden'
                                src='/images/logo/logo.svg'
                                alt='Logo'
                                width={150}
                                height={40}
                            />
                            <img
                                className='hidden dark:block'
                                src='/images/logo/logo-dark.svg'
                                alt='Logo'
                                width={150}
                                height={40}
                            />
                        </>
                    ) : (
                        <img
                            src='/images/logo/logo-icon.svg'
                            alt='Logo'
                            width={32}
                            height={32}
                        />
                    )}
                </Link>
            </div>
            <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
                <nav className='mb-6'>
                    <div className='flex flex-col gap-4 justify-between h-full md:h-[85vh]'>
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Menu"
                                ) : (
                                    <HorizontaLDots className='size-6' />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>
                        <div className=''>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    <div className='text-bold text-sm text-slate-900 '>
                                        Settings
                                    </div>
                                ) : (
                                    <HorizontaLDots />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, "others")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
