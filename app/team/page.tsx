import Card from "../components/Card";

export default function TeamPage() {
    const team = [
        { id: 1, name: "Sarah Connor", role: "Product Manager", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { id: 2, name: "John Smith", role: "Lead Developer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
        { id: 3, name: "Emily Chen", role: "UI/UX Designer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
        { id: 4, name: "Michael Brown", role: "Backend Engineer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
        { id: 5, name: "Jessica Wu", role: "Frontend Developer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
        { id: 6, name: "David Wilson", role: "DevOps Engineer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
        { id: 7, name: "Lisa Anderson", role: "QA Engineer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" },
        { id: 8, name: "Robert Taylor", role: "Data Scientist", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Team Members</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30">
                        + Add Member
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                    <Card key={member.id} className="flex flex-col items-center text-center p-6 hover:border-indigo-500 transition-colors group">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800 ring-4 ring-gray-50 dark:ring-gray-900 group-hover:ring-indigo-50 dark:group-hover:ring-indigo-900/20 transition-all">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4">{member.role}</p>

                        <div className="flex gap-2 w-full mt-auto">
                            <button className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-xs font-medium transition-colors">
                                Profile
                            </button>
                            <button className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-xs font-medium transition-colors">
                                Message
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
