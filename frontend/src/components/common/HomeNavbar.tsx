import CompanyIcon from "../molecules/CompanyIcon";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
    return (
        <header className='fixed left-0 right-0 top-0 z-40 h-[60px] border-b border-gray-200 bg-white py-3 shadow-sm'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <nav className='relative z-50 flex justify-between'>
                    <div className='flex items-center md:gap-x-12'>
                        <Link
                            aria-label='Home'
                            to='/'
                            className='flex items-center'
                        >
                            <CompanyIcon />
                        </Link>

                        <div className='hidden md:flex md:gap-x-6'>
                            <Link
                                className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                to='dashboard'
                            >
                                Dashboard
                            </Link>
                            <Link
                                className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                to='testimonials'
                            >
                                Task
                            </Link>
                            <Link
                                className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                to='projects'
                            >
                                Projects
                            </Link>
                        </div>
                    </div>

                    <div className='flex items-center gap-x-5 md:gap-x-8'>
                        <div className='hidden md:block'>
                            <Link
                                className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                to='/auth/login'
                            >
                                Login
                            </Link>
                        </div>
                        <Link
                            className='group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100'
                            color='blue'
                            to='/auth/signup'
                        >
                            <span>
                                Sign in{" "}
                                <span className='hidden lg:inline'>today</span>
                            </span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HomeNavbar;
