import CompanyIcon from "../molecules/CompanyIcon";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
    return (
        <header className='fixed left-0 right-0 top-0 z-40 min-h-[60px] border-b border-gray-200 bg-white  p-3 shadow-sm  dark:border-gray-800 dark:bg-gray-900'>
            <nav className='relative z-50 flex justify-between'>
                <div className='flex items-center gap-6 '>
                    <Link
                        aria-label='Home'
                        to='/'
                        className='flex items-center'
                    >
                        <CompanyIcon />
                    </Link>

                    <div className=' md:flex md:gap-x-6'>
                        <Link
                            className='inline-block rounded-md px-4 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 hover:text-white'
                            to='dashboard'
                        >
                            Admin Panel
                        </Link>
                    </div>
                </div>

                <div className='flex items-center gap-x-5 md:gap-x-8'>
                    <Link
                        className='group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100'
                        color='blue'
                        to='/auth/login'
                    >
                        <span>Login</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default HomeNavbar;
