import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({category}) => {
    const {contentType} = useContentStore();
    const [content, setContent] = useState([]);
    const [showArrows, setShowArrows] = useState(false);
    const sliderRef = useRef(null);

    const formattedCategoryName = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

    useEffect(() => {
        const getContent = async () => {
            try {
                let res;
                if (contentType === "movies") {
                    res = await axios.get('/api/admin/movies');
                    console.log("Movies API Response:", res.data); // Debugging
                    let filteredMovies = (res.data.movies || []).filter(movie => {  // Ensure movies is an array
                        switch(category) {
                            case 'popular': return movie.isAction;
                            case 'top_rated': return movie.isComedy;
                            case 'upcoming': return movie.isHorror;
                            case 'now_playing': return movie.isDrama;
                            case 'rentals': return true;
                            default: return false;
                        }
                    });
                    setContent(filteredMovies);
                } else {
                    res = await axios.get('/api/admin/tvshows');
                    console.log("TV Shows API Response:", res.data); // Debugging
                    let filteredTvShows = (res.data.tvShows || []).filter(show => { // Ensure tvShows is an array
                        switch(category) {
                            case 'popular': return show.isAction;
                            case 'on_the_air': return show.isComedy;
                            case 'top_rated': return show.isHorror;
                            case 'airing_today': return show.isDrama;
                            case 'rentals': return true;
                            default: return false;
                        }
                    });
                    setContent(filteredTvShows);
                }
            } catch (error) {
                console.error("Error fetching content:", error);
                setContent([]);
            }            
        };
        getContent();
    }, [contentType, category]);


    const scrollLeft = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: -sliderRef.current.offsetWidth, behavior: 'smooth'});
        }
    };

    const scrollRight = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollBy({left: sliderRef.current.offsetWidth, behavior: 'smooth'});
        }
    };

    const formatPrice = (price) => {
        const numPrice = parseFloat(price);
        return !isNaN(numPrice) ? numPrice.toFixed(2) : "0.00";
    };

    const getImageUrl = (backdropPath) => {
        return backdropPath || '/placeholder-image.jpg';
    };

    const getLinkPath = () => '/browse';

    if (content.length === 0) return null;

    return (
    <div 
        className="bg-black text-white relative px-5 md:px-10"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
    >
        <h2 className="
  relative 
  mb-4 
  text-2xl 
  md:text-3xl 
  font-black 
  text-transparent 
  bg-clip-text 
  bg-gradient-to-r 
  from-white 
  via-gray-200 
  to-gray-500 
  inline-block 
  tracking-wider 
  uppercase 
  pb-2 
  transition-all 
  duration-300 
  hover:scale-105 
  hover:text-shadow-lg 
  after:absolute 
  after:bottom-0 
  after:left-0 
  after:w-full 
  after:h-1 
  after:bg-gradient-to-r 
  after:from-purple-600 
  after:via-pink-500 
  after:to-red-500 
  after:scale-x-0 
  after:origin-left 
  after:transition-transform 
  after:duration-300 
  hover:after:scale-x-100
">
  {formattedCategoryName} {formattedContentType}
</h2>

        <div className="flex space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide" ref={sliderRef}>
            {content.map((item) => (
                <Link 
                    to={getLinkPath()} 
                    className="relative group min-w-[230px]" 
                    key={item.id}
                >
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src={getImageUrl(item.backdropPath)}
                            alt={item.title}
                            className="transition-transform w-[230px] h-[170px] object-cover duration-300 ease-in-out group-hover:scale-110 shadow-lg"
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-sm">{item.title}</p>
                        <p className="text-green-500 text-sm mt-1">
                            Rent for ₦{formatPrice(item.rentPrice)}
                        </p>
                    </div>
                </Link>
            ))}
        </div>

        {showArrows && content.length > 0 && (
            <>
                <button 
                    className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-14 md:size-16 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all"
                    onClick={scrollLeft}
                > 
                    <ChevronLeft size={24}/>
                </button>

                <button 
                    className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-14 md:size-16 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all"
                    onClick={scrollRight}
                > 
                    <ChevronRight size={24}/>
                </button>
            </>
        )}
    </div>
);

};

export default MovieSlider;