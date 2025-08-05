import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getCargoItems, getCustomers } from '../../services/mockApi';
import { CargoItem, CargoStatus, Customer } from '../../types';
import { Button } from '../ui/Button';
import { Plus, AlertTriangle, Filter, Container, Weight, CheckCircle, ChevronDown, Upload, ScanLine, Link } from '../icons/LucideIcons';
import { Modal } from '../ui/Modal';
import { CargoForm } from '../cargo/CargoForm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CargoCard } from '../cargo/CargoCard';

const KANBAN_COLUMNS = [
    { title: 'At Gate', status: 'AT_GATE' },
    { title: 'In Yard', status: 'IN_YARD' },
    { title: 'Staged for Loading', status: 'STAGED_FOR_LOADING' },
    { title: 'On Vessel', status: 'ON_VESSEL' },
    { title: 'Discharged', status: 'DISCHARGED' },
    { title: 'Released', status: 'RELEASED' },
];

const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`w-5 h-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value} <span className="text-base font-normal text-gray-500">{unit}</span></div>
        </CardContent>
    </Card>
);


const CargoPage = () => {
    const [cargo, setCargo] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        customer: 'all',
        dangerousGoods: 'all',
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([getCargoItems(), getCustomers()]).then(([cargoData, customerData]) => {
            setCargo(cargoData);
            setCustomers(customerData);
            setLoading(false);
        });
    }, []);

    const handleCreateCargo = (data) => {
        console.log("Registering cargo with data:", data);
        setIsModalOpen(false);
    };

    const stats = useMemo(() => {
        if (loading) return { totalItems: 0, dgItems: 0, totalTonnage: 0, stagedItems: 0 };
        return {
            totalItems: cargo.length,
            dgItems: cargo.filter(c => c.isDangerousGoods).length,
            totalTonnage: cargo.reduce((sum, c) => sum + c.weight, 0),
            stagedItems: cargo.filter(c => c.status === 'STAGED_FOR_LOADING').length,
        };
    }, [cargo, loading]);

    const filteredAndGroupedCargo = useMemo(() => {
        const filtered = cargo
            .filter(c => {
                const search = searchTerm.toLowerCase();
                return c.manifestNumber.toLowerCase().includes(search) || c.description.toLowerCase().includes(search);
            })
            .filter(c => filters.customer === 'all' || c.customer.id === filters.customer)
            .filter(c => {
                if (filters.dangerousGoods === 'all') return true;
                return filters.dangerousGoods === 'yes' ? c.isDangerousGoods : !c.isDangerousGoods;
            });

        return filtered.reduce((acc, item) => {
            (acc[item.status] = acc[item.status] || []).push(item);
            return acc;
        }, {});
    }, [cargo, searchTerm, filters]);

    const KanbanColumn = ({ title, items }) => (
        <div className="flex-shrink-0 w-80 bg-gray-200 rounded-2xl">
            <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">{title}</h3>
                    <Badge className="bg-sbp-brand-100 text-sbp-brand-700">{items?.length || 0}</Badge>
                </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-29rem)]">
                {items && items.length > 0 ? (
                    items.map(c => <CargoCard key={c.id} cargoItem={c} />)
                ) : (
                    <div className="text-center text-sm text-gray-500 py-4">No cargo</div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800">Cargo Kanban</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-5 h-5 mr-2" />
                        Register New Cargo
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="flex-shrink-0 flex gap-6">
                <StatCard title="Total Items" value={loading ? '...' : stats.totalItems} unit="units" icon={Container} color="text-blue-500"/>
                <StatCard title="Dangerous Goods" value={loading ? '...' : stats.dgItems} unit="units" icon={AlertTriangle} color="text-red-500"/>
                <StatCard title="Total Tonnage" value={loading ? '...' : stats.totalTonnage.toFixed(1)} unit="Tons" icon={Weight} color="text-purple-500"/>
                <StatCard title="Staged for Loading" value={loading ? '...' : stats.stagedItems} unit="units" icon={CheckCircle} color="text-orange-500"/>
            </div>

            {/* Filters */}
            <Card className="flex-shrink-0">
                <CardContent className="p-4 flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <Input 
                        placeholder="Search by Manifest or Description..."
                        className="max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select value={filters.customer} onChange={e => setFilters(f => ({...f, customer: e.target.value}))}>
                        <option value="all">All Customers</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                     <Select value={filters.dangerousGoods} onChange={e => setFilters(f => ({...f, dangerousGoods: e.target.value}))}>
                        <option value="all">All Cargo Types</option>
                        <option value="yes">Dangerous Goods Only</option>
                        <option value="no">Non-DG Only</option>
                    </Select>
                </CardContent>
            </Card>

            {loading ? (
                <div className="text-center text-gray-500 flex-grow">Loading Kanban board...</div>
            ) : (
                <div className="flex-grow overflow-x-auto pb-4">
                    <div className="flex gap-6">
                        {KANBAN_COLUMNS.map(col => (
                            <KanbanColumn
                                key={col.status}
                                title={col.title}
                                items={filteredAndGroupedCargo[col.status] || []}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Cargo">
                <CargoForm
                    onSubmit={handleCreateCargo}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CargoPage;