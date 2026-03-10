import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Users, Calendar, CheckCircle, BarChart3, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const res = await api.get('/dashboard');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center items-center h-full text-gray-500">Loading Dashboard...</div>;

    const stats = [
        { label: 'Total Leads', value: data?.totalLeads || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Visits Scheduled', value: data?.visitsScheduled || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Bookings Confirmed', value: data?.bookings || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Conversion Rate', value: `${data?.totalLeads ? ((data.bookings / data.totalLeads) * 100).toFixed(1) : 0}%`, icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gharpayy Dashboard</h2>
                    <p className="text-gray-500">Overview of your lead pipeline and agent performance.</p>
                </div>
                <Link to="/capture" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center space-x-2 active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    <span>Capture Lead</span>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Leads by Status</h3>
                <div className="space-y-4">
                    {data?.leadsByStatus?.map((status, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">{status._id}</span>
                            <div className="flex items-center space-x-4 flex-1 mx-8">
                                <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(status.count / data.totalLeads) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-400 w-8 text-right font-semibold">{status.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
