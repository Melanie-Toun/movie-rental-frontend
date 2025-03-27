import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminAllRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
      const [currentRentalPage, setCurrentRentalPage] = useState(1);
      const [rentalsPerPage] = useState(5);
      
      // Total pages calculation
      const totalRentalPages = Math.ceil(rentals.length / rentalsPerPage);

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const fetchAllRentals = async () => {
    try {
      const response = await fetch('/api/payment/all-rentals', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rentals');
      }

      const data = await response.json();

      if (data.success) {
        setRentals(data.rentals);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Fetching rentals error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRentalStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    return now <= end ? 'Active' : 'Expired';
  };

   // Pagination handlers
   const handleRentalPageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalRentalPages) return;
    setCurrentRentalPage(pageNumber);
  };


  // Get current page items
  const indexOfLastRental = currentRentalPage * rentalsPerPage;
  const indexOfFirstRental = indexOfLastRental - rentalsPerPage;
  const currentRentals = rentals.slice(indexOfFirstRental, indexOfLastRental);


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

  const rentalPageNumbers = generatePageNumbers(currentRentalPage, totalRentalPages);

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

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>All Active Rentals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Media Title</th>
                <th className="p-3 text-left">Media Type</th>
                <th className="p-3 text-left">Rental Start</th>
                <th className="p-3 text-left">Rental End</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRentals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No active rentals found
                  </td>
                </tr>
              ) : (
                currentRentals.map((rental) => (
                  <tr key={rental.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{rental.username}</td>
                    <td className="p-3">{rental.email}</td>
                    <td className="p-3">{rental.title}</td>
                    <td className="p-3 capitalize">{rental.mediaType}</td>
                    <td className="p-3">
                      {format(new Date(rental.rentalStartDate), 'MMM d, yyyy')}
                    </td>
                    <td className="p-3">
                      {format(new Date(rental.rentalEndDate), 'MMM d, yyyy')}
                    </td>
                    <td className="p-3">₦{Number(rental.amount).toFixed(2)}</td>
                    <td className="p-3">
                      <Badge 
                        variant={
                          getRentalStatus(rental.rentalEndDate) === 'Active' 
                            ? 'default' 
                            : 'destructive'
                        }
                      >
                        {getRentalStatus(rental.rentalEndDate)}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRentalPages > 1 && (
                    <Pagination 
                      currentPage={currentRentalPage}
                      totalPages={totalRentalPages}
                      pageNumbers={rentalPageNumbers}
                      onPageChange={handleRentalPageChange}
                    />
                  )}
      </CardContent>
    </Card>
  );
};

export default AdminAllRentals;

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { format } from 'date-fns';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const AdminAllRentals = () => {
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//  // Pagination states
//       const [currentRentalPage, setCurrentRentalPage] = useState(1);
//       const [rentalsPerPage] = useState(5);
      
//       // Total pages calculation
//       const totalRentalPages = Math.ceil(rentals.length / rentalsPerPage);

//   useEffect(() => {
//     fetchAllRentals();
//   }, []);

//   const fetchAllRentals = async () => {
//     try {
//       const response = await fetch('/api/payment/all-rentals', {
//         method: 'GET',
//         credentials: 'include', 
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch rentals');
//       }

//       const data = await response.json();

//       if (data.success) {
//         setRentals(data.rentals);
//       } else {
//         throw new Error(data.message || 'Unknown error');
//       }
//     } catch (err) {
//       console.error('Fetching rentals error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRentalStatus = (endDate) => {
//     const now = new Date();
//     const end = new Date(endDate);
//     return now <= end ? 'Active' : 'Expired';
//   };

//      // Pagination handlers
//    const handleRentalPageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalRentalPages) return;
//     setCurrentRentalPage(pageNumber);
//   };


//   // Get current page items
//   const indexOfLastRental = currentRentalPage * rentalsPerPage;
//   const indexOfFirstRental = indexOfLastRental - rentalsPerPage;
//   const currentRentals = rentals.slice(indexOfFirstRental, indexOfLastRental);


//   // Generate page numbers
//   const generatePageNumbers = (currentPage, totalPages) => {
//     const pageNumbers = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, startPage + 4);
    
//     if (endPage - startPage < 4) {
//       startPage = Math.max(1, endPage - 4);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
    
//     return pageNumbers;
//   };

//   const rentalPageNumbers = generatePageNumbers(currentRentalPage, totalRentalPages);

//   // Pagination component
//   const Pagination = ({ currentPage, totalPages, pageNumbers, onPageChange }) => {
//     return (
//       <div className="flex items-center justify-center mt-4 space-x-2">
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//         >
//           First
//         </Button>
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </Button>
        
//         {pageNumbers.map((number) => (
//           <Button 
//             key={number}
//             variant={currentPage === number ? "default" : "outline"} 
//             size="sm"
//             onClick={() => onPageChange(number)}
//           >
//             {number}
//           </Button>
//         ))}
        
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           <ChevronRight className="w-4 h-4" />
//         </Button>
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//         >
//           Last
//         </Button>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center p-4">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <Card className="w-full max-w-6xl mx-auto">
//       <CardHeader>
//         <CardTitle>All Active Rentals</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="border-b bg-gray-100">
//                 <th className="p-3 text-left">Username</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Media Title</th>
//                 <th className="p-3 text-left">Media Type</th>
//                 <th className="p-3 text-left">Rental Start</th>
//                 <th className="p-3 text-left">Rental End</th>
//                 <th className="p-3 text-left">Amount</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Discount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRentals.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="text-center p-4 text-gray-500">
//                     No active rentals found
//                   </td>
//                 </tr>
//               ) : (
//                 currentRentals.map((rental) => (
//                   <tr key={rental.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">{rental.username}</td>
//                     <td className="p-3">{rental.email}</td>
//                     <td className="p-3">{rental.title}</td>
//                     <td className="p-3 capitalize">{rental.mediaType}</td>
//                     <td className="p-3">
//                       {format(new Date(rental.rentalStartDate), 'MMM d, yyyy')}
//                     </td>
//                     <td className="p-3">
//                       {format(new Date(rental.rentalEndDate), 'MMM d, yyyy')}
//                     </td>
//                     <td className="p-3">₦{Number(rental.amount).toFixed(2)}</td>
//                     <td className="p-3">
//                       <Badge 
//                         variant={
//                           getRentalStatus(rental.rentalEndDate) === 'Active' 
//                             ? 'default' 
//                             : 'destructive'
//                         }
//                       >
//                         {getRentalStatus(rental.rentalEndDate)}
//                       </Badge>
//                     </td>
//                     <td className="p-3">
//                       {rental.discountApplied ? (
//                         <Badge className="bg-green-100 text-green-800">
//                           10% Off
//                         </Badge>
//                       ) : (
//                         <span className="text-sm text-gray-500">None</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//            {totalRentalPages > 1 && (
//                     <Pagination 
//                       currentPage={currentRentalPage}
//                       totalPages={totalRentalPages}
//                       pageNumbers={rentalPageNumbers}
//                       onPageChange={handleRentalPageChange}
//                     />
//                   )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminAllRentals;