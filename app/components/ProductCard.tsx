import Image from 'next/image';

interface ProductCardProps {
    image: string;
    name: string;
    price: string;
    brand: string;
    matchScore?: number;
}

export default function ProductCard({ image, name, price, brand, matchScore }: ProductCardProps) {
    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {matchScore && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                        {matchScore}% Match
                    </div>
                )}
                <button className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{brand}</p>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{price}</span>
                    <button className="text-xs font-medium text-pink-600 dark:text-pink-400 hover:underline">
                        Try On
                    </button>
                </div>
            </div>
        </div>
    );
}
