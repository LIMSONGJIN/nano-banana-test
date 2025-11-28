import ProductCard from "../components/ProductCard";

export default function ShopPage() {
    const recommendations = [
        { id: 1, name: "Velvet Blazer", brand: "Gucci", price: "$2,400", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" },
        { id: 2, name: "Silk Scarf", brand: "Hermès", price: "$450", image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?w=500&q=80" },
        { id: 3, name: "Leather Tote", brand: "Prada", price: "$1,850", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80" },
        { id: 4, name: "Wool Coat", brand: "Burberry", price: "$2,100", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Shop Recommendations</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendations.map((item) => (
                    <ProductCard
                        key={item.id}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}
