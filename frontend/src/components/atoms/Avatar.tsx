import React from "react";

const Avatar = () => {
    return (
        <div className='flex -space-x-2'>
            <div className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'>
                <img src='src/images/user/user-22.jpg' alt='user' />
            </div>
            <div className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'>
                <img src='src/images/user/user-23.jpg' alt='user' />
            </div>
            <div className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'>
                <img src='src/images/user/user-24.jpg' alt='user' />
            </div>
        </div>
    );
};

export default Avatar;
