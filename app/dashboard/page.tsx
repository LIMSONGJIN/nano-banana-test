import Card from "../components/Card";

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="border-l-4 border-indigo-500">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold mt-1">$45,231.89</p>
                    <p className="text-xs text-green-500 mt-2">↑ 20.1% from last month</p>
                </Card>
                <Card className="border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold mt-1">+2350</p>
                    <p className="text-xs text-green-500 mt-2">↑ 180.1% from last month</p>
                </Card>
                <Card className="border-l-4 border-pink-500">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sales</p>
                    <p className="text-2xl font-bold mt-1">+12,234</p>
                    <p className="text-xs text-green-500 mt-2">↑ 19% from last month</p>
                </Card>
                <Card className="border-l-4 border-orange-500">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Now</p>
                    <p className="text-2xl font-bold mt-1">+573</p>
                    <p className="text-xs text-gray-500 mt-2">+201 since last hour</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Recent Activity">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                                        U{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">User {i} made a purchase</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-green-600">+$250.00</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="System Status">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Server Uptime</span>
                            <span className="text-sm font-medium text-green-500">99.9%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">Database Load</span>
                            <span className="text-sm font-medium text-yellow-500">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">Memory Usage</span>
                            <span className="text-sm font-medium text-indigo-500">32%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
