import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { format } from 'date-fns';
import { User, Phone, Tag, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadsList = () => {
    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: async () => {
            const res = await api.get('/leads');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center items-center h-full text-gray-500">Loading Leads...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Leads Directory</h2>
                    <p className="text-gray-500">Manage and track all incoming PG inquiries.</p>
                </div>
                <Link to="/capture" className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2">
                    <span>+ Add Lead</span>
                </Link>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Lead Info</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Assignee</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Captured At</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {leads?.map((lead) => (
                            <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold">
                                            {lead.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{lead.name}</p>
                                            <p className="text-gray-400 flex items-center"><Phone className="w-3 h-3 mr-1" /> {lead.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    <span className="flex items-center"><Tag className="w-3 h-3 mr-2" /> {lead.source}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 uppercase tracking-tight">
                                        {lead.assignedAgent?.name || 'Unassigned'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(lead.leadStatus)}`}>
                                        {lead.leadStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                    <div className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {format(new Date(lead.createdAt), 'MMM d, yyyy')}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/lead/${lead._id}`} className="text-primary hover:underline font-bold flex items-center space-x-1">
                                        <span>View</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusStyles = (status) => {
    switch (status) {
        case 'New Lead': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Booked': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-100';
        case 'Visit Scheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
        default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
};

export default LeadsList;
