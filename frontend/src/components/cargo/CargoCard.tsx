import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Plane, Ship, Truck, Package, Container, AlertTriangle, MapPin } from '../icons/LucideIcons';
import { Cargo, CargoStatus, CargoType } from '../../types';

interface CargoCardProps {
  cargo: Cargo;
}

const cargoTypeConfig: Record<CargoType, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  [CargoType.GENERAL]: { label: 'General Cargo', icon: Package },
  [CargoType.CONTAINERIZED]: { label: 'Containerized', icon: Container },
  [CargoType.DANGEROUS_GOODS]: { label: 'Dangerous Goods', icon: AlertTriangle },
  [CargoType.BULK]: { label: 'Bulk Cargo', icon: Package }, // Using Package as a generic fallback
};

const statusConfig: Record<CargoStatus, { color: string; label: string }> = {
  [CargoStatus.PENDING]: { label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  [CargoStatus.IN_TRANSIT]: { label: 'In Transit', color: 'bg-blue-100 text-blue-800' },
  [CargoStatus.AT_PORT]: { label: 'At Port', color: 'bg-yellow-100 text-yellow-800' },
  [CargoStatus.DELIVERED]: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  [CargoStatus.ON_HOLD]: { label: 'On Hold', color: 'bg-orange-100 text-orange-800' },
};

const transportationModeConfig = {
  SEA: { label: 'Sea', icon: Ship },
  AIR: { label: 'Air', icon: Plane },
  ROAD: { label: 'Road', icon: Truck },
};

export const CargoCard: React.FC<CargoCardProps> = ({ cargo }) => {
  const cargoType = cargoTypeConfig[cargo.type];
  const status = statusConfig[cargo.status];
  const mode = transportationModeConfig[cargo.transportMode];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">{cargo.trackingId}</CardTitle>
          <p className="text-sm text-gray-500">{cargo.description}</p>
        </div>
        <Badge className={`${status.color}`}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <cargoType.icon className="w-4 h-4 text-gray-400" />
          <span>{cargoType.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <mode.icon className="w-4 h-4 text-gray-400" />
          <span>Via {mode.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>From {cargo.origin} to {cargo.destination}</span>
        </div>
        {cargo.expectedDeliveryDate && (
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check w-4 h-4 text-gray-400"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                <span>ETA: {new Date(cargo.expectedDeliveryDate).toLocaleDateString('en-GB')}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button size="sm" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
};