import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    fallback: string;
}

export const Avatar = ({ src, fallback, className, ...props }: AvatarProps) => {
    const [hasError, setHasError] = React.useState(!src);

    React.useEffect(() => {
        setHasError(!src);
    }, [src]);
    
    // Ensure fallback is a string and has content
    const fallbackText = typeof fallback === 'string' && fallback ? fallback.substring(0, 2).toUpperCase() : '??';

    return (
        <div className={`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-gray-200 ${className || ''}`} {...props}>
            {!hasError && src ? (
                <img 
                    src={src} 
                    alt="avatar" 
                    className="aspect-square h-full w-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <span className="text-sm font-medium text-gray-600">
                    {fallbackText}
                </span>
            )}
        </div>
    );
};import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Plus, X, AlertTriangle } from '../icons/LucideIcons';
import { RiskLevel } from '../../types';

interface PtwFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function PtwForm({ onSubmit, onCancel, initialData }: PtwFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    workScope: '',
    validFrom: '',
    validTo: '',
    riskAssessment: [],
    ...initialData
  });

  const [newRiskItem, setNewRiskItem] = useState({ hazard: '', control: '', level: RiskLevel.LOW });

  const addRiskItem = () => {
    if (newRiskItem.hazard.trim() && newRiskItem.control.trim()) {
      setFormData(prev => ({
        ...prev,
        riskAssessment: [...prev.riskAssessment, newRiskItem]
      }));
      setNewRiskItem({ hazard: '', control: '', level: RiskLevel.LOW });
    }
  };

  const removeRiskItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      riskAssessment: prev.riskAssessment.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'validFrom' | 'validTo') => {
    const date = new Date(e.target.value);
    // Set time to noon (12:00 PM) to avoid timezone issues with API/backend if not handling timezones explicitly
    date.setHours(12, 0, 0, 0);
    setFormData(prev => ({ ...prev, [field]: date.toISOString().split('T')[0] })); // Store as YYYY-MM-DD string
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Permit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Work Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Welding on Platform Deck"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Permit Type</Label>
              <Select id="type" required value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}>
                <option value="" disabled>Select permit type</option>
                <option value="Hot Work">Hot Work</option>
                <option value="Confined Space">Confined Space</option>
                <option value="Working at Height">Working at Height</option>
                 <option value="General">General</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location of Work</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Berth 5, Crane QC-03"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workScope">Work Scope / Description</Label>
            <Textarea
              id="workScope"
              value={formData.workScope}
              onChange={(e) => setFormData(prev => ({ ...prev, workScope: e.target.value }))}
              placeholder="Provide a detailed description of the work to be performed."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                   value={formData.validFrom}
                  onChange={(e) => handleDateChange(e, 'validFrom')}
                  required
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="validTo">Valid To</Label>
                <Input
                  id="validTo"
                  type="date"
                   value={formData.validTo}
                   onChange={(e) => handleDateChange(e, 'validTo')}
                  required
                />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Risk Assessment</CardTitle>
           <p className="text-sm text-gray-500">Identify potential hazards and control measures for this work.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <Input
              value={newRiskItem.hazard}
              onChange={(e) => setNewRiskItem(prev => ({...prev, hazard: e.target.value}))}
              placeholder="Hazard"
              className="md:col-span-2"
            />
             <Input
              value={newRiskItem.control}
              onChange={(e) => setNewRiskItem(prev => ({...prev, control: e.target.value}))}
              placeholder="Control Measure"
              className="md:col-span-3"
            />
             <Select
                value={newRiskItem.level}
                onChange={(e) => setNewRiskItem(prev => ({...prev, level: e.target.value as RiskLevel}))}
                className="md:col-span-1"
             >
                <option value={RiskLevel.LOW}>Low</option>
                <option value={RiskLevel.MEDIUM}>Medium</option>
                <option value={RiskLevel.HIGH}>High</option>
             </Select>
          </div>
          <Button onClick={addRiskItem} size="sm" type="button" variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Risk Item
          </Button>
          <div className="space-y-3">
            {formData.riskAssessment.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg items-center">
                <span className="col-span-full md:col-span-2 text-sm font-medium text-gray-800">{item.hazard}</span>
                <span className="col-span-full md:col-span-3 text-sm text-gray-700">{item.control}</span>
                 <div className="col-span-full md:col-span-1 flex items-center justify-between">
                     <Badge className={`
                         ${item.level === RiskLevel.LOW ? 'bg-green-100 text-green-800' : ''}
                         ${item.level === RiskLevel.MEDIUM ? 'bg-yellow-100 text-yellow-800' : ''}
                         ${item.level === RiskLevel.HIGH ? 'bg-red-100 text-red-800' : ''}
                     `}>
                         {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                     </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => removeRiskItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
            ))}
          </div>
           {formData.riskAssessment.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No risk assessment items added yet.</p>
               <p className="mt-1 text-sm">Add hazards, controls, and severity levels.</p>
            </div>
          )}
        </CardContent>
      </Card>


      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" className="min-w-32">
          {initialData ? 'Update Permit' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}