import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPtwDetail } from '../../services/mockApi'; // Assuming you have a mock API service for PTW details
import { PTW, PTWStatus, PermitType, RiskLevel, Personnel } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertTriangle, CheckCircle, XCircle, Clock, User, Calendar, FileText, Tag, Shield } from '../icons/LucideIcons';
import { Avatar } from '../ui/Avatar';
import { Separator } from '../ui/Separator';

const statusConfig: Record<PTWStatus, { color: string; label: string; icon: React.ElementType }> = {
    [PTWStatus.DRAFT]: { color: 'bg-gray-100 text-gray-800', label: 'Draft', icon: FileText },
    [PTWStatus.PENDING_APPROVAL]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval', icon: Clock },
    [PTWStatus.APPROVED]: { color: 'bg-green-100 text-green-800', label: 'Approved', icon: CheckCircle },
    [PTWStatus.ACTIVE]: { color: 'bg-blue-100 text-blue-800', label: 'Active', icon: Clock }, // Assuming active is a separate state from approved
    [PTWStatus.CLOSED]: { color: 'bg-gray-100 text-gray-800', label: 'Closed', icon: CheckCircle },
    [PTWStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
};

const riskLevelConfig: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'bg-green-100 text-green-800',
    [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [RiskLevel.HIGH]: 'bg-red-100 text-red-800',
};

const PtwDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [ptw, setPtw] = useState<PTW | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getPtwDetail(id)
            .then(data => {
                setPtw(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching PTW detail:", err);
                setError("Failed to load PTW details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading PTW details...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!ptw) {
        return <div className="text-center text-gray-500">PTW not found.</div>;
    }

    const StatusIcon = statusConfig[ptw.status]?.icon || FileText;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Permit to Work: {ptw.permitNumber}</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Edit</Button>
                    {ptw.status === PTWStatus.APPROVED && (
                         <Button variant="secondary">Close Permit</Button>
                    )}
                     {ptw.status === PTWStatus.ACTIVE && (
                         <Button variant="destructive">Cancel Permit</Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <StatusIcon className={`w-8 h-8 ${statusConfig[ptw.status]?.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                        <div>
                            <CardTitle className="text-2xl">{ptw.title}</CardTitle>
                            <CardDescription className="flex items-center text-sm text-gray-600">
                                <Tag className="w-4 h-4 mr-1"/> Permit Type: {ptw.permitType}
                                <Shield className="w-4 h-4 ml-4 mr-1"/> Risk Level: <Badge className={riskLevelConfig[ptw.riskLevel]}>{ptw.riskLevel}</Badge>
                            </CardDescription>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Issued: {new Date(ptw.issuedDate).toLocaleDateString()}</div>
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Valid From: {new Date(ptw.validFrom).toLocaleString()}</div>
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Valid To: {new Date(ptw.validTo).toLocaleString()}</div>
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Duration: {ptw.durationHours} hours</div>
                         <Badge className={statusConfig[ptw.status].color}><StatusIcon className="w-4 h-4 mr-1"/>{statusConfig[ptw.status].label}</Badge>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Work Details</h3>
                        <p className="text-gray-700">{ptw.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                             <div><strong>Location:</strong> {ptw.location}</div>
                             <div><strong>Equipment:</strong> {ptw.equipment.map(eq => eq.name).join(', ')}</div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                         <h3 className="text-lg font-semibold mb-2 text-gray-700">Assigned Personnel</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {ptw.assignedPersonnel.map((person: Personnel) => (
                                   <Card key={person.id} className="p-4 flex items-center gap-4">
                                        <Avatar src={person.avatar} fallback={person.name.substring(0,2)} className="w-10 h-10"/>
                                        <div>
                                             <div className="font-medium text-gray-900">{person.name}</div>
                                             <div className="text-sm text-gray-600">{person.role}</div>
                                        </div>
                                   </Card>
                              ))}
                         </div>
                    </div>

                    <Separator />

                    <div>
                         <h3 className="text-lg font-semibold mb-2 text-gray-700">Approvals</h3>
                         <div className="space-y-4">
                              {ptw.approvals.map(approval => (
                                   <div key={approval.approver.id} className="flex items-center gap-4">
                                        <Avatar src={approval.approver.avatar} fallback={approval.approver.name.substring(0,2)} className="w-10 h-10"/>
                                        <div>
                                             <div className="font-medium text-gray-900">{approval.approver.name}</div>
                                             <div className="text-sm text-gray-600">
                                                  {approval.approved ? (
                                                       <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Approved</span>
                                                  ) : (
                                                       <span className="text-yellow-600 flex items-center"><Clock className="w-4 h-4 mr-1"/> Pending Approval</span>
                                                  )}
                                                  {approval.approvalDate && ` on ${new Date(approval.approvalDate).toLocaleString()}`}
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>

                     {ptw.safetyPrecautions && ptw.safetyPrecautions.length > 0 && (
                         <>
                             <Separator />
                              <div>
                                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Safety Precautions</h3>
                                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                                       {ptw.safetyPrecautions.map((precaution, index) => (
                                            <li key={index}>{precaution}</li>
                                       ))}
                                  </ul>
                             </div>
                         </>
                     )}

                      {ptw.attachments && ptw.attachments.length > 0 && (
                         <>
                             <Separator />
                              <div>
                                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Attachments</h3>
                                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                                       {ptw.attachments.map((attachment, index) => (
                                            <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.fileName}</a></li>
                                       ))}
                                  </ul>
                             </div>
                         </>
                     )}

                </CardContent>
            </Card>
        </div>
    );
};

export default PtwDetailPage;