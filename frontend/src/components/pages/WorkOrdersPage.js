import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkOrders } from '../../services/mockApi';
import { WorkOrder, WorkOrderStatus, Priority } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Plus } from '../icons/LucideIcons';

const workOrderStatusConfig: Record<WorkOrderStatus, { color: string; label: string }> = {
    [WorkOrderStatus.OPEN]: { color: 'bg-blue-100 text-blue-800', label: 'Open' },
    [WorkOrderStatus.IN_PROGRESS]: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
    [WorkOrderStatus.CLOSED]: { color: 'bg-green-100 text-green-800', label: 'Closed' },
    [WorkOrderStatus.CANCELLED]: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
};

const priorityConfig: Record<Priority, string> = {
    [Priority.LOW]: 'Low',
    [Priority.NORMAL]: 'Normal',
    [Priority.HIGH]: 'High',
    [Priority.URGENT]: 'Urgent',
    [Priority.EMERGENCY]: 'Emergency',
};

const WorkOrdersPage = () => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getWorkOrders().then(data => {
            setWorkOrders(data);
            setLoading(false);
        });
    }, []);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
            <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
            <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-28"></div></td>
            <td className="p-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200"></div><div className="h-4 bg-gray-200 rounded w-24"></div></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
            <td className="p-4"><div className="w-16 h-9 bg-gray-200 rounded-md"></div></td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Work Orders</h2>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create New WO
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Work Orders</CardTitle>
                    {/* Add filters here in the future */}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">WO #</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    workOrders.map((wo) => (
                                        <tr key={wo.id} className="hover:bg-gray-50">
                                            <td className="p-4 whitespace-nowrap font-mono text-sm text-gray-600">{wo.number}</td>
                                            <td className="p-4 whitespace-nowrap font-medium text-gray-900">{wo.title}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{wo.asset.name}</td>
                                            <td className="p-4 whitespace-nowrap"><Badge className={workOrderStatusConfig[wo.status].color}>{workOrderStatusConfig[wo.status].label}</Badge></td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{priorityConfig[wo.priority]}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={wo.assignedTo.avatar} fallback={wo.assignedTo.name.substring(0,2)} className="w-8 h-8"/>
                                                    <span className="text-sm">{wo.assignedTo.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{new Date(wo.dueDate).toLocaleDateString('en-GB')}</td>
                                            <td className="p-4 whitespace-nowrap text-sm font-medium">
                                                <Button variant="outline" size="sm">Details</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkOrdersPage;