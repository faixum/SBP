import React, { useState, useEffect } from 'react';
import { getVessels } from '../../services/mockApi'; // Assuming a mock API for vessels
import { Vessel, VesselStatus } from '../../types'; // Assuming a type definition for Vessel
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Plus, Ship } from '../icons/LucideIcons'; // Assuming Ship icon exists
import { Modal } from '../ui/Modal';
import { VesselForm } from '../vessels/VesselForm'; // Assuming a VesselForm component exists

const vesselStatusConfig: Record<VesselStatus, { color: string; label: string }> = {
    [VesselStatus.OPERATIONAL]: { color: 'bg-green-100 text-green-800', label: 'Operational' },
    [VesselStatus.UNDER_MAINTENANCE]: { color: 'bg-yellow-100 text-yellow-800', label: 'Under Maintenance' },
    [VesselStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
    [VesselStatus.DRYDOCK]: { color: 'bg-blue-100 text-blue-800', label: 'Drydock' },
};

const VesselsPage = () => {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        getVessels().then(data => {
            setVessels(data);
            setLoading(false);
        });
    }, []);

    const handleCreateVessel = (data: any) => {
        console.log("Creating vessel with data:", data);
        // Here you would typically call an API to create the vessel
        // and then refresh the list.
        setIsModalOpen(false);
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
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
                <h2 className="text-3xl font-bold text-gray-800">Vessel Management</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Vessel
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMO Number</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    vessels.map(vessel => (
                                        <tr key={vessel.id} className="hover:bg-gray-50">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Ship className="w-6 h-6 text-gray-500" /> {/* Using Ship icon */}
                                                    <span className="font-medium text-gray-900">{vessel.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{vessel.imoNumber}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{vessel.type}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <Badge className={vesselStatusConfig[vessel.status].color}>{vesselStatusConfig[vessel.status].label}</Badge>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">Edit</Button>
                                                    <Button variant="ghost" size="sm">Details</Button>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vessel">
                <VesselForm
                    onSubmit={handleCreateVessel}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default VesselsPage;