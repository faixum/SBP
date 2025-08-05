import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Shield, ClipboardList, Wrench, Users } from '../icons/LucideIcons';

const SafetyPage = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Safety & Compliance</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/safety/ptw">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Permit-to-Work (PTW)</CardTitle>
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Manage and track work permits for various activities.</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/safety/maintenance">
                     <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Maintenance & CMMS</CardTitle>
                            <Wrench className="w-6 h-6 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Oversee equipment maintenance and work orders.</p>
                        </CardContent>
                    </Card>
                </Link>

                 <Link to="/safety/personnel">
                     <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Personnel Management</CardTitle>
                            <Users className="w-6 h-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Manage personnel details, certifications, and assignments.</p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Add more safety-related cards here as needed */}
            </div>
        </div>
    );
};

export default SafetyPage;