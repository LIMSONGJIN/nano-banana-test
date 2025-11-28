import Card from "../components/Card";

export default function ProjectsPage() {
    const projects = [
        { id: 1, name: "Website Redesign", status: "In Progress", progress: 65, members: 4, dueDate: "Oct 24" },
        { id: 2, name: "Mobile App Launch", status: "Completed", progress: 100, members: 8, dueDate: "Sep 12" },
        { id: 3, name: "Marketing Campaign", status: "Planning", progress: 15, members: 3, dueDate: "Nov 01" },
        { id: 4, name: "Database Migration", status: "In Progress", progress: 45, members: 2, dueDate: "Oct 30" },
        { id: 5, name: "Q4 Roadmap", status: "Review", progress: 90, members: 6, dueDate: "Oct 15" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "Planning": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
            case "Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30">
                    + New Project
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500 transition-colors cursor-pointer">
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{project.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>{project.progress}% Complete</span>
                                <span>Due {project.dueDate}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-4 md:pt-0">
                            <div className="flex -space-x-2">
                                {[...Array(project.members)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
