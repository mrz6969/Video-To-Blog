
import React from 'react';

interface KeywordInputProps {
    keywords: string;
    onKeywordsChange: (keywords: string) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ keywords, onKeywordsChange }) => {
    return (
        <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                3. Main SEO Keywords (comma-separated)
            </label>
            <textarea
                id="keywords"
                rows={3}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                placeholder="e.g., product review, latest smartphone, camera quality"
                value={keywords}
                onChange={(e) => onKeywordsChange(e.target.value)}
            />
        </div>
    );
};

export default KeywordInput;
