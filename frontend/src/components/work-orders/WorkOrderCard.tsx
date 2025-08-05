import React from 'react';
import { WorkOrder, WorkOrderStatus, Priority } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ListChecks, Clock } from '../icons/LucideIcons';

interface WorkOrderCardProps {
    workOrder: WorkOrder & { taskCount: number; completedTasks: number; };
}

const statusConfig: Record<WorkOrderStatus, { color: string; label: string }> = {
    [WorkOrderStatus.NEW]: { color: 'bg-gray-100 text-gray-800', label: 'New' },
    [WorkOrderStatus.ASSIGNED]: { color: 'bg-blue-100 text-blue-800', label: 'Assigned' },
    [WorkOrderStatus.IN_PROGRESS]: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
    [WorkOrderStatus.ON_HOLD]: { color: 'bg-orange-100 text-orange-800', label: 'On Hold' },
    [WorkOrderStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    [WorkOrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

const priorityConfig: Record<Priority, string> = {
    [Priority.LOW]: 'Low',
    [Priority.NORMAL]: 'Normal',
    [Priority.HIGH]: 'High',
    [Priority.URGENT]: 'Urgent',
    [Priority.EMERGENCY]: 'Emergency',
};

const priorityColorConfig: Record<Priority, string> = {
    [Priority.LOW]: 'bg-green-100 text-green-800',
    [Priority.NORMAL]: 'bg-blue-100 text-blue-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800',
    [Priority.EMERGENCY]: 'bg-red-700 text-white',
};

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder }) => {
    const status = statusConfig[workOrder.status];
    const priorityColor = priorityColorConfig[workOrder.priority];

    return (
        <Card className="bg-white shadow-md hover:shadow-lg cursor-grab active:cursor-grabbing flex flex-col">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                         <p className="text-sm font-mono text-gray-500">{workOrder.number}</p>
                        <h3 className="font-semibold text-gray-900 leading-tight">{workOrder.title}</h3>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Due: {new Date(workOrder.dueDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-gray-400" />
                        <span>Tasks: {workOrder.completedTasks}/{workOrder.taskCount}</span>
                    </div>
                </div>
                 
                 <div className="flex items-center justify-between pt-3 border-t">
                    <Badge className={priorityColor}>{priorityConfig[workOrder.priority]}</Badge>
                    <Avatar src={workOrder.assignedTo?.avatar} fallback={workOrder.assignedTo?.name.substring(0,2) || '?'} className="w-7 h-7"/>
                 </div>
            </CardContent>
        </Card>
    );
};