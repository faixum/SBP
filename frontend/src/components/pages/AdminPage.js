import React, { useState, useEffect } from 'react';
import { getSystemUsers } from '../../services/mockApi'; // Assuming mockApi exists
import { SystemUser, UserRole, UserStatus } from '../../types'; // Assuming types exist
import { Button } from '../ui/Button'; // Assuming Button component exists
import { Plus, User, Shield, SlidersHorizontal } from '../icons/LucideIcons'; // Assuming LucideIcons exist
import { Card, CardContent } from '../ui/Card'; // Assuming Card component exists
import { Avatar } from '../ui/Avatar'; // Assuming Avatar component exists
import { Badge } from '../ui/Badge'; // Assuming Badge component exists

// Define these enums or types in your types file
// enum UserRole { ADMINISTRATOR = 'ADMINISTRATOR', ... }
// enum UserStatus { ACTIVE = 'ACTIVE', ... }
// interface SystemUser { id: string | number; name: string; email: string; avatar?: string; role: UserRole; status: UserStatus; lastLogin: string; }


const roleConfig = {
    [UserRole.ADMINISTRATOR]: { color: 'bg-red-100 text-red-800', label: 'Administrator' },
    [UserRole.OPERATIONS_MANAGER]: { color: 'bg-purple-100 text-purple-800', label: 'Ops Manager' },
    [UserRole.SAFETY_OFFICER]: { color: 'bg-yellow-100 text-yellow-800', label: 'Safety Officer' },
    [UserRole.FINANCE_CLERK]: { color: 'bg-blue-100 text-blue-800', label: 'Finance Clerk' },
    [UserRole.LOGISTICS_COORDINATOR]: { color: 'bg-green-100 text-green-800', label: 'Coordinator' },
    [UserRole.TECHNICIAN]: { color: 'bg-indigo-100 text-indigo-800', label: 'Technician' },
};

const statusConfig = {
    [UserStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', label: 'Active' },
    [UserStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
};

const UserManagementTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Replace with actual API call to your Django backend
        getSystemUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full"></div><div><div className="h-4 bg-gray-200 rounded w-28 mb-1"></div><div className="h-3 bg-gray-200 rounded w-36"></div></div></div></td>
            <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-32"></div></td>
            <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4"><div className="flex gap-2"><div className="w-16 h-9 bg-gray-200 rounded-md"></div><div className="w-24 h-9 bg-gray-200 rounded-md"></div></div></td>
        </tr>
    );

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={user.avatar} fallback={user.name.substring(0, 2)} className="w-10 h-10" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <Badge className={roleConfig[user.role].color}>{roleConfig[user.role].label}</Badge>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <Badge className={statusConfig[user.status].color}>{statusConfig[user.status].label}</Badge>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.lastLogin).toLocaleString('en-GB')}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button variant="ghost" size="sm" className="text-danger-500 hover:text-danger-900 hover:bg-danger-50">Deactivate</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

const PlaceholderTab = ({ title }) => (
    <div className="text-center py-20 bg-gray-50 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-gray-500 mt-2">This feature is under development and will be available soon.</p>
    </div>
);


const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', name: 'User Management', icon: User },
        { id: 'roles', name: 'Role Management', icon: Shield },
        { id: 'settings', name: 'System Settings', icon: SlidersHorizontal },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">System Administration</h2>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Add New User
                </Button>
            </div>

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
                                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'users' && <UserManagementTab />}
                {activeTab === 'roles' && <PlaceholderTab title="Role & Permission Management" />}
                {activeTab === 'settings' && <PlaceholderTab title="Global System Settings" />}
            </div>
        </div>
    );
};

export default AdminPage;