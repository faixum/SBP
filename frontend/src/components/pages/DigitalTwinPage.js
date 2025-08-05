import React, { Suspense } from 'react';
import DigitalTwinCanvas from '../digital-twin/DigitalTwinCanvas';

const DigitalTwinPage = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-shrink-0 mb-4">
                 <h2 className="text-3xl font-bold text-gray-800">Digital Twin</h2>
                 <p className="text-gray-500">A real-time 3D visualization of terminal operations.</p>
            </div>
           
            <div className="flex-grow bg-gray-800 rounded-lg overflow-hidden relative">
                 <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading 3D Environment...</div>}>
                    <DigitalTwinCanvas />
                 </Suspense>
                 <div className="absolute top-4 right-4 bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <h3 className="font-semibold mb-2">Controls</h3>
                    <p className="text-sm text-gray-600">Interactive controls coming soon.</p>
                 </div>
            </div>
        </div>
    );
};

export default DigitalTwinPage;