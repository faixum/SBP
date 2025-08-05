import React, { useState, useEffect } from 'react';
import { getAssets } from '../../services/mockApi';
import { Asset } from '../../types';
import { AssetCard } from '../assets/AssetCard';
import { Button } from '../ui/Button';
import { Plus } from '../icons/LucideIcons';

const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAssets().then(data => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Asset Management</h2>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Add New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))
        )}
      </div>
    </div>
  );
};

export default AssetsPage;