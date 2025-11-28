import Link from "next/link";
import Card from "./components/Card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="space-y-8 relative">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          <h1 className="relative text-6xl sm:text-8xl font-black tracking-tighter">
            Wear the <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Future</span>
          </h1>
          <p className="relative text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Your personal AI stylist is here. Upload a photo, analyze your look, and virtually try on the latest trends in seconds.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/studio"
              className="rounded-full bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-lg font-bold transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Start Styling
            </Link>
            <Link
              href="/wardrobe"
              className="rounded-full border-2 border-gray-200 dark:border-gray-800 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 px-10 py-4 text-lg font-bold transition-all"
            >
              My Wardrobe
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-12">
          <Card className="text-left group hover:border-pink-500/50 transition-colors">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Snap & Analyze</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload any photo and let our AI identify brands, fabrics, and styles instantly.
            </p>
          </Card>

          <Card className="text-left group hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Virtual Try-On</h3>
            <p className="text-gray-600 dark:text-gray-400">
              See how clothes look on you before you buy with our advanced AR technology.
            </p>
          </Card>

          <Card className="text-left group hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Shop</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized recommendations and shop the look directly from your analysis.
            </p>
          </Card>
        </div>

      </main>
    </div>
  );
}
