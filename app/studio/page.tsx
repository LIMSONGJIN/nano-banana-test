"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import VirtualTryOnModal from "../components/VirtualTryOnModal";
import ProductSearchModal from "../components/ProductSearchModal";

interface BoundingBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface RelatedProduct {
	title: string;
	price: string;
	image?: string;
	url?: string;
}

interface FashionItem {
	name: string;
	brand: string;
	price: string;
	matchScore: number;
	category: string;
	color: string;
	material: string;
	boundingBox: BoundingBox;
	searchQuery: string;
	relatedProducts?: RelatedProduct[];
	croppedImage?: string | null;
	thumbnailImage?: string | null;
}

const StudioPage: React.FC = () => {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [results, setResults] = useState<FashionItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("studio-vto-payload");
		}
	}, []);

	const generateThumbnailsForItems = async (items: FashionItem[]): Promise<FashionItem[]> => {
		if (items.length === 0) return items;

		const updatedItems = await Promise.all(
			items.map(async (item) => {
				// 1. Try generating from cropped image first
				if (item.croppedImage) {
					try {
						const res = await fetch("/api/generate-item-thumbnail", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								croppedImage: item.croppedImage,
								name: item.name,
								category: item.category,
								color: item.color,
							}),
						});

						if (res.ok) {
							const data: { success?: boolean; thumbnailImage?: string } = await res.json();
							if (data.success && data.thumbnailImage) {
								return {
									...item,
									thumbnailImage: data.thumbnailImage,
								};
							}
						} else {
							console.warn(
								`Thumbnail generation failed for ${item.name} (status: ${res.status}). Attempting fallback...`
							);
						}
					} catch (err) {
						console.error("Thumbnail generation error (image-based):", err);
						// Proceed to fallback
					}
				}

				// 2. Fallback: Try generating from search query (text-based)
				// This runs if:
				// - No croppedImage exists
				// - OR image-based generation failed (res.ok is false or exception occurred)
				try {
					console.log(`Attempting text-based thumbnail generation for ${item.name}...`);
					const res = await fetch("/api/generate-item-thumbnail", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							// No croppedImage
							searchQuery: item.searchQuery,
							name: item.name,
							category: item.category,
							color: item.color,
						}),
					});

					if (!res.ok) {
						console.error(`Fallback generation failed for ${item.name} (status: ${res.status})`);
						return item;
					}

					const data: { success?: boolean; thumbnailImage?: string } = await res.json();

					if (data.success && data.thumbnailImage) {
						return {
							...item,
							thumbnailImage: data.thumbnailImage,
						};
					}
				} catch (err) {
					console.error("Thumbnail generation error (fallback):", err);
				}

				return item;
			})
		);

		return updatedItems;
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setUploadedFile(file);
		setResults([]);
		setError(null);

		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}

		// 새 이미지를 선택하면 이전 Virtual Try-On payload는 삭제
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("studio-vto-payload");
		}
	};

	const handleAnalyze = async (e: FormEvent) => {
		e.preventDefault();
		if (!uploadedFile) {
			setError("먼저 이미지를 업로드해 주세요.");
			return;
		}

		// 새로운 분석을 시작할 때, 이전 결과와 Virtual Try-On payload를 초기화
		setResults([]);
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("studio-vto-payload");
		}

		try {
			setLoading(true);
			setError(null);

			const formData = new FormData();
			formData.append("image", uploadedFile);

			const res = await fetch("/api/analyze-fashion", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(`API Error: ${res.status} ${text}`);
			}

			const data: { items: FashionItem[] } = await res.json();
			const baseItems = data.items ?? [];
			const itemsWithThumbnails = await generateThumbnailsForItems(baseItems);
			setResults(itemsWithThumbnails);
		} catch (err) {
			console.error("Analyze error:", err);
			setError("이미지 분석 중 문제가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [vtoPayload, setVtoPayload] = useState<{ previewUrl: string | null; items: FashionItem[] } | null>(null);

	const handleVisualize = () => {
		if (results.length === 0) {
			setError("먼저 이미지를 업로드하고 분석을 완료해 주세요.");
			return;
		}

		setError(null);

		const payload = {
			previewUrl,
			items: results,
		};

		setVtoPayload(payload);
		setIsModalOpen(true);
	};

	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState<{ image?: string | null; text?: string }>({});

	const handleItemClick = (item: FashionItem) => {
		setSearchQuery({
			image: item.thumbnailImage || item.croppedImage,
			text: `${item.color} ${item.material} ${item.name} ${item.brand}`,
		});
		setIsSearchModalOpen(true);
	};

	return (
		<div className="min-h-screen bg-black text-white flex">
			{/* Left: Upload */}
			<div className="w-1/2 border-r border-neutral-800 p-8 flex flex-col">
				<h1 className="text-2xl font-semibold mb-6">Studio Upload</h1>

				<form onSubmit={handleAnalyze} className="flex-1 flex flex-col gap-4 justify-between">
					<label className="flex-1 border-2 border-dashed border-neutral-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-neutral-500 transition">
						<div className="flex flex-col items-center gap-3">
							{previewUrl ? (
								// Preview selected image
								<img
									src={previewUrl}
									alt="Uploaded preview"
									className="max-h-80 rounded-xl object-contain"
								/>
							) : (
								<>
									<span className="text-sm text-neutral-400">Click or drag an image here</span>
									<span className="text-xs text-neutral-500">JPG, PNG, etc.</span>
								</>
							)}
						</div>
						<input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
					</label>

					<button
						type="submit"
						disabled={!uploadedFile || loading}
						className="mt-4 h-11 rounded-full bg-white text-black font-semibold disabled:bg-neutral-700 disabled:text-neutral-400">
						{loading ? "Analyzing..." : "Analyze Outfit"}
					</button>

					<div className="mt-4 rounded-xl bg-linear-to-r from-pink-500 to-purple-500 p-px">
						<div className="bg-black rounded-xl px-4 py-3 text-xs text-neutral-300">
							<div className="font-semibold mb-1">AI Stylist Tip</div>
							For best results, use clear, well-lit photos where your full outfit is visible.
						</div>
					</div>

					{error && <p className="mt-2 text-sm text-red-400">{error}</p>}
				</form>
			</div>

			{/* Right: Analysis Results */}
			<div className="w-1/2 p-8 flex flex-col">
				<h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
				<p className="text-xs text-neutral-400 uppercase tracking-[0.2em] mb-4">IDENTIFIED ITEMS</p>

				<div className="flex-1 overflow-y-auto space-y-4 pr-2">
					{results.length === 0 && !loading && (
						<p className="text-sm text-neutral-500">
							업로드 후 &quot;Analyze Outfit&quot; 버튼을 눌러 분석 결과를 확인해 보세요.
						</p>
					)}

					{results.map((item, index) => (
						<div
							key={index}
							onClick={() => handleItemClick(item)}
							className="bg-neutral-900 rounded-2xl overflow-hidden flex cursor-pointer hover:bg-neutral-800 transition group border border-transparent hover:border-neutral-700">
							<div className="w-32 h-40 shrink-0 overflow-hidden flex items-center justify-center bg-neutral-900 relative">
								{item.thumbnailImage || item.croppedImage ? (
									<img
										src={item.thumbnailImage ?? item.croppedImage ?? ""}
										alt={item.name}
										className="max-w-full max-h-full object-contain"
									/>
								) : (
									<div className="w-full h-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500">
										No crop
									</div>
								)}
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
									<span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full border border-white/20">
										Find Similar
									</span>
								</div>
							</div>
							<div className="flex-1 p-3 flex flex-col justify-between">
								<div>
									<div className="text-[11px] text-neutral-500 uppercase">
										{item.brand || "Unknown"}
									</div>
									<div className="text-sm font-semibold">{item.name}</div>
									<div className="text-xs text-neutral-400 mt-1">
										{item.category} · {item.color} · {item.material}
									</div>
								</div>
								<div className="flex items-center justify-between mt-2">
									<div className="text-sm font-semibold">{item.price}</div>
									<div className="text-[11px] px-2 py-1 rounded-full bg-neutral-800 group-hover:bg-neutral-700 transition">
										{typeof item.matchScore === "number"
											? `${item.matchScore.toFixed(0)}% Match`
											: `${item.matchScore}% Match`}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{results.length > 0 && (
					<button
						type="button"
						onClick={handleVisualize}
						className="mt-4 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition">
						Visualize Style (Virtual Try-On)
					</button>
				)}
			</div>

			<VirtualTryOnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} payload={vtoPayload} />

			<ProductSearchModal
				isOpen={isSearchModalOpen}
				onClose={() => setIsSearchModalOpen(false)}
				queryImage={searchQuery.image}
				queryText={searchQuery.text}
			/>
		</div>
	);
};

export default StudioPage;
