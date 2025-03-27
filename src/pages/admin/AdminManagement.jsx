// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight, Trash2, UserCheck, UserX } from 'lucide-react';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '@/store/authUser';
// import { TableCell, TableRow } from '@/components/ui/table';

// const AdminManagement = () => {
//   const { authCheck, user: currentUser } = useAuthStore(); 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Pagination states
//     const [currentUserPage, setCurrentUserPage] = useState(1);
//     const [usersPerPage] = useState(5);
    
//     // Total pages calculation
//     const totalUserPages = Math.ceil(users.length / usersPerPage);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('/api/auth/users', {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (data.success) {
//         setUsers(data.users);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`/api/auth/users/${userId}`, {
//         method: 'DELETE',
//         credentials: 'include'
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         setUsers(users.filter(user => user.id !== userId));
//         toast.success("User deleted successfully");
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       toast.error(error.message || "Failed to delete user");
//     }
//   };

//   const handleToggleVipStatus = async (userId, currentStatus) => {
//     const newStatus = !currentStatus;
//     const message = newStatus 
//       ? 'Are you sure you want to grant VIP status to this user?' 
//       : 'Are you sure you want to revoke VIP status from this user?';
    
//     if (!confirm(message)) return;

//     try {
//       // Call API to update VIP status
//       const response = await fetch(`/api/auth/users/${userId}/vip`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ isVip: newStatus })
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
        
//         setUsers(users.map(user => 
//           user.id === userId ? { ...user, isVip: newStatus } : user
//         ));
        
//         toast.success(data.message);       
        
        
//         if (currentUser && currentUser.id === userId) {
//           // Call a dedicated refresh endpoint to update the session and get fresh user data
//           await fetch('/api/auth/refresh-session', {
//             method: 'GET',
//             credentials: 'include'
//           }).then(res => res.json());
          
          
//           await authCheck();
//         }
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       console.error('Error updating VIP status:', error);
//       toast.error(error.message || "Failed to update VIP status");
//     }
//   };

//   const getUserRoleBadge = (user) => {
//     if (user.isAdmin) {
//       return <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Admin</span>;
//     } else if (user.isVip) {
//       return <span className="px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-800">VIP</span>;
//     } else {
//       return <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">User</span>;
//     }
//   };

//    // Pagination handlers
//     const handleUserPageChange = (pageNumber) => {
//       if (pageNumber < 1 || pageNumber > totalUserPages) return;
//       setCurrentUserPage(pageNumber);
//     };
  
  
//     // Get current page items
//     const indexOfLastUser = currentUserPage * usersPerPage;
//     const indexOfFirstUser = indexOfLastUser - usersPerPage;
//     const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  
//     // Generate page numbers
//     const generatePageNumbers = (currentPage, totalPages) => {
//       const pageNumbers = [];
//       let startPage = Math.max(1, currentPage - 2);
//       let endPage = Math.min(totalPages, startPage + 4);
      
//       if (endPage - startPage < 4) {
//         startPage = Math.max(1, endPage - 4);
//       }
  
//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
      
//       return pageNumbers;
//     };
  
//     const userPageNumbers = generatePageNumbers(currentUserPage, totalUserPages);
  
//     // Pagination component
//     const Pagination = ({ currentPage, totalPages, pageNumbers, onPageChange }) => {
//       return (
//         <div className="flex items-center justify-center mt-4 space-x-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => onPageChange(1)}
//             disabled={currentPage === 1}
//           >
//             First
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </Button>
          
//           {pageNumbers.map((number) => (
//             <Button 
//               key={number}
//               variant={currentPage === number ? "default" : "outline"} 
//               size="sm"
//               onClick={() => onPageChange(number)}
//             >
//               {number}
//             </Button>
//           ))}
          
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => onPageChange(totalPages)}
//             disabled={currentPage === totalPages}
//           >
//             Last
//           </Button>
//         </div>
//       );
//     };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
//       </div>
//     );
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>User Management</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="px-4 py-2 text-left">Avatar</th>
//                 <th className="px-4 py-2 text-left">Username</th>
//                 <th className="px-4 py-2 text-left">Email</th>
//                 <th className="px-4 py-2 text-left">Role</th>
//                 <th className="px-4 py-2 text-left">Created At</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentUsers.length === 0 ? (
//                                       <TableRow>
//                                         <TableCell colSpan={5} className="text-center py-8">
//                                           No user found
//                                         </TableCell>
//                                       </TableRow>
//                                     ) : (
//               currentUsers.map((user) => (
//                 <tr key={user.id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2">
//                     <img 
//                       src={user.image || '/default-avatar.png'} 
//                       alt={user.username}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-4 py-2">{user.username}</td>
//                   <td className="px-4 py-2">{user.email}</td>
//                   <td className="px-4 py-2">
//                     {getUserRoleBadge(user)}
//                   </td>
//                   <td className="px-4 py-2">
//                     {format(new Date(user.createdAt), 'MMM d, yyyy')}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex space-x-2">
//                       {!user.isAdmin && (
//                         <>
//                           <Button
//                             variant={user.isVip ? "outline" : "secondary"}
//                             size="sm"
//                             title={user.isVip ? "Revoke VIP status" : "Grant VIP status"}
//                             onClick={() => handleToggleVipStatus(user.id, user.isVip)}
//                           >
//                             {user.isVip ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
//                           </Button>
                          
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             title="Delete user"
//                             onClick={() => handleDeleteUser(user.id)}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//             </tbody>
//           </table>
//         </div>
//         {totalUserPages > 1 && (
//                     <Pagination 
//                       currentPage={currentUserPage}
//                       totalPages={totalUserPages}
//                       pageNumbers={userPageNumbers}
//                       onPageChange={handleUserPageChange}
//                     />
//                   )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminManagement;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, UserCheck, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authUser';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

const AdminManagement = () => {
  const { authCheck, user: currentUser } = useAuthStore(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDiscounts, setUserDiscounts] = useState({});

    // Pagination states
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [usersPerPage] = useState(5);
    
    // Total pages calculation
    const totalUserPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        
        // Fetch discount status for each user
        const discountPromises = data.users.map(user => 
          fetchUserDiscountStatus(user.id)
        );
        
        const discountResults = await Promise.all(discountPromises);
        
        // Create an object with user IDs as keys and discount status as values
        const discountMap = {};
        discountResults.forEach((result, index) => {
          if (result) {
            discountMap[data.users[index].id] = result;
          }
        });
        
        setUserDiscounts(discountMap);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDiscountStatus = async (userId) => {
    try {
      const response = await fetch(`/api/admin/user-discount-status/${userId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? {
        isDiscount: data.isDiscount,
        rentalCount: data.rentalCount
      } : null;
    } catch (error) {
      console.error(`Error fetching discount status for user ${userId}:`, error);
      return null;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleToggleVipStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const message = newStatus 
      ? 'Are you sure you want to grant Assistant status to this user?' 
      : 'Are you sure you want to revoke Assistant status from this user?';
    
    if (!confirm(message)) return;

    try {
      // Call API to update VIP status
      const response = await fetch(`/api/auth/users/${userId}/vip`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isVip: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isVip: newStatus } : user
        ));
        
        toast.success(data.message);
        
        if (currentUser && currentUser.id === userId) {
          // Call a dedicated refresh endpoint to update the session and get fresh user data
          await fetch('/api/auth/refresh-session', {
            method: 'GET',
            credentials: 'include'
          }).then(res => res.json());
          
          await authCheck();
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating Assistant status:', error);
      toast.error(error.message || "Failed to update Assistant status");
    }
  };

  const getUserRoleBadge = (user) => {
    if (user.isAdmin) {
      return <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Admin</span>;
    } else if (user.isVip) {
      return <span className="px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-800">Assistant</span>;
    } else {
      return <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">User</span>;
    }
  };

  const getDiscountBadge = (userId) => {
    const discountInfo = userDiscounts[userId];
    
    if (!discountInfo) {
      return <span className="text-gray-500">Loading...</span>;
    }
    
    if (discountInfo.isDiscount) {
      return (
        <Badge className="bg-green-100 text-green-800">
          Loyalty Discount (10%)
        </Badge>
      );
    }
    
    return (
      <span className="text-sm text-gray-600">
        Rentals: {discountInfo.rentalCount}/5
      </span>
    );
  };

     // Pagination handlers
    const handleUserPageChange = (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalUserPages) return;
      setCurrentUserPage(pageNumber);
    };
  
  
    // Get current page items
    const indexOfLastUser = currentUserPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  
    // Generate page numbers
    const generatePageNumbers = (currentPage, totalPages) => {
      const pageNumbers = [];
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      return pageNumbers;
    };
  
    const userPageNumbers = generatePageNumbers(currentUserPage, totalUserPages);
  
    // Pagination component
    const Pagination = ({ currentPage, totalPages, pageNumbers, onPageChange }) => {
      return (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {pageNumbers.map((number) => (
            <Button 
              key={number}
              variant={currentPage === number ? "default" : "outline"} 
              size="sm"
              onClick={() => onPageChange(number)}
            >
              {number}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      );
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Avatar</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Discount</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
                        {currentUsers.length === 0 ? (
                                      <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                          No user found
                                        </TableCell>
                                      </TableRow>
                                    ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img 
                      src={user.image || '/default-avatar.png'} 
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {getUserRoleBadge(user)}
                  </td>
                  <td className="px-4 py-2">
                    {getDiscountBadge(user.id)}
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {!user.isAdmin && (
                        <>
                          <Button
                            variant={user.isVip ? "outline" : "secondary"}
                            size="sm"
                            title={user.isVip ? "Revoke Assistant status" : "Grant Assistant status"}
                            onClick={() => handleToggleVipStatus(user.id, user.isVip)}
                          >
                            {user.isVip ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            title="Delete user"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
              
            </tbody>
          </table>
        </div>
             {totalUserPages > 1 && (
                    <Pagination 
                      currentPage={currentUserPage}
                      totalPages={totalUserPages}
                      pageNumbers={userPageNumbers}
                      onPageChange={handleUserPageChange}
                    />
                  )}
      </CardContent>
    </Card>
  );
};

export default AdminManagement;