import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AdminUserRentalStatus = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActiveRentals: 0,
    totalExpiredRentals: 0,
  });

  useEffect(() => {
    fetchAllUsersRentalStatus();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUserData(userData);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = userData.filter(user => 
        user.username.toLowerCase().includes(lowercasedSearch) || 
        user.email.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredUserData(filtered);
    }
  }, [searchTerm, userData]);

  const fetchAllUsersRentalStatus = async () => {
    try {
      // Fixed endpoint URL with /api prefix
      const response = await fetch('/api/auth/rental-status', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rental status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.users);
        setFilteredUserData(data.users);
        
        // Calculate overall stats
        const totalActiveRentals = data.users.reduce((sum, user) => sum + user.activeRentals, 0);
        const totalExpiredRentals = data.users.reduce((sum, user) => sum + user.expiredRentals, 0);
        
        setStats({
          totalUsers: data.totalUsers,
          totalActiveRentals,
          totalExpiredRentals,
        });
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Fetching rental status error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error: {error}</p>
        <button 
          onClick={fetchAllUsersRentalStatus}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalActiveRentals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{stats.totalExpiredRentals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users List with Rental Information */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Rental Dashboard</CardTitle>
          <CardDescription>
            Complete overview of all users and their rental activity
          </CardDescription>
          
          {/* Search Input */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUserData.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              {userData.length === 0 ? 'No users with rental data found' : 'No users match your search criteria'}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredUserData.map((user) => (
                <div key={user.id} className="border rounded-lg overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {user.username}
                          {user.isVip && (
                            <Badge className="bg-yellow-500">Assistant</Badge>
                          )}
                          {user.isAdmin && (
                            <Badge className="bg-blue-500">ADMIN</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">Total Rentals</p>
                          <p className="text-xl font-bold">{user.totalRentals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Active</p>
                          <p className="text-xl font-bold text-green-600">{user.activeRentals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Expired</p>
                          <p className="text-xl font-bold text-gray-500">{user.expiredRentals}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Rentals Tabs */}
                  <Tabs defaultValue="active" className="p-4">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Active Rentals</TabsTrigger>
                      <TabsTrigger value="expired">Expired Rentals</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active">
                      {user.rentals.active.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No active rentals</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Start Date</th>
                                <th className="p-2 text-left">End Date</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-left">Payment Method</th>
                                <th className="p-2 text-left">Discount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.rentals.active.map((rental) => (
                                <tr key={rental.id} className="border-t hover:bg-gray-50">
                                  <td className="p-2 font-medium">{rental.title}</td>
                                  <td className="p-2 capitalize">{rental.mediaType}</td>
                                  <td className="p-2">{formatDate(rental.rentalStartDate)}</td>
                                  <td className="p-2">{formatDate(rental.rentalEndDate)}</td>
                                  <td className="p-2">₦{Number(rental.amount).toFixed(2)}</td>
                                  <td className="p-2 capitalize">{rental.paymentMethod}</td>
                                  <td className="p-2">
                                    {rental.discountApplied ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        10% Off
                                      </Badge>
                                    ) : (
                                      <span className="text-xs text-gray-500">None</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="expired">
                      {user.rentals.expired.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No expired rentals</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Start Date</th>
                                <th className="p-2 text-left">End Date</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-left">Payment Method</th>
                                <th className="p-2 text-left">Discount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.rentals.expired.map((rental) => (
                                <tr key={rental.id} className="border-t hover:bg-gray-50">
                                  <td className="p-2 font-medium">{rental.title}</td>
                                  <td className="p-2 capitalize">{rental.mediaType}</td>
                                  <td className="p-2">{formatDate(rental.rentalStartDate)}</td>
                                  <td className="p-2">{formatDate(rental.rentalEndDate)}</td>
                                  <td className="p-2">₦{Number(rental.amount).toFixed(2)}</td>
                                  <td className="p-2 capitalize">{rental.paymentMethod}</td>
                                  <td className="p-2">
                                    {rental.discountApplied ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        10% Off
                                      </Badge>
                                    ) : (
                                      <span className="text-xs text-gray-500">None</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserRentalStatus;