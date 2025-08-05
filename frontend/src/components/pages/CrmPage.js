import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../../services/mockApi';
import { Client, ContractStatus } from '../../types';
import { Button } from '../ui/Button';
import { Plus } from '../icons/LucideIcons';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

const getClientStatus = (client: Client): { status: ContractStatus, text: string } => {
    if (client.contracts.length === 0) {
        return { status: ContractStatus.DRAFT, text: 'Prospect' };
    }

    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    let hasActive = false;
    let hasExpiringSoon = false;

    for (const contract of client.contracts) {
        const endDate = new Date(contract.endDate);
        if (endDate < now) continue; // Skip expired contracts for status check

        if (endDate >= now) {
            hasActive = true;
            if (endDate < ninetyDaysFromNow) {
                hasExpiringSoon = true;
            }
        }
    }

    if (hasExpiringSoon) return { status: ContractStatus.EXPIRING_SOON, text: 'Expiring Soon' };
    if (hasActive) return { status: ContractStatus.ACTIVE, text: 'Active' };

    return { status: ContractStatus.EXPIRED, text: 'Inactive' };
};

const statusConfig: Record<ContractStatus, { color: string }> = {
    [ContractStatus.ACTIVE]: { color: 'bg-green-100 text-green-800' },
    [ContractStatus.EXPIRING_SOON]: { color: 'bg-orange-100 text-orange-800' },
    [ContractStatus.EXPIRED]: { color: 'bg-gray-100 text-gray-800' },
    [ContractStatus.DRAFT]: { color: 'bg-blue-100 text-blue-800' }
};

const CrmPage = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        // This will need to be replaced with an actual API call to your Django backend
        getClients().then(data => {
            setClients(data);
            setLoading(false);
        });
    }, []);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-36"></div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4 whitespace-nowrap">
                <div className="flex gap-2">
                    <div className="w-24 h-9 bg-gray-200 rounded-md"></div>
                    <div className="w-28 h-9 bg-gray-200 rounded-md"></div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Customer Relationship Management</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Client
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Contact</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Interaction</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    clients.map(client => {
                                        const clientStatus = getClientStatus(client);
                                        return (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar src={client.logo} fallback={client.name.substring(0, 2)} className="w-10 h-10" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{client.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="font-medium text-gray-800">{client.keyContact.name}</div>
                                                    <div className="text-gray-500">{client.keyContact.email}</div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">{client.industry}</td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <Badge className={statusConfig[clientStatus.status].color}>
                                                        {clientStatus.text}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(client.lastInteraction).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Link to={`/crm/${client.id}`}>
                                                            <Button variant="outline" size="sm">Details</Button>
                                                        </Link>
                                                        <Button variant="ghost" size="sm">Log Interaction</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Placeholder for future modal */}
        </div>
    );
};

export default CrmPage;