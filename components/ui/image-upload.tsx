'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PutBlobResult } from '@vercel/blob';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Basic validation
        if (!file.type.includes('image')) {
            alert('Please upload an image file');
            return;
        }

        setIsLoading(true);
        try {
            // Upload via our API route
            const response = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                body: file,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const newBlob = (await response.json()) as PutBlobResult;
            onChange(newBlob.url);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Something went wrong during upload');
        } finally {
            setIsLoading(false);
            setDragActive(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={cn("space-y-4 w-full", className)}>
            {value ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                    <Image
                        fill
                        src={value}
                        alt="Upload"
                        className="object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 transition"
                        type="button"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors h-48 cursor-pointer hover:bg-gray-50/50",
                        dragActive && "border-primary bg-primary/10",
                        isLoading && "opacity-50 cursor-not-allowed",
                        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                        disabled={isLoading || disabled}
                    />

                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-gray-100 rounded-full">
                                    <UploadCloud className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        SVG, PNG, JPG or GIF (max 4MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
