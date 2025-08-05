import React from 'react';

export const Select = ({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    return (
        <select
            className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sbp-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
            {...props}
        >
            {children}
        </select>
    );
};