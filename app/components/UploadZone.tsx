'use client';

import { useState } from 'react';

interface UploadZoneProps {
    onUpload?: (file: File) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onUpload?.(file);
    };

    return (
        <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {preview ? (
                <div className="relative w-full h-64 md:h-96">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 md:h-96 space-y-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Upload your photo</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        Drag and drop your image here, or click to browse. We recommend full-body shots for best results.
                    </p>
                    <label className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-pink-500/30">
                        <span>Select File</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            )}
        </div>
    );
}
