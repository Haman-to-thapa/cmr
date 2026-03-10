import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { LayoutDashboard, Users, Calendar, ArrowRightCircle } from 'lucide-react';

const STAGES = [
    'New Lead',
    'Contacted',
    'Requirement Collected',
    'Property Suggested',
    'Visit Scheduled',
    'Visit Completed',
    'Booked',
    'Lost'
];

const Pipeline = () => {
    const queryClient = useQueryClient();
    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: async () => {
            const res = await api.get('/leads');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/leads/${id}/status`, { status }),
        onSuccess: () => queryClient.invalidateQueries(['leads']),
    });

    if (isLoading) return <div className="flex justify-center items-center h-full text-gray-500">Loading Pipeline...</div>;

    return (
        <div className="h-full flex flex-col space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-gray-800">Sales Pipeline</h2>
                <p className="text-gray-500">Drag or click leads to progress them through the funnel.</p>
            </header>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex space-x-6 h-full min-w-max">
                    {STAGES.map((stage) => (
                        <div key={stage} className="w-80 bg-gray-100 rounded-3xl p-4 flex flex-col space-y-4 border border-gray-200">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{stage}</h3>
                                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-400">
                                    {leads?.filter(l => l.leadStatus === stage).length || 0}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                                {leads?.filter(l => l.leadStatus === stage).map((lead) => (
                                    <div key={lead._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group relative">
                                        <p className="font-bold text-gray-800 text-lg mb-1">{lead.name}</p>
                                        <p className="text-xs text-gray-400 font-medium mb-3">{lead.phone}</p>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                            <div className="flex items-center -space-x-2">
                                                <div className="w-7 h-7 bg-blue-50 text-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                                    {lead.assignedAgent?.name[0] || '?'}
                                                </div>
                                            </div>

                                            {stage !== 'Booked' && stage !== 'Lost' && (
                                                <button
                                                    onClick={() => {
                                                        const nextStage = STAGES[STAGES.indexOf(stage) + 1];
                                                        mutation.mutate({ id: lead._id, status: nextStage });
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 text-primary hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold"
                                                >
                                                    <span>Move</span>
                                                    <ArrowRightCircle className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pipeline;
