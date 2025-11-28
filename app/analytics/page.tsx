import Card from "../components/Card";

export default function AnalyticsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last year</option>
                    </select>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card title="Traffic Sources" className="lg:col-span-2">
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 70, 45, 90, 65, 85, 55, 45, 60, 75, 50, 80].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-400"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                                    {h * 124} visits
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </Card>
                <Card title="Device Breakdown">
                    <div className="flex flex-col justify-center h-64 space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Desktop</span>
                                <span className="font-medium">55%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Mobile</span>
                                <span className="font-medium">35%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Tablet</span>
                                <span className="font-medium">10%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <p className="text-sm text-gray-500">Bounce Rate</p>
                    <p className="text-2xl font-bold mt-1">42.3%</p>
                    <p className="text-xs text-red-500 mt-1">↓ 2.1%</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500">Avg. Session</p>
                    <p className="text-2xl font-bold mt-1">4m 32s</p>
                    <p className="text-xs text-green-500 mt-1">↑ 12s</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500">Pages / Session</p>
                    <p className="text-2xl font-bold mt-1">3.45</p>
                    <p className="text-xs text-green-500 mt-1">↑ 0.2</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500">New Users</p>
                    <p className="text-2xl font-bold mt-1">892</p>
                    <p className="text-xs text-green-500 mt-1">↑ 12%</p>
                </Card>
            </div>
        </div>
    );
}
