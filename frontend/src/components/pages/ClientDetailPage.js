import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClientDetails } from '../../services/mockApi';
import { Client, Contract, ContractStatus } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ArrowLeft, Briefcase, DollarSign, GanttChartSquare } from '../icons/LucideIcons';
import InteractionLog from '../crm/InteractionLog';

const getClientStatus = (client: Client): { status: ContractStatus, text: string } => {
    if (!client || !client.contracts) return { status: ContractStatus.DRAFT, text: 'Prospect' };
    if (client.contracts.length === 0) return { status: ContractStatus.DRAFT, text: 'Prospect' };
    // This logic is simplified for the detail page; a more robust version might be needed
    return { status: ContractStatus.ACTIVE, text: 'Active' }; 
};

const statusConfig: Record<ContractStatus, { color: string }> = {
    [ContractStatus.ACTIVE]: { color: 'bg-green-100 text-green-800' },
    [ContractStatus.EXPIRING_SOON]: { color: 'bg-orange-100 text-orange-800' },
    [ContractStatus.EXPIRED]: { color: 'bg-gray-100 text-gray-800' },
    [ContractStatus.DRAFT]: { color: 'bg-blue-100 text-blue-800' }
};

const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="w-5 h-5 text-gray-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const ClientDetailPage = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('interactions');

    useEffect(() => {
        if (clientId) {
            setLoading(true);
            // This will need to be replaced with an actual API call to your Django backend
            getClientDetails(clientId).then(data => {
                setClient(data);
                setLoading(false);
            });
        }
    }, [clientId]);

    if (loading) {
        return <div>Loading client details...</div>;
    }

    if (!client) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Client not found</h2>
                <Link to="/crm">
                    <Button variant="outline" className="mt-4">Back to CRM</Button>
                </Link>
            </div>
        );
    }
    
    const clientStatus = getClientStatus(client);
    const totalContractValue = client.contracts.reduce((sum, contract) => sum + contract.value, 0);

    const tabs = [
        { id: 'interactions', name: 'Interactions' },
        { id: 'contracts', name: 'Contracts' },
        { id: 'work_orders', name: 'Work Orders' },
        { id: 'invoices', name: 'Invoices' },
    ];
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);


    return (
        <div className="space-y-6">
            <Link to="/crm" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to All Clients
            </Link>
            
            {/* Header */}
            <Card>
                <CardContent className="p-6 flex items-start gap-6">
                    <Avatar src={client.logo} fallback={client.name.substring(0, 2)} className="w-24 h-24 text-3xl rounded-xl" />
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
                            <Badge className={statusConfig[clientStatus.status].color}>{clientStatus.text}</Badge>
                        </div>
                        <p className="text-gray-500 mt-1">{client.industry}</p>
                        <div className="mt-4 border-t pt-4 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Key Contact</p>
                                <p className="font-medium text-gray-800">{client.keyContact.name}</p>
                            </div>
                             <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium text-gray-800">{client.keyContact.email}</p>
                            </div>
                             <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium text-gray-800">{client.keyContact.phone}</p>
                            </div>
                        </div>
                    </div>
                     <Button>Edit Client</Button>
                </CardContent>
            </Card>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Contract Value" value={formatCurrency(totalContractValue)} icon={DollarSign} />
                <StatCard title="Active Contracts" value={client.contracts.filter(c => new Date(c.endDate) >= new Date()).length} icon={Briefcase} />
                <StatCard title="Total Work Orders" value="12" icon={GanttChartSquare} />
            </div>

            {/* Tabs */}
             <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-sbp-brand-500 text-sbp-brand-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

             <div className="mt-6">
                {activeTab === 'interactions' && <InteractionLog interactions={client.interactions} />}
                {activeTab === 'contracts' && (
                     <Card>
                        <CardHeader><CardTitle>Contracts</CardTitle></CardHeader>
                        <CardContent>
                             <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Contract #</th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Value (MYR)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {client.contracts.map(contract => (
                                        <tr key={contract.id}>
                                            <td className="p-4">{contract.number}</td>
                                            <td className="p-4">{new Date(contract.startDate).toLocaleDateString()}</td>
                                            <td className="p-4">{new Date(contract.endDate).toLocaleDateString()}</td>
                                            <td className="p-4">{formatCurrency(contract.value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
                {activeTab !== 'interactions' && activeTab !== 'contracts' && (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">This section is under development.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ClientDetailPage;