import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Ship, Anchor, Gauge, Ruler, Activity } from '../icons/LucideIcons';
import { Vessel, VesselStatus, VesselType } from '../../types';

interface VesselCardProps {
  vessel: Vessel;
}

const statusConfig: Record<VesselStatus, { color: string; label: string }> = {
  [VesselStatus.AT_BERTH]: { label: 'At Berth', color: 'bg-blue-100 text-blue-800' },
  [VesselStatus.AT_ANCHORAGE]: { label: 'At Anchorage', color: 'bg-yellow-100 text-yellow-800' },
  [VesselStatus.UNDERWAY]: { label: 'Underway', color: 'bg-green-100 text-green-800' },
  [VesselStatus.MAINTENANCE]: { label: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
  [VesselStatus.OFFPORT]: { label: 'Off Port', color: 'bg-gray-100 text-gray-800' },
};

const typeConfig: Record<VesselType, string> = {
    [VesselType.CONTAINER_SHIP]: 'Container Ship',
    [VesselType.BULK_CARRIER]: 'Bulk Carrier',
    [VesselType.TANKER]: 'Tanker',
    [VesselType.GENERAL_CARGO]: 'General Cargo',
    [VesselType.OFFSHORE_VESSEL]: 'Offshore Vessel',
    [VesselType.TUG]: 'Tug',
};

export const VesselCard: React.FC<VesselCardProps> = ({ vessel }) => {
  const status = statusConfig[vessel.status];
  const typeLabel = typeConfig[vessel.type];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">
      <div className="relative">
         {/* Placeholder for Vessel Image */}
         <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image Available
         </div>
        <Badge className={`absolute top-2 right-2 ${status.color}`}>{status.label}</Badge>
      </div>
      
      <CardHeader className="pt-4 pb-2">
        <p className="text-sm text-gray-500">{typeLabel}</p>
        <h3 className="font-semibold text-gray-900 text-lg">{vessel.name}</h3>
        <p className="text-xs font-mono text-gray-400">IMO: {vessel.imoNumber}</p>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-2">
        <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                {vessel.status === VesselStatus.AT_BERTH ? (
                    <Anchor className="w-4 h-4 text-gray-400" />
                ) : (
                    <Ship className="w-4 h-4 text-gray-400" />
                )}
                <span>{vessel.status === VesselStatus.AT_BERTH ? `Berth ${vessel.berth}` : vessel.status}</span>
            </div>
            <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-400" />
                <span>Draft: {vessel.draft.toFixed(1)}m</span>
            </div>
            <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-400" />
                <span>Length: {vessel.length.toFixed(0)}m | Beam: {vessel.beam.toFixed(0)}m</span>
            </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span>Last Port: {vessel.lastPortOfCall}</span>
            </div>
        </div>

        <div className="pt-4 flex gap-2">
            <Button size="sm" className="flex-1">View Details</Button>
             <Button size="sm" variant="outline">Cargo Operations</Button>
        </div>
      </CardContent>
    </Card>
  );
};