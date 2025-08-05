import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { getAllCustomers, getAllVessels } from '../../services/mockApi'; // Assuming these exist
import { Customer, Vessel } from '../../types'; // Assuming types are defined
import { Loader2 } from '../icons/LucideIcons'; // Assuming loader icon exists

interface CargoFormProps {
    onSubmit: (data: any) => void; // Replace 'any' with a more specific type if possible
    onCancel: () => void;
    initialData?: any; // Optional: for editing existing cargo
}

export const CargoForm: React.FC<CargoFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        manifestNumber: '',
        description: '',
        weight: '',
        storageLocation: '',
        isDangerousGoods: false,
        unNumber: '',
        customerId: '',
        vesselId: '' // Optional
    });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [loadingVessels, setLoadingVessels] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load customers and vessels on component mount
        setLoadingCustomers(true);
        getAllCustomers().then(data => {
            setCustomers(data);
            setLoadingCustomers(false);
        });

        setLoadingVessels(true);
        getAllVessels().then(data => {
            setVessels(data);
            setLoadingVessels(false);
        });

        // If initialData is provided, populate the form
        if (initialData) {
            setFormData({
                manifestNumber: initialData.manifestNumber || '',
                description: initialData.description || '',
                weight: initialData.weight ? String(initialData.weight) : '',
                storageLocation: initialData.storageLocation || '',
                isDangerousGoods: initialData.isDangerousGoods || false,
                unNumber: initialData.unNumber || '',
                customerId: initialData.customer?.id || '',
                vesselId: initialData.vessel?.id || ''
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prevData => ({
            ...prevData,
            isDangerousGoods: checked,
            unNumber: checked ? prevData.unNumber : '' // Clear UN number if not DG
        }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Basic validation (can be expanded)
        if (!formData.manifestNumber || !formData.description || !formData.weight || !formData.storageLocation || !formData.customerId) {
            alert('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }

        const dataToSubmit = {
            ...formData,
            weight: parseFloat(formData.weight), // Convert weight to number
        };

        onSubmit(dataToSubmit);
        // Note: onSubmit is expected to handle setting isSubmitting(false) after its async operation
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="manifestNumber">Manifest Number</Label>
                <Input id="manifestNumber" value={formData.manifestNumber} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={handleChange} required rows={3} />
            </div>
            <div>
                <Label htmlFor="weight">Weight (Tonnes)</Label>
                <Input id="weight" type="number" value={formData.weight} onChange={handleChange} required step="0.01" />
            </div>
            <div>
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input id="storageLocation" value={formData.storageLocation} onChange={handleChange} required />
            </div>

            <div>
                <Label htmlFor="customerId">Customer</Label>
                {loadingCustomers ? (
                    <div className="text-sm text-gray-500">Loading customers...</div>
                ) : (
                    <Select onValueChange={(value) => handleSelectChange('customerId', value)} value={formData.customerId} required>
                        <SelectTrigger id="customerId">
                            <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {customers.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

             <div>
                <Label htmlFor="vesselId">Assign to Vessel (Optional)</Label>
                {loadingVessels ? (
                     <div className="text-sm text-gray-500">Loading vessels...</div>
                ) : (
                    <Select onValueChange={(value) => handleSelectChange('vesselId', value)} value={formData.vesselId}>
                        <SelectTrigger id="vesselId">
                            <SelectValue placeholder="Select a vessel" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="">Not Assigned</SelectItem> {/* Option for no vessel */}
                            {vessels.map(vessel => (
                                <SelectItem key={vessel.id} value={vessel.id}>{vessel.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>


            <div className="flex items-center justify-between">
                <Label htmlFor="isDangerousGoods">Dangerous Goods</Label>
                <Switch
                    id="isDangerousGoods"
                    checked={formData.isDangerousGoods}
                    onCheckedChange={handleSwitchChange}
                />
            </div>

            {formData.isDangerousGoods && (
                <div>
                    <Label htmlFor="unNumber">UN Number</Label>
                    <Input id="unNumber" value={formData.unNumber} onChange={handleChange} required={formData.isDangerousGoods} />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {initialData ? 'Update Cargo' : 'Create Cargo'}
                </Button>
            </div>
        </form>
    );
};