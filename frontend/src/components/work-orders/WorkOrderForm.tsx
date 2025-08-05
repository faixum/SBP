import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Plus, X, Calendar } from '../icons/LucideIcons';
import { WorkOrderStatus, Priority } from '../../types';

interface WorkOrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function WorkOrderForm({ onSubmit, onCancel, initialData }: WorkOrderFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    vesselId: '',
    assetId: '',
    assignedToId: '',
    status: WorkOrderStatus.NEW,
    priority: Priority.NORMAL,
    estimatedStart: '',
    estimatedEnd: '',
    tasks: [],
    ...initialData
  });

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, { id: `task-${Date.now()}`, description: newTask, completed: false }]
      }));
      setNewTask('');
    }
  };

  const removeTask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Work Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Repair crane hydraulic system"
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select id="customer" required value={formData.customerId} onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}>
                <option value="" disabled>Select customer</option>
                <option value="petronas">Petronas Carigali</option>
                <option value="shell">Shell Malaysia</option>
                <option value="murphy">Murphy Oil</option>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the required work..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="vessel">Vessel (Optional)</Label>
              <Select id="vessel" value={formData.vesselId} onChange={(e) => setFormData(prev => ({ ...prev, vesselId: e.target.value }))}>
                <option value="">Select vessel</option>
                <option value="v1">MV SURIA</option>
                <option value="v3">MV TERENGGANU</option>
                <option value="v2">AHTS-201</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset">Asset (Optional)</Label>
              <Select id="asset" value={formData.assetId} onChange={(e) => setFormData(prev => ({ ...prev, assetId: e.target.value }))}>
                 <option value="">Select asset</option>
                 <option value="a1">QC01 - Quayside Crane</option>
                 <option value="a2">FL10 - Forklift</option>
                 <option value="a3">PM05 - Prime Mover</option>
              </Select>
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                <Select id="assignedTo" value={formData.assignedToId} onChange={(e) => setFormData(prev => ({ ...prev, assignedToId: e.target.value }))}>
                    <option value="">Select personnel</option>
                    <option value="p1">Ahmad Rahman</option>
                    <option value="p2">Siti Abdullah</option>
                    <option value="p3">Tan Lee</option>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select id="priority" value={formData.priority} onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}>
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.NORMAL}>Normal</option>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.URGENT}>Urgent</option>
                    <option value={Priority.EMERGENCY}>Emergency</option>
                </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="estimatedStart">Estimated Start Date</Label>
                <Input id="estimatedStart" type="date" value={formData.estimatedStart} onChange={e => setFormData({...formData, estimatedStart: e.target.value})} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="estimatedEnd">Estimated Completion Date</Label>
                <Input id="estimatedEnd" type="date" value={formData.estimatedEnd} onChange={e => setFormData({...formData, estimatedEnd: e.target.value})} />
            </div>
          </div>


        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tasks / Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task"
              className="flex-grow"
            />
             <Button onClick={addTask} size="sm" type="button" variant="outline">
                <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </div>
          <div className="space-y-2">
            {formData.tasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="flex-1 text-sm">{task.description}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
           {formData.tasks.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>Add tasks to create a checklist for this work order.</p>
            </div>
          )}
        </CardContent>
      </Card>


      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" className="min-w-32">
          {initialData ? 'Update Work Order' : 'Create Work Order'}
        </Button>
      </div>
    </form>
  );
}