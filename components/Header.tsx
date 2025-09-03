
import React from 'react';
import { FilmIcon, PenSquareIcon } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="py-6 text-center w-full max-w-4xl">
            <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                   <FilmIcon className="text-indigo-600 dark:text-indigo-400"/>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Video-to-Blog <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </h1>
                 <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                   <PenSquareIcon className="text-indigo-600 dark:text-indigo-400"/>
                </div>
            </div>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Instantly convert video reviews into SEO-perfect articles with AI.
            </p>
        </header>
    );
};

export default Header;
