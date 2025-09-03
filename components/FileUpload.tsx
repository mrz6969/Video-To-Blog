
import React, { useRef } from 'react';
import { UploadCloudIcon, FileIcon, CheckCircleIcon } from './Icons';

interface FileUploadProps {
    label: string;
    onFileSelect: (file: File | null) => void;
    acceptedTypes: string;
    file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect, acceptedTypes, file }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        onFileSelect(selectedFile);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFile = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
        if (droppedFile) {
            onFileSelect(droppedFile);
        }
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => inputRef.current?.click()}
                className={`flex justify-center items-center w-full px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                ${file ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700/50'}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={acceptedTypes}
                    onChange={handleFileChange}
                />
                {file ? (
                    <div className="text-center text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="mx-auto" />
                        <p className="mt-2 font-semibold">{file.name}</p>
                        <p className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <UploadCloudIcon className="mx-auto" />
                        <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
                        <p className="text-xs">{acceptedTypes === '.srt' ? 'SRT file' : 'MP4, MOV, AVI'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
