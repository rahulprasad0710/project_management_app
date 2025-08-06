const NewKanban = () => {
    return (
        <div>
            <div className='mt-7 grid grid-cols-1  sm:mt-0 sm:grid-cols-2 xl:grid-cols-5'>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <div
                            key={index}
                            className={
                                "bg-gray-100  " +
                                (index !== 3
                                    ? "border-r border-gray-200 dark:border-gray-800"
                                    : "")
                            }
                        >
                            <div className='flex flex-col gap-4 xl:p-6 p-4'>
                                <div className='mb-1 flex items-center justify-between '>
                                    <h3 className='flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90 '>
                                        To Do
                                        <span className='inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80'>
                                            3
                                        </span>
                                    </h3>
                                    <div className='relative '>
                                        <button className='text-gray-700 dark:text-gray-400'>
                                            <svg
                                                className='fill-current'
                                                width={24}
                                                height={24}
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z'
                                                    fill=''
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className='absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark'
                                            style={{ display: "none" }}
                                        >
                                            <button className='flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
                                                Edit
                                            </button>
                                            <button className='flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
                                                Delete
                                            </button>
                                            <button className='flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'>
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 '>
                                    {Array(7)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div
                                                key={index}
                                                className=' task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5'
                                            >
                                                <div className='flex items-start justify-between gap-6'>
                                                    <div>
                                                        <h4 className='mb-5 text-base text-gray-800 dark:text-white/90'>
                                                            Kanban Flow Manager
                                                        </h4>
                                                        <div className='flex items-center gap-3'>
                                                            <span className='flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                                                                <svg
                                                                    className='fill-current'
                                                                    width={16}
                                                                    height={16}
                                                                    viewBox='0 0 16 16'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                >
                                                                    <path
                                                                        fillRule='evenodd'
                                                                        clipRule='evenodd'
                                                                        d='M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z'
                                                                        fill=''
                                                                    />
                                                                </svg>
                                                                Feb 12, 2027
                                                            </span>
                                                            <span className='flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                                                                <svg
                                                                    className='stroke-current'
                                                                    width={18}
                                                                    height={18}
                                                                    viewBox='0 0 18 18'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                >
                                                                    <path
                                                                        d='M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z'
                                                                        stroke=''
                                                                        strokeWidth='1.5'
                                                                        strokeLinejoin='round'
                                                                    />
                                                                </svg>
                                                                8
                                                            </span>
                                                            <span className='flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                                                                <svg
                                                                    className='fill-current'
                                                                    width={16}
                                                                    height={16}
                                                                    viewBox='0 0 16 16'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                >
                                                                    <path
                                                                        fillRule='evenodd'
                                                                        clipRule='evenodd'
                                                                        d='M6.88066 3.10905C8.54039 1.44932 11.2313 1.44933 12.8911 3.10906C14.5508 4.76878 14.5508 7.45973 12.8911 9.11946L12.0657 9.94479L11.0051 8.88413L11.8304 8.0588C12.9043 6.98486 12.9043 5.24366 11.8304 4.16972C10.7565 3.09577 9.01526 3.09577 7.94132 4.16971L7.11599 4.99504L6.05533 3.93438L6.88066 3.10905ZM8.88376 11.0055L9.94442 12.0661L9.11983 12.8907C7.4601 14.5504 4.76915 14.5504 3.10942 12.8907C1.44969 11.231 1.44969 8.54002 3.10942 6.88029L3.93401 6.0557L4.99467 7.11636L4.17008 7.94095C3.09614 9.01489 3.09614 10.7561 4.17008 11.83C5.24402 12.904 6.98522 12.904 8.05917 11.83L8.88376 11.0055ZM9.94458 7.11599C10.2375 6.8231 10.2375 6.34823 9.94458 6.05533C9.65169 5.76244 9.17682 5.76244 8.88392 6.05533L6.0555 8.88376C5.7626 9.17665 5.7626 9.65153 6.0555 9.94442C6.34839 10.2373 6.82326 10.2373 7.11616 9.94442L9.94458 7.11599Z'
                                                                        fill=''
                                                                    />
                                                                </svg>
                                                                2
                                                            </span>
                                                        </div>
                                                        <span className='mt-3 inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500'>
                                                            Template
                                                        </span>
                                                    </div>
                                                    <div className='h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800'>
                                                        <img
                                                            src='src/images/user/user-10.jpg'
                                                            alt='user'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className='relative'>
                <Button variant='outline' size='sm'>
                    <FunnelPlus size={20} />
                    Filter
                </Button>
                <div
                    className='absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800'
                    style={{ display: "none" }}
                >
                    <div className='mb-5'>
                        <label className='mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300'>
                            Category
                        </label>
                        <input
                            type='text'
                            className='dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                            placeholder='Search category...'
                        />
                    </div>
                    <div className='mb-5'>
                        <label className='mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300'>
                            Company
                        </label>
                        <input
                            type='text'
                            className='dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                            placeholder='Search company...'
                        />
                    </div>
                    <button> Apply</button>
                </div>
            </div>
        </div>
    );
};

export default NewKanban;
