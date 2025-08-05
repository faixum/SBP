import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutGrid, 
    GanttChartSquare, 
    Navigation, 
    HardHat, 
    Container, 
    Handshake, 
    ReceiptText, 
    Construction, 
    Wrench, 
    Scan, 
    ShieldCheck,
    ServerCog
} from '../icons/LucideIcons'; // Assuming LucideIcons are in '../icons'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Work Orders', href: '/work-orders', icon: GanttChartSquare },
  { name: 'Vessels', href: '/vessels', icon: Navigation },
  { name: 'Personnel', href: '/personnel', icon: HardHat },
  { name: 'Cargo', href: '/cargo', icon: Container },
  { name: 'CRM', href: '/crm', icon: Handshake },
  { name: 'Billing', href: '/billing', icon: ReceiptText },
  { name: 'Assets', href: '/assets', icon: Construction },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Digital Twin', href: '/digital-twin', icon: Scan },
  { name: 'Safety (HSEQ)', href: '/safety', icon: ShieldCheck },
];

const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: ServerCog },
]

// Define NavItemProps interface - this is TypeScript syntax, assuming you might use it later or for documentation
// If you are strictly using JavaScript, you can remove this interface definition.
// interface NavItemProps {
//   item: {
//     name: string;
//     href: string;
//     icon: React.ComponentType<{ className?: string }>;
//     disabled?: boolean;
//   };
// }

const NavItem = ({ item }) => { // Changed to destructure item directly
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div className="flex justify-center items-center py-4 text-gray-400 opacity-50 cursor-not-allowed" title={item.name}>
        <Icon className="h-6 w-6" />
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      title={item.name}
      className={({ isActive }) =>
        `flex justify-center items-center py-4 rounded-lg transition-colors duration-200 group ${
          isActive
            ? 'text-sbp-brand-600'
            : 'text-gray-500 hover:text-sbp-brand-500'
        }`
      }
    >
      <Icon className="h-6 w-6" />
    </NavLink>
  );
};


const Sidebar = () => {
  return (
    <div className="w-20 flex flex-col items-center bg-white py-6">
      <div className="text-sbp-brand-600 font-bold text-2xl mb-8">
        S
      </div>
      <nav className="flex flex-col items-center space-y-4 flex-grow">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
      <div className="flex flex-col items-center space-y-4">
        {adminNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;