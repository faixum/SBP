import React, { useState, useEffect } from 'react';
import { getPersonnel } from '../../services/mockApi';
import { Personnel, PersonnelStatus, Certification } from '../../types';
import { Button } from '../ui/Button';
import { Plus, AlertTriangle } from '../icons/LucideIcons';
import { Modal } from '../ui/Modal';
import { PersonnelForm } from '../personnel/PersonnelForm';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

const statusConfig: Record<PersonnelStatus, { color: string; label: string }> = {
    [PersonnelStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', label: 'Active' },
    [PersonnelStatus.ON_LEAVE]: { color: 'bg-yellow-100 text-yellow-800', label: 'On Leave' },
    [PersonnelStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' }
};

const getCertificationStatus = (certs: Certification[]) => {
    if (certs.length === 0) {
        return { text: 'N/A', color: 'bg-gray-100 text-gray-800', icon: false };
    }
    
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    let hasExpired = false;
    let hasExpiringSoon = false;

    for (const cert of certs) {
        if (cert.expiryDate < now) {
            hasExpired = true;
            break;
        }
        if (cert.expiryDate < ninetyDaysFromNow) {
            hasExpiringSoon = true;
        }
    }

    if (hasExpired) {
        return { text: 'Expired', color: 'bg-red-100 text-red-800', icon: true };
    }
    if (hasExpiringSoon) {
        return { text: 'Expiring Soon', color: 'bg-orange-100 text-orange-800', icon: true };
    }
    return { text: 'All Valid', color: 'bg-green-100 text-green-800', icon: false };
};


const PersonnelPage = () => {
    const [personnel, setPersonnel] = useState<Personnel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPersonnel().then(data => {
            setPersonnel(data);
            setLoading(false);
        });
    }, []);

    const handleCreatePersonnel = (data: any) => {
        console.log("Creating personnel with data:", data);
        // Here you would typically call an API to create the personnel
        // and then refresh the list.
        setIsModalOpen(false);
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="p-4 whitespace-nowrap">
                <div className="flex gap-2">
                    <div className="w-16 h-9 bg-gray-200 rounded-md"></div>
                    <div className="w-16 h-9 bg-gray-200 rounded-md"></div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Personnel Management</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Personnel
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certifications</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    personnel.map(p => {
                                        const certStatus = getCertificationStatus(p.certifications);
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar src={p.avatar} fallback={p.name.substring(0, 2)} className="w-10 h-10" />
                                                        <span className="font-medium text-gray-900">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">{p.role}</td>
                                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>{p.contact.email}</div>
                                                    <div>{p.contact.phone}</div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <Badge className={certStatus.color}>
                                                        {certStatus.icon && <AlertTriangle className="w-3 h-3 mr-1.5" />}
                                                        {certStatus.text}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <Badge className={statusConfig[p.status].color}>{statusConfig[p.status].label}</Badge>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">Edit</Button>
                                                        <Button variant="ghost" size="sm">Details</Button>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Personnel">
                <PersonnelForm
                    onSubmit={handleCreatePersonnel}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default PersonnelPage;