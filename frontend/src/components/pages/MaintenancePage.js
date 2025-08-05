import React from 'react';

const MaintenancePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Under Maintenance</h1>
                <p className="text-gray-600 mb-6">
                    We are currently performing essential maintenance on this page.
                    We apologize for any inconvenience and appreciate your patience.
                </p>
                <p className="text-sm text-gray-500">
                    Please check back later.
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;