import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
    title: string;
    price: string;
    imageUrl: string;
    purchaseUrl: string;
}

interface ProductSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    queryImage?: string | null; // Base64 or URL
    queryText?: string;
}

export default function ProductSearchModal({ isOpen, onClose, queryImage, queryText }: ProductSearchModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && (queryImage || queryText)) {
            handleSearch();
        } else {
            setProducts([]);
            setLoading(false);
            setError(null);
        }
    }, [isOpen, queryImage, queryText]);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setProducts([]);

        try {
            const res = await fetch("/api/product-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: queryImage, query: queryText }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error("Product search error:", err);
            setError("Failed to find similar products.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Similar Products
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white transition rounded-full hover:bg-neutral-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">

                    {/* Query Context */}
                    <div className="flex items-center gap-4 mb-8 p-4 bg-neutral-800/30 rounded-xl border border-neutral-800/50">
                        <div className="w-16 h-16 rounded-lg bg-neutral-800 overflow-hidden relative shrink-0 border border-neutral-700">
                            {queryImage ? (
                                <img src={queryImage} alt="Query" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">No Img</div>
                            )}
                        </div>
                        <div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1">Searching for</div>
                            <div className="text-sm text-white font-medium">{queryText || "Unknown Item"}</div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-neutral-800 rounded-xl"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400 bg-red-500/5 rounded-xl border border-red-500/10">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                            No similar products found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product, idx) => (
                                <a
                                    key={idx}
                                    href={product.purchaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-neutral-500 transition hover:shadow-lg hover:shadow-pink-500/10"
                                >
                                    <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full transform translate-y-2 group-hover:translate-y-0 transition">
                                                View Shop
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-xs font-medium text-neutral-300 line-clamp-2 mb-1 group-hover:text-white transition">
                                            {product.title}
                                        </h3>
                                        <div className="text-sm font-bold text-white">{product.price}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-neutral-800 bg-neutral-900 text-center">
                    <p className="text-[10px] text-neutral-500">
                        Powered by Google Cloud Vision API & Gemini
                    </p>
                </div>

            </div>
        </div>
    );
}
