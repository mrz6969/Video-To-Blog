
import React from 'react';

const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const UploadCloudIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-10 w-10 ${className}`}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
    </svg>
);

export const FileIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-8 w-8 ${className}`}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
);

export const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-10 w-10 ${className}`}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

export const ArrowRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-5 w-5 ${className}`}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-5 w-5 ${className}`}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
);

export const Image: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-5 w-5 ${className}`}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
        <circle cx="9" cy="9" r="2"></circle>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
);

export const FileTextIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-5 w-5 ${className}`}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
);

export const FilmIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg {...iconProps} className={`h-8 w-8 ${className}`}>
        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
        <path d="M7 3v18"></path>
        <path d="M3 7.5h4"></path><path d="M3 12h18"></path>
        <path d="M3 16.5h4"></path><path d="M17 3v18"></path>
        <path d="M17 7.5h4"></path><path d="M17 16.5h4"></path>
     </svg>
);

export const PenSquareIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-8 w-8 ${className}`}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const RefreshCwIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`h-5 w-5 ${className}`}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);
