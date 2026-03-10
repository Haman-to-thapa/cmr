import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { format } from 'date-fns';
import { User, Phone, Tag, Calendar, Home, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const LeadDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [visitForm, setVisitForm] = useState({ propertyName: '', visitDate: '', visitTime: '' });

    const { data, isLoading } = useQuery({
        queryKey: ['lead', id],
        queryFn: async () => {
            const res = await api.get(`/leads/${id}`);
            return res.data;
        }
    });

    const visitMutation = useMutation({
        mutationFn: (newVisit) => api.post('/visits', { ...newVisit, leadId: id }),
        onSuccess: () => {
            queryClient.invalidateQueries(['lead', id]);
            alert('Visit scheduled!');
            setVisitForm({ propertyName: '', visitDate: '', visitTime: '' });
        }
    });

    if (isLoading) return <div className="flex justify-center items-center h-full text-gray-500">Loading Lead Details...</div>;

    const { lead, activities } = data || {};

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">{lead.name}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-gray-500">
                        <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {lead.phone}</span>
                        <span className="flex items-center"><Tag className="w-4 h-4 mr-2" /> {lead.source}</span>
                    </div>
                </div>
                <div className="bg-primary text-white px-6 py-2 rounded-2xl font-bold text-lg">
                    {lead.leadStatus}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                            <Clock className="w-5 h-5 mr-3 text-primary" />
                            Activity Timeline
                        </h3>
                        <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {activities?.map((activity, i) => (
                                <div key={i} className="relative pl-12 group">
                                    <div className="absolute left-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white z-10">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium group-hover:text-primary transition-colors">{activity.action}</p>
                                        <p className="text-gray-400 text-sm mt-1">{format(new Date(activity.timestamp), 'MMM d, yyyy · p')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <Home className="w-5 h-5 mr-3 text-secondary" />
                            Schedule Visit
                        </h3>
                        <form onSubmit={(e) => { e.preventDefault(); visitMutation.mutate(visitForm); }} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Property Name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary transition-all outline-none"
                                value={visitForm.propertyName}
                                onChange={(e) => setVisitForm({ ...visitForm, propertyName: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary transition-all outline-none"
                                value={visitForm.visitDate}
                                onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                                required
                            />
                            <input
                                type="time"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary transition-all outline-none"
                                value={visitForm.visitTime}
                                onChange={(e) => setVisitForm({ ...visitForm, visitTime: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                disabled={visitMutation.isLoading}
                            >
                                {visitMutation.isLoading ? 'Scheduling...' : 'Confirm Visit'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Assigned Agent</h3>
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                                {lead.assignedAgent?.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{lead.assignedAgent?.name || 'Unassigned'}</p>
                                <p className="text-gray-400 text-sm">{lead.assignedAgent?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
