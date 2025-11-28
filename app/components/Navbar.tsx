import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                            NanoBanana AI
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-6">
                                <Link href="/studio" className="text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Studio
                                </Link>
                                <Link href="/wardrobe" className="text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Wardrobe
                                </Link>
                                <Link href="/shop" className="text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Shop
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="hidden sm:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-lg">
                            Try Premium
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
