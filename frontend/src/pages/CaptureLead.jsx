import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, UserPlus } from 'lucide-react';

const CaptureLead = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', source: 'Website' });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (newLead) => api.post('/leads', newLead),
        onSuccess: () => {
            queryClient.invalidateQueries(['leads']);
            queryClient.invalidateQueries(['dashboard-stats']);
            alert('Lead captured successfully!');
            navigate('/leads');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center space-x-3 mb-8 text-primary">
                    <UserPlus className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-gray-800">New Lead Inquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            placeholder="e.g. Rahul Singh"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Source</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        >
                            <option value="Website">Website</option>
                            <option value="Google Forms">Google Forms</option>
                            <option value="Tally Form">Tally Form</option>
                            <option value="Direct Call">Direct Call</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isLoading}
                        className={`w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 ${mutation.isLoading ? 'opacity-50' : ''}`}
                    >
                        {mutation.isLoading ? 'Processing...' : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Capture Lead</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CaptureLead;
