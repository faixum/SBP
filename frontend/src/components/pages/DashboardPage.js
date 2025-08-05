import React, { useEffect, useState } from 'react';
import { ClipboardList, Ship, AlertTriangle, Calendar, ArrowUp, ArrowDown } from '../icons/LucideIcons';
import { getDashboardData } from '../../services/mockApi';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, YAxis, CartesianGrid } from 'recharts';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { WorkOrderStatus, Priority } from '../../types';

const statusConfig = {
  NEW: { color: 'bg-blue-100 text-blue-800', label: 'New' },
  ASSIGNED: { color: 'bg-purple-100 text-purple-800', label: 'Assigned' },
  IN_PROGRESS: { color: 'bg-yellow-500 text-white', label: 'In Progress' },
  ON_HOLD: { color: 'bg-orange-500 text-white', label: 'On Hold' },
  COMPLETED: { color: 'bg-green-500 text-white', label: 'Completed' },
  CANCELLED: { color: 'bg-gray-500 text-white', label: 'Cancelled' }
};

const priorityConfig = {
    LOW: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
    NORMAL: { color: 'bg-blue-100 text-blue-800', label: 'Normal' },
    HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High' },
    URGENT: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
    EMERGENCY: { color: 'bg-red-500 text-white', label: 'Emergency' },
};

const statCardConfig = [
    { key: 'activeWorkOrders', title: 'Active Work Orders', icon: ClipboardList, color: 'blue' },
    { key: 'vesselsInPort', title: 'Vessels in Port', icon: Ship, color: 'green' },
    { key: 'upcomingArrivals', title: 'Upcoming Arrivals', icon: Calendar, color: 'amber' },
    { key: 'highPriorityTasks', title: 'High Priority', icon: AlertTriangle, color: 'red' }
];

const StatCard = ({ icon: Icon, title, data, color }) => {
    const isPositive = data?.change?.startsWith('+');
    const colorClasses = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
        red: { bg: 'bg-red-50', text: 'text-red-600' },
    };

    return (
        <Card className={`p-5 flex items-center gap-5 ${colorClasses[color].bg}`}>
            <div className={`p-3 rounded-full bg-white`}>
                <Icon className={`w-6 h-6 ${colorClasses[color].text}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-800">{data?.value ?? '...'}</p>
                    {data?.change && (
                      <div className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                          <span>{data.change}</span>
                      </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // This will need to be replaced with an actual API call to your Django backend
        getDashboardData().then(dashboardData => {
            setData(dashboardData);
            setLoading(false);
        }).catch(() => setLoading(false)); // Handle potential errors
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">Loading dashboard...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Error loading dashboard data.</div>;
    }


    return (
        <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCardConfig.map(config => (
                    <StatCard
                        key={config.key}
                        icon={config.icon}
                        title={config.title}
                        data={data.stats?.[config.key]}
                        color={config.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Chart */}
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Activity</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWorkOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '1rem' }} />
                                    <Area type="monotone" dataKey="workOrders" stroke="#4f46e5" fillOpacity={1} fill="url(#colorWorkOrders)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    {/* Recent High-Priority Work Orders */}
                    <Card className="p-6">
                         <h3 className="text-xl font-semibold text-gray-800 mb-4">High-Priority Work Orders</h3>
                         <div className="space-y-4">
                             {data.highPriorityWorkOrders?.map(wo => (
                                <div key={wo.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full ${priorityConfig[wo.priority]?.color}`}></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{wo.title}</p>
                                            <p className="text-sm text-gray-500">{wo.number} - {wo.customer?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            {wo.assignedTo && <Avatar src={wo.assignedTo.avatar} fallback={wo.assignedTo.name?.substring(0,2)} className="w-8 h-8 ring-2 ring-white" />}
                                        </div>
                                        <Badge className={`${statusConfig[wo.status]?.color} w-24 justify-center`}>{statusConfig[wo.status]?.label}</Badge>
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </div>
                                </div>
                             )) ?? <div className="text-center text-gray-500">No high-priority work orders.</div>}
                         </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Upcoming Vessel Movements */}
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Movements</h3>
                        <div className="space-y-4">
                            {data.upcomingVessels?.map(vessel => (
                                <div key={vessel.id} className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Ship className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{vessel.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Arriving: {vessel.eta ? new Date(vessel.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )) ?? <div className="text-center text-gray-500">No upcoming vessel movements.</div>}
                        </div>
                    </Card>
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button className="w-full">Create New Work Order</Button>
                            <Button variant="outline" className="w-full">Register New Vessel</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;