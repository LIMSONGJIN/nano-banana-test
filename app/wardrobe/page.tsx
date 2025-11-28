import ProductCard from "../components/ProductCard";

export default function WardrobePage() {
    const savedItems = [
        { id: 1, name: "Oversized Leather Jacket", brand: "Zara", price: "$89.90", image: "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?w=500&q=80" },
        { id: 2, name: "Vintage Denim Jeans", brand: "Levi's", price: "$120.00", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80" },
        { id: 3, name: "Silk Slip Dress", brand: "Reformation", price: "$198.00", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80" },
        { id: 4, name: "Chunky Knit Sweater", brand: "H&M", price: "$34.99", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" },
        { id: 5, name: "Classic White Tee", brand: "Uniqlo", price: "$14.90", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
        { id: 6, name: "Pleated Midi Skirt", brand: "Mango", price: "$59.99", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Wardrobe</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {savedItems.length} items saved from your style analysis
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Filter
                    </button>
                    <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Create Outfit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                    <ProductCard
                        key={item.id}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}
