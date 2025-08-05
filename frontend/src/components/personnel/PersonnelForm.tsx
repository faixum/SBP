import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PersonnelStatus, Certification } from '../../types';

interface PersonnelFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialData?: any; // Optional initial data for editing
}

export function PersonnelForm({ onSubmit, onCancel, initialData }: PersonnelFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        status: PersonnelStatus.ACTIVE,
        certifications: [] as Certification[],
        ...initialData, // Merge initial data if provided
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation (can be expanded)
        if (!formData.name || !formData.role || !formData.email || !formData.phone) {
            alert('Please fill in all required fields.');
            return;
        }
        onSubmit(formData);
    };

    const handleAddCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, { name: '', expiryDate: new Date() }]
        }));
    };

    const handleCertificationChange = (index: number, field: keyof Certification, value: string | Date) => {
        const newCertifications = [...formData.certifications];
        newCertifications[index] = {
            ...newCertifications[index],
            [field]: value
        };
        setFormData(prev => ({ ...prev, certifications: newCertifications }));
    };

    const handleRemoveCertification = (index: number) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Personnel Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g., Crane Operator"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="e.g., john.doe@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="e.g., +60 12 345 6789"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PersonnelStatus }))}
                        >
                            {Object.values(PersonnelStatus).map(status => (
                                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                            ))}
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Certifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.certifications.map((cert, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor={`certName-${index}`}>Certification Name</Label>
                                <Input
                                    id={`certName-${index}`}
                                    value={cert.name}
                                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                    placeholder="e.g., Forklift Operator License"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor={`certExpiry-${index}`}>Expiry Date</Label>
                                <Input
                                    id={`certExpiry-${index}`}
                                    type="date"
                                    value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleCertificationChange(index, 'expiryDate', new Date(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => handleRemoveCertification(index)}
                                    className="text-danger-600 border-danger-500 hover:bg-danger-100 hover:text-danger-900"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={handleAddCertification} className="w-full">
                        Add Certification
                    </Button>
                </CardContent>
            </Card>


            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" className="min-w-32">
                    {initialData ? 'Update Personnel' : 'Add Personnel'}
                </Button>
            </div>
        </form>
    );
}