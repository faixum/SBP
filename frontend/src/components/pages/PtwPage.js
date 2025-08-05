import React, { useState, useEffect } from 'react';
import { getPermitToWork } from '../../services/mockApi';
import { PermitToWork, PermitToWorkStatus, RiskLevel } from '../../types';
import { Button } from '../ui/Button';
import { Plus } from '../icons/LucideIcons';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

const ptwStatusConfig: Record<PermitToWorkStatus, { color: string; label: string }> = {
    [PermitToWorkStatus.DRAFT]: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    [PermitToWorkStatus.PENDING_APPROVAL]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
    [PermitToWorkStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', label: 'Active' },
    [PermitToWorkStatus.CLOSED]: { color: 'bg-blue-100 text-blue-800', label: 'Closed' },
    [PermitToWorkStatus.EXPIRED]: { color: 'bg-danger-100 text-danger-600', label: 'Expired' },
    [PermitToWorkStatus.REJECTED]: { color: 'bg-danger-100 text-danger-600', label: 'Rejected' },
};

const riskLevelConfig: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'Low',
    [RiskLevel.MEDIUM]: 'Medium',
    [RiskLevel.HIGH]: 'High',
};

const PtwPage = () => {
    const [permits, setPermits] = useState<PermitToWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPermitToWork().then(data => {
            setPermits(data);
            setLoading(false);
        });
    }, []);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-28"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="p-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="p-4 whitespace-nowrap">
                <div className="flex gap-2">
                    <div className="w-16 h-9 bg-gray-200 rounded-md"></div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Permit to Work (PTW)</h2>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create New PTW
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTW #</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    permits.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="p-4 whitespace-nowrap font-mono text-sm text-gray-600">{p.number}</td>
                                            <td className="p-4 whitespace-nowrap font-medium text-gray-900">{p.title}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{p.location}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{p.type}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <Badge className={ptwStatusConfig[p.status].color}>
                                                    {ptwStatusConfig[p.status].label}
                                                </Badge>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{riskLevelConfig[p.riskAssessment.reduce((maxLevel, item) => Math.max(maxLevel, item.level), RiskLevel.LOW)]}</td> {/* Assuming risk level is the highest level in assessment */}
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.validTo).toLocaleDateString('en-GB')}</td>
                                            <td className="p-4 whitespace-nowrap text-sm font-medium">
                                                <Link to={`/safety/ptw/${p.id}`}>
                                                    <Button variant="outline" size="sm">Details</Button>
                                                </Link>
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

export default PtwPage;