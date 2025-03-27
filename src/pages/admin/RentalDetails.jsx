// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { format } from 'date-fns';

// const RentalDetails = () => {
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRentals();
//   }, []);

//   const fetchRentals = async () => {
//     try {
//       const response = await fetch('/api/payment/rentals', {
//         credentials: 'include'
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         setRentals(data.rentals);
//       }
//     } catch (error) {
//       console.error('Error fetching rentals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRentalStatus = (endDate) => {
//     const now = new Date();
//     const end = new Date(endDate);
//     return now <= end ? 'Active' : 'Expired';
//   };

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
//         <CardTitle>My Rentals</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="px-4 py-2 text-left">Media</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Rental Start</th>
//                 <th className="px-4 py-2 text-left">Rental End</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rentals.map((rental) => (
//                 <tr key={rental.id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2">{rental.title}</td>
//                   <td className="px-4 py-2">
//                     <span className="capitalize">{rental.mediaType}</span>
//                   </td>
//                   <td className="px-4 py-2">
//                     {format(new Date(rental.rentalStartDate), 'MMM d, yyyy')}
//                   </td>
//                   <td className="px-4 py-2">
//                     {format(new Date(rental.rentalEndDate), 'MMM d, yyyy')}
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className={`px-2 py-1 rounded-full text-sm ${
//                       getRentalStatus(rental.rentalEndDate) === 'Active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {getRentalStatus(rental.rentalEndDate)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default RentalDetails;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authUser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useAuthStore } from '../../store/authUser'; 

const RentalDetails = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  // Pagination states
    const [currentRentalPage, setCurrentRentalPage] = useState(1);
    const [rentalsPerPage] = useState(5);
    
    // Total pages calculation
    const totalRentalPages = Math.ceil(rentals.length / rentalsPerPage);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/payment/rentals', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setRentals(data.rentals);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {user?.username ? `${user.username}'s Rentals` : 'My Rentals'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Media</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Rental Start</th>
                <th className="px-4 py-2 text-left">Rental End</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRentals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No active rentals
                  </td>
                </tr>
              ) : (
                currentRentals.map((rental) => (
                  <tr key={rental.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{rental.title}</td>
                    <td className="px-4 py-2">
                      <span className="capitalize">{rental.mediaType}</span>
                    </td>
                    <td className="px-4 py-2">
                      {format(new Date(rental.rentalStartDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2">
                      {format(new Date(rental.rentalEndDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        getRentalStatus(rental.rentalEndDate) === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getRentalStatus(rental.rentalEndDate)}
                      </span>
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

export default RentalDetails;