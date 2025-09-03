
import React from 'react';

interface ProcessingViewProps {
    message: string;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-md w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">AI is Working...</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 transition-all duration-300">{message}</p>
        </div>
    );
};

export default ProcessingView;
