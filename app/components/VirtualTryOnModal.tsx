import React, { useState, useEffect } from "react";
import Image from "next/image";

interface VirtualTryOnItem {
    name: string;
    croppedImage?: string | null;
    thumbnailImage?: string | null;
}

interface VirtualTryOnPayload {
    previewUrl: string | null;
    items: VirtualTryOnItem[];
}

interface VirtualTryOnModalProps {
    isOpen: boolean;
    onClose: () => void;
    payload: VirtualTryOnPayload | null;
}

export default function VirtualTryOnModal({ isOpen, onClose, payload }: VirtualTryOnModalProps) {
    const [poseFile, setPoseFile] = useState<File | null>(null);
    const [posePreview, setPosePreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

    // Reset state when modal opens with new payload
    useEffect(() => {
        if (isOpen && payload) {
            setPoseFile(null);
            setPosePreview(null);
            setProcessing(false);
            setError(null);
            setResultImageUrl(null);
        }
    }, [isOpen, payload]);

    if (!isOpen || !payload) return null;

    const handlePoseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        if (file) {
            setPoseFile(file);
            const url = URL.createObjectURL(file);
            setPosePreview(url);
        }
    };

    const urlToFile = async (url: string, filename: string): Promise<File> => {
        const res = await fetch(url);
        const blob = await res.blob();
        const mimeType = blob.type || "image/png";
        return new File([blob], filename, { type: mimeType });
    };

    const handleTryFullOutfit = async () => {
        if (!payload.previewUrl) {
            setError("Original style image not found.");
            return;
        }

        try {
            setProcessing(true);
            setError(null);
            setResultImageUrl(null);

            // personImage: Priority is new upload -> existing previewUrl
            let personImageFile: File;
            if (poseFile) {
                personImageFile = poseFile;
            } else {
                personImageFile = await urlToFile(payload.previewUrl, "person.png");
            }

            // garmentImage: Use the original full image as reference
            // REMOVED: Sending the full original image causes the model to overfit and return the original image 
            // instead of applying items to the new pose. We will rely on individual item crops.
            // const garmentImageFile = await urlToFile(payload.previewUrl, "garment.png");

            const formData = new FormData();
            formData.append("personImage", personImageFile);
            // formData.append("garmentImage", garmentImageFile);
            formData.append("productTitle", payload.items.map((it) => it.name).join(", "));

            // Append all item images (thumbnail preferred)
            payload.items.forEach((item, index) => {
                const imgUrl = item.thumbnailImage ?? item.croppedImage;
                if (imgUrl) {
                    formData.append(`item_${index}`, imgUrl);
                }
            });

            const res = await fetch("/api/virtual-fitting", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Virtual Try-On API Error: ${res.status} ${text}`);
            }

            const data = await res.json();

            if (!data.success || !data.resultImageDataUrl) {
                throw new Error(data.error || data.message || "Invalid result from Virtual Try-On.");
            }

            setResultImageUrl(data.resultImageDataUrl);
        } catch (err) {
            console.error("Full outfit VTO error:", err);
            setError("Failed to process Virtual Try-On.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-semibold text-white">Virtual Try-On Studio</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white transition rounded-full hover:bg-neutral-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Inputs */}
                    <div className="space-y-8">

                        {/* Step 1: Pose Selection */}
                        <div>
                            <div className="text-sm text-neutral-400 mb-3 font-medium uppercase tracking-wider">Step 1 — Choose Pose</div>
                            <label className="block cursor-pointer group relative">
                                <input type="file" accept="image/*" onChange={handlePoseUpload} className="hidden" />

                                {posePreview ? (
                                    <div className="relative w-full aspect-[3/4] rounded-xl border border-neutral-700 overflow-hidden group-hover:border-neutral-500 transition bg-black">
                                        <Image
                                            src={posePreview}
                                            alt="Selected pose"
                                            fill
                                            className="object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <span className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold">Change Pose</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/50 flex flex-col items-center justify-center text-center p-6 group-hover:border-neutral-500 group-hover:bg-neutral-800 transition">
                                        <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mb-4 text-neutral-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-200 mb-1">Upload Your Photo</div>
                                        <div className="text-xs text-neutral-400 mb-4 max-w-[200px]">
                                            Full body shot works best. We'll dress this person.
                                        </div>
                                        <span className="px-4 py-2 rounded-full bg-neutral-700 text-white text-xs font-bold group-hover:bg-neutral-600 transition">
                                            Select Image
                                        </span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Step 2: Outfit Review */}
                        <div>
                            <div className="text-sm text-neutral-400 mb-3 font-medium uppercase tracking-wider">Step 2 — Outfit Items</div>
                            <div className="grid grid-cols-3 gap-3">
                                {payload.items.map((item, idx) => (
                                    <div key={idx} className="bg-neutral-800/50 p-2 rounded-lg border border-neutral-800">
                                        <div className="aspect-square relative mb-2 bg-neutral-900 rounded-md overflow-hidden">
                                            {item.thumbnailImage || item.croppedImage ? (
                                                <Image
                                                    src={item.thumbnailImage ?? item.croppedImage ?? ""}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">No Img</div>
                                            )}
                                        </div>
                                        <div className="text-[10px] font-medium text-neutral-300 truncate">{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleTryFullOutfit}
                            disabled={processing || (!poseFile && !payload.previewUrl)}
                            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-white/10"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Look...
                                </span>
                            ) : (
                                "Generate Virtual Try-On"
                            )}
                        </button>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                    </div>

                    {/* Right Column: Result */}
                    <div className="bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col overflow-hidden min-h-[500px]">
                        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
                            <div className="text-sm font-medium text-neutral-300">Result Preview</div>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-6 bg-[url('/grid-pattern.svg')] bg-center">
                            {resultImageUrl ? (
                                <div className="relative w-full h-full min-h-[400px]">
                                    <Image
                                        src={resultImageUrl}
                                        alt="Virtual try-on result"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="text-center text-neutral-500">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 flex items-center justify-center">
                                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <p>Generated image will appear here</p>
                                </div>
                            )}
                        </div>

                        {resultImageUrl && (
                            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
                                <a
                                    href={resultImageUrl}
                                    download="nano-banana-vto.png"
                                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Image
                                </a>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
