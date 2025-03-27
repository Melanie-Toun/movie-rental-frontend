// import { useContentStore } from "@/store/content";
// import { ORIGINAL_IMG_BASE_URL } from "@/utils/constants";
// import axios from "axios";
// import { Search } from "lucide-react";
// import { useState } from "react"
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

// const SearchPage = () => {

//     const [activeTab, setActiveTab] = useState("movie");
//     const [searchTerm, setSearchTerm] = useState("");

//     const [results, setResults] = useState([]);
//     const {setContentType} = useContentStore();

//     const handleTabClick = (tab) =>{
//         setActiveTab(tab);
//         tab === "movie" ? setContentType("movie") : setContentType("tv")
//         setResults([]);
//     }

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.get(`/api/search/${activeTab}/${searchTerm}`);
//         setResults(res.data.content);
//         } catch (error) {
//             if (error.response.status === 404) {
//                 toast.error("Nothing found, make sure you are searching under the right category")
//         } else {
//             toast.error("An error occurred while searching");
//         }
//       }
//     };

//     console.log("results", results)

//   return (
//     <div className="bg-black min-h-screen text-white">
//   <div className="container mx-auto px-4 py-8">
//     <div className="flex flex-col md:flex-row justify-between items-center mt-11 mb-4 gap-4 md:gap-0">
//       <div className="flex gap-2 sm:gap-4">
//         <button
//           className={`border-2 border-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md ${
//             activeTab === "movie" ? "bg-white text-black" : "bg-transparent text-white"
//           } hover:bg-white hover:text-black`}
//           onClick={() => handleTabClick("movie")}
//         >
//           Movies
//         </button>
//         <button
//           className={`border-2 border-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md ${
//             activeTab === "tv" ? "bg-white text-black" : "bg-transparent text-white"
//           } hover:bg-white hover:text-black`}
//           onClick={() => handleTabClick("tv")}
//         >
//           TV Shows
//         </button>
//         <button
//           className={`border-2 border-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md ${
//             activeTab === "person" ? "bg-white text-black" : "bg-transparent text-white"
//           } hover:bg-white hover:text-black`}
//           onClick={() => handleTabClick("person")}
//         >
//           Person
//         </button>
//       </div>

//       <form className="flex gap-2 items-stretch w-full sm:w-80 md:w-96" onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder={"Search for a " + activeTab}
//           className="border-2 border-white text-black w-full p-2 text-xs sm:text-sm rounded-md"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button className="border-2 border-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md">
//           <Search className="size-4" />
//         </button>
//       </form>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {results.map((result) => {
//         if (!result.poster_path && !result.profile_path) return null;
//         return (
//           <div key={result.id} className="bg-gray-800 p-3 sm:p-4 mt-4 sm:mt-7 rounded">
//             {activeTab === "person" ? (
//               <Link to={"/actor/" + result.name} className="flex flex-col items-center">
//                 <img
//                   src={ORIGINAL_IMG_BASE_URL + result.profile_path}
//                   alt={result.name}
//                   className="max-h-80 sm:max-h-96 rounded mx-auto"
//                 />
//                 <h2 className="mt-2 text-lg sm:text-xl font-bold">{result.name}</h2>
//               </Link>
//             ) : (
//               <Link to={"/watch/" + result.id} onClick={() => {
//                 setContentType(activeTab);
//               }}>
//                 <img
//                   src={ORIGINAL_IMG_BASE_URL + result.poster_path}
//                   alt={result.title || result.name}
//                   className="w-full h-auto rounded"
//                 />
//                 <h2 className="mt-2 text-lg sm:text-xl font-bold">{result.title || result.name}</h2>
//               </Link>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   </div>
// </div>

//   )
// }

// export default SearchPage
