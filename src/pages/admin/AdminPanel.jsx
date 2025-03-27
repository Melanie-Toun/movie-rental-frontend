import { useState } from 'react';
import { useAuthStore } from '../../store/authUser';
import AdminPage from './AdminPage';
import AdminManagement from './AdminManagement';
import { LayoutDashboard, Users, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// import RentalDetails from './RentalDetails';
import AdminAllRentals from './AdminAllRentals';
import AdminUserRentalStatus from './AdminUserRentalStatus';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useAuthStore(state => state.user);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: AdminPage },
    { id: 'management', label: 'User Management', icon: Users, component: AdminManagement },
    { id: 'rental', label: 'User Rentals', icon: Users, component: AdminAllRentals },
    { id: 'allrentals', label: 'Users Rentals', icon: Users, component: AdminUserRentalStatus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={user?.image || '/default-avatar.png'}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-medium text-gray-900">{user?.username}</h3>
              <span className="text-sm text-gray-500">Administrator</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors",
                      activeTab === item.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Card className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'dashboard' ? 'Dashboard' : 'User Management'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {activeTab === 'dashboard' 
                    ? 'Manage your movies and content'
                    : 'Manage user accounts and permissions'}
                </p>
              </div>
              
              <div className="mt-6">
                {menuItems.map(item => (
                  activeTab === item.id && <item.component key={item.id} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;