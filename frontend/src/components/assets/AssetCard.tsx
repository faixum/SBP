import React from 'react';
import { Link } from 'react-router-dom';
import { Asset } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DollarSign, Wrench, MapPin } from '../icons/LucideIcons';
import { Button } from '../ui/Button';

interface AssetCardProps {
    asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-lg truncate">{asset.name}</CardTitle>
                <p className="text-sm text-gray-500 truncate">{asset.assetTag}</p>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{asset.location}</span>
                </div>
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Value: {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(asset.value)}</span>
                </div>
                <div className="flex items-center">
                    <Wrench className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Next Maintenance: {asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate).toLocaleDateString('en-GB') : 'N/A'}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Link to={`/assets/${asset.id}`}>
                    <Button variant="outline" size="sm">Details</Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export { AssetCard };