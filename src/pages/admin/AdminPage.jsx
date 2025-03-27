import { useState, useEffect } from "react";
import { Plus, Trash2, Film, Tv, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { uploadMedia } from "../../utils/cloudinary";

const AdminPage = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isAddingTvShow, setIsAddingTvShow] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");
  const [formErrors, setFormErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Pagination states
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentTvPage, setCurrentTvPage] = useState(1);
  const [moviesPerPage] = useState(5);
  const [tvShowsPerPage] = useState(5);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingTvShows, setIsLoadingTvShows] = useState(false);
  
  // Total pages calculation
  const totalMoviePages = Math.ceil(movies.length / moviesPerPage);
  const totalTvPages = Math.ceil(tvShows.length / tvShowsPerPage);

  // Form states
  const [movieForm, setMovieForm] = useState({
    title: "",
    overview: "",
    posterFile: null,
    backdropFile: null,
    releaseDate: "",
    runtime: "",
    genres: "",
    cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
    isAction: false,
    isComedy: false,
    isDrama: false,
    isHorror: false,
    rating: "",
    trailer: "",
    trailerFile: null,
    rentPrice: "0.00",
  });

  const [tvShowForm, setTvShowForm] = useState({
    title: "",
    overview: "",
    posterFile: null,
    backdropFile: null,
    firstAirDate: "",
    lastAirDate: "",
    numberOfSeasons: "",
    numberOfEpisodes: "",
    genres: "",
    cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
    isAction: false,
    isComedy: false,
    isDrama: false,
    isHorror: false,
    rating: "",
    trailer: "",
    trailerFile: null,
    rentPrice: "0.00",
  });

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  const fetchMovies = async () => {
    setIsLoadingMovies(true);
    try {
      const response = await fetch("/api/admin/movies");
      const data = await response.json();
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const fetchTvShows = async () => {
    setIsLoadingTvShows(true);
    try {
      const response = await fetch("/api/admin/tvshows");
      const data = await response.json();
      if (data.success) {
        setTvShows(data.tvShows);
      }
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    } finally {
      setIsLoadingTvShows(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Upload images and trailer to Cloudinary
      const posterUrl = await uploadMedia(movieForm.posterFile, "image");
      const backdropUrl = movieForm.backdropFile
        ? await uploadMedia(movieForm.backdropFile, "image")
        : null;
      const trailerUrl = movieForm.trailerFile
        ? await uploadMedia(movieForm.trailerFile, "video")
        : null;
  
      // Filter out empty cast members
      const filteredCast = movieForm.cast.filter(member => member.name.trim() !== "");
  
      const response = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...movieForm,
          posterPath: posterUrl,
          backdropPath: backdropUrl,
          trailer: trailerUrl,
          genres: movieForm.genres.split(",").map((g) => g.trim()),
          cast: filteredCast,
        }),
      });
  
      if (response.ok) {
        setIsAddingMovie(false);
        fetchMovies();
        // Reset form
        setMovieForm({
          title: "",
          overview: "",
          posterFile: null,
          backdropFile: null,
          trailerFile: null,
          releaseDate: "",
          runtime: "",
          genres: "",
          cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
          isAction: false,
          isComedy: false,
          isDrama: false,
          isHorror: false,
          rating: "",
          trailer: "",
          rentPrice: "0.00",
        });
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTvShow = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Upload media files to Cloudinary
      const posterUrl = await uploadMedia(tvShowForm.posterFile, "image");
      const backdropUrl = tvShowForm.backdropFile
        ? await uploadMedia(tvShowForm.backdropFile, "image")
        : null;
      const trailerUrl = tvShowForm.trailerFile
        ? await uploadMedia(tvShowForm.trailerFile, "video")
        : null;

      // Filter out empty cast members
      const filteredCast = tvShowForm.cast.filter(member => member.name.trim() !== "");

      const response = await fetch("/api/admin/tvshows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tvShowForm,
          posterPath: posterUrl,
          backdropPath: backdropUrl,
          trailer: trailerUrl,
          genres: tvShowForm.genres.split(",").map((g) => g.trim()),
          cast: filteredCast,
        }),
      });

      if (response.ok) {
        setIsAddingTvShow(false);
        fetchTvShows();
        // Reset form
        setTvShowForm({
          title: "",
          overview: "",
          posterFile: null,
          backdropFile: null,
          trailerFile: null,
          firstAirDate: "",
          lastAirDate: "",
          numberOfSeasons: "",
          numberOfEpisodes: "",
          genres: "",
          cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
          isAction: false,
          isComedy: false,
          isDrama: false,
          isHorror: false,
          trailer: "",
          rating: "",
          rentPrice: "0.00",
        });
      }
    } catch (error) {
      console.error("Error adding TV show:", error);
    } finally {
      setIsUploading(false);
    }
  };


  const handleDelete = async (type, id) => {
    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (type === "movies") {
          fetchMovies();
        } else {
          fetchTvShows();
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "₦0.00";
    return `₦${Number(price).toFixed(2)}`;
  };

  // Handle cast member changes for movies
  const handleMovieCastChange = (index, field, value) => {
    const updatedCast = [...movieForm.cast];
    updatedCast[index] = {
      ...updatedCast[index],
      [field]: value
    };
    setMovieForm({
      ...movieForm,
      cast: updatedCast
    });
  };

  // Handle cast member changes for TV shows
  const handleTvCastChange = (index, field, value) => {
    const updatedCast = [...tvShowForm.cast];
    updatedCast[index] = {
      ...updatedCast[index],
      [field]: value
    };
    setTvShowForm({
      ...tvShowForm,
      cast: updatedCast
    });
  };

  // Add new cast member for movies
  const addMovieCastMember = () => {
    setMovieForm({
      ...movieForm,
      cast: [...movieForm.cast, { name: "", role: "Actor", character: "", profilePath: "" }]
    });
  };

  // Add new cast member for TV shows
  const addTvCastMember = () => {
    setTvShowForm({
      ...tvShowForm,
      cast: [...tvShowForm.cast, { name: "", role: "Actor", character: "", profilePath: "" }]
    });
  };

  // Remove cast member for movies
  const removeMovieCastMember = (index) => {
    const updatedCast = [...movieForm.cast];
    updatedCast.splice(index, 1);
    setMovieForm({
      ...movieForm,
      cast: updatedCast
    });
  };

  // Remove cast member for TV shows
  const removeTvCastMember = (index) => {
    const updatedCast = [...tvShowForm.cast];
    updatedCast.splice(index, 1);
    setTvShowForm({
      ...tvShowForm,
      cast: updatedCast
    });
  };

  // Pagination handlers
  const handleMoviePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalMoviePages) return;
    setCurrentMoviePage(pageNumber);
  };

  const handleTvPageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalTvPages) return;
    setCurrentTvPage(pageNumber);
  };

  // Get current page items
  const indexOfLastMovie = currentMoviePage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const indexOfLastTvShow = currentTvPage * tvShowsPerPage;
  const indexOfFirstTvShow = indexOfLastTvShow - tvShowsPerPage;
  const currentTvShows = tvShows.slice(indexOfFirstTvShow, indexOfLastTvShow);

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

  const moviePageNumbers = generatePageNumbers(currentMoviePage, totalMoviePages);
  const tvPageNumbers = generatePageNumbers(currentTvPage, totalTvPages);

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

  // Loading overlay for forms
  const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium">Uploading media files...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isUploading} />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies
              </TabsTrigger>
              <TabsTrigger value="tvshows" className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                TV Shows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Movies</h3>
                <Dialog open={isAddingMovie} onOpenChange={setIsAddingMovie}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Movie
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Movie</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMovie} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={movieForm.title}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="releaseDate">Release Date</Label>
                          <Input
                            id="releaseDate"
                            type="date"
                            value={movieForm.releaseDate}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                releaseDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating">Rating</Label>
                          <Input
                            id="rating"
                            value={movieForm.rating}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                rating: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="genres">
                            Genres (comma-separated)
                          </Label>
                          <Input
                            id="genres"
                            value={movieForm.genres}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                genres: e.target.value,
                              })
                            }
                            placeholder="Drama, Action, Comedy"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rentPrice">Rental Price (₦)</Label>
                          <Input
                            id="rentPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={movieForm.rentPrice}
                            onChange={(e) => {
                              setMovieForm({
                                ...movieForm,
                                rentPrice: e.target.value,
                              });
                              setFormErrors({ ...formErrors, rentPrice: null });
                            }}
                            className={
                              formErrors.rentPrice ? "border-red-500" : ""
                            }
                            required
                          />
                          {formErrors.rentPrice && (
                            <p className="text-sm text-red-500">
                              {formErrors.rentPrice}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="runtime">Runtime (minutes)</Label>
                          <Input
                            id="runtime"
                            type="number"
                            value={movieForm.runtime}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                runtime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isAction"
                            checked={movieForm.isAction}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                isAction: e.target.checked,
                                isComedy: false,
                                isDrama: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="isAction">Popular Movies</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isComedy"
                            checked={movieForm.isComedy}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                isComedy: e.target.checked,
                                isAction: false,
                                isDrama: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="isComedy">Top Rated</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isDrama"
                            checked={movieForm.isDrama}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                isDrama: e.target.checked,
                                isAction: false,
                                isComedy: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="isDrama">Now Playing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isHorror"
                            checked={movieForm.isHorror}
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                isHorror: e.target.checked,
                                isAction: false,
                                isComedy: false,
                                isDrama: false,
                              })
                            }
                          />
                          <Label htmlFor="isHorror">Upcoming</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="overview">Overview</Label>
                        <Textarea
                          id="overview"
                          value={movieForm.overview}
                          onChange={(e) =>
                            setMovieForm({
                              ...movieForm,
                              overview: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {/* Cast Members Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Cast Members</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={addMovieCastMember}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add Cast Member
                          </Button>
                        </div>
                        
                        {movieForm.cast.map((member, index) => (
                          <div key={index} className="p-3 border rounded-md space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Cast Member {index + 1}</h4>
                              {movieForm.cast.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeMovieCastMember(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`cast-${index}-name`}>Name</Label>
                                <Input
                                  id={`cast-${index}-name`}
                                  value={member.name}
                                  onChange={(e) => handleMovieCastChange(index, 'name', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cast-${index}-role`}>Role</Label>
                                <select
                                  id={`cast-${index}-role`}
                                  value={member.role}
                                  onChange={(e) => handleMovieCastChange(index, 'role', e.target.value)}
                                  className="w-full h-10 px-3 border rounded-md"
                                  required
                                >
                                  <option value="Actor">Actor</option>
                                  <option value="Director">Director</option>
                                  <option value="Producer">Producer</option>
                                  <option value="Writer">Writer</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cast-${index}-character`}>Character (for actors)</Label>
                                <Input
                                  id={`cast-${index}-character`}
                                  value={member.character}
                                  onChange={(e) => handleMovieCastChange(index, 'character', e.target.value)}
                                  disabled={member.role !== 'Actor'}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cast-${index}-profilePath`}>Profile URL</Label>
                                <Input
                                  id={`cast-${index}-profilePath`}
                                  value={member.profilePath}
                                  onChange={(e) => handleMovieCastChange(index, 'profilePath', e.target.value)}
                                  placeholder="https://example.com/profile.jpg"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="poster">Poster Image</Label>
                          <Input
                            id="poster"
                            type="file"
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                posterFile: e.target.files[0],
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backdrop">Backdrop Image</Label>
                          <Input
                            id="backdrop"
                            type="file"
                            onChange={(e) =>
                              setMovieForm({
                                ...movieForm,
                                backdropFile: e.target.files[0],
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trailer">Trailer Video</Label>
                        <Input
                          id="trailer"
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            setMovieForm({
                              ...movieForm,
                              trailerFile: e.target.files[0],
                            })
                          }
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Add Movie"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingMovies ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Release Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rent Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMovies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No movies found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentMovies.map((movie) => (
                          <TableRow key={movie.id}>
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>
                              {new Date(movie.releaseDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{movie.rating}</TableCell>
                            <TableCell>{formatPrice(movie.rentPrice)}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete("movies", movie.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {totalMoviePages > 1 && (
                    <Pagination 
                      currentPage={currentMoviePage}
                      totalPages={totalMoviePages}
                      pageNumbers={moviePageNumbers}
                      onPageChange={handleMoviePageChange}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="tvshows">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">TV Shows</h3>
                <Dialog open={isAddingTvShow} onOpenChange={setIsAddingTvShow}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add TV Show
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New TV Show</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTvShow} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tvTitle">Title</Label>
                          <Input
                            id="tvTitle"
                            value={tvShowForm.title}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="firstAirDate">First Air Date</Label>
                          <Input
                            id="firstAirDate"
                            type="date"
                            value={tvShowForm.firstAirDate}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                firstAirDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastAirDate">Last Air Date</Label>
                          <Input
                            id="lastAirDate"
                            type="date"
                            value={tvShowForm.lastAirDate}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                lastAirDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tvRating">Rating</Label>
                          <Input
                            id="tvRating"
                            value={tvShowForm.rating}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                rating: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tvGenres">
                            Genres (comma-separated)
                          </Label>
                          <Input
                            id="tvGenres"
                            value={tvShowForm.genres}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                genres: e.target.value,
                              })
                            }
                            placeholder="Drama, Comedy, Sci-Fi"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numberOfSeasons">Number of Seasons</Label>
                          <Input
                            id="numberOfSeasons"
                            type="number"
                            min="1"
                            value={tvShowForm.numberOfSeasons}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                numberOfSeasons: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numberOfEpisodes">Number of Episodes</Label>
                          <Input
                            id="numberOfEpisodes"
                            type="number"
                            min="1"
                            value={tvShowForm.numberOfEpisodes}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                numberOfEpisodes: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tvRentPrice">Rental Price (₦)</Label>
                          <Input
                            id="tvRentPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={tvShowForm.rentPrice}
                            onChange={(e) => {
                              setTvShowForm({
                                ...tvShowForm,
                                rentPrice: e.target.value,
                              });
                              setFormErrors({ ...formErrors, tvRentPrice: null });
                            }}
                            className={
                              formErrors.tvRentPrice ? "border-red-500" : ""
                            }
                            required
                          />
                          {formErrors.tvRentPrice && (
                            <p className="text-sm text-red-500">
                              {formErrors.tvRentPrice}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tvIsAction"
                            checked={tvShowForm.isAction}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                isAction: e.target.checked,
                                isComedy: false,
                                isDrama: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="tvIsAction">Popular Shows</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tvIsComedy"
                            checked={tvShowForm.isComedy}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                isComedy: e.target.checked,
                                isAction: false,
                                isDrama: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="tvIsComedy">Top Rated</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tvIsDrama"
                            checked={tvShowForm.isDrama}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                isDrama: e.target.checked,
                                isAction: false,
                                isComedy: false,
                                isHorror: false,
                              })
                            }
                          />
                          <Label htmlFor="tvIsDrama">Currently Airing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tvIsHorror"
                            checked={tvShowForm.isHorror}
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                isHorror: e.target.checked,
                                isAction: false,
                                isComedy: false,
                                isDrama: false,
                              })
                            }
                          />
                          <Label htmlFor="tvIsHorror">Upcoming</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tvOverview">Overview</Label>
                        <Textarea
                          id="tvOverview"
                          value={tvShowForm.overview}
                          onChange={(e) =>
                            setTvShowForm({
                              ...tvShowForm,
                              overview: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {/* Cast Members Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Cast Members</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={addTvCastMember}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add Cast Member
                          </Button>
                        </div>
                        
                        {tvShowForm.cast.map((member, index) => (
                          <div key={index} className="p-3 border rounded-md space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Cast Member {index + 1}</h4>
                              {tvShowForm.cast.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeTvCastMember(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`tv-cast-${index}-name`}>Name</Label>
                                <Input
                                  id={`tv-cast-${index}-name`}
                                  value={member.name}
                                  onChange={(e) => handleTvCastChange(index, 'name', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tv-cast-${index}-role`}>Role</Label>
                                <select
                                  id={`tv-cast-${index}-role`}
                                  value={member.role}
                                  onChange={(e) => handleTvCastChange(index, 'role', e.target.value)}
                                  className="w-full h-10 px-3 border rounded-md"
                                  required
                                >
                                  <option value="Actor">Actor</option>
                                  <option value="Director">Director</option>
                                  <option value="Producer">Producer</option>
                                  <option value="Creator">Creator</option>
                                  <option value="Writer">Writer</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tv-cast-${index}-character`}>Character (for actors)</Label>
                                <Input
                                  id={`tv-cast-${index}-character`}
                                  value={member.character}
                                  onChange={(e) => handleTvCastChange(index, 'character', e.target.value)}
                                  disabled={member.role !== 'Actor'}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tv-cast-${index}-profilePath`}>Profile URL</Label>
                                <Input
                                  id={`tv-cast-${index}-profilePath`}
                                  value={member.profilePath}
                                  onChange={(e) => handleTvCastChange(index, 'profilePath', e.target.value)}
                                  placeholder="https://example.com/profile.jpg"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tvPoster">Poster Image</Label>
                          <Input
                            id="tvPoster"
                            type="file"
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                posterFile: e.target.files[0],
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tvBackdrop">Backdrop Image</Label>
                          <Input
                            id="tvBackdrop"
                            type="file"
                            onChange={(e) =>
                              setTvShowForm({
                                ...tvShowForm,
                                backdropFile: e.target.files[0],
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tvTrailer">Trailer Video</Label>
                        <Input
                          id="tvTrailer"
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            setTvShowForm({
                              ...tvShowForm,
                              trailerFile: e.target.files[0],
                            })
                          }
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Add TV Show"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingTvShows ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>First Air Date</TableHead>
                        <TableHead>Seasons</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rent Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTvShows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No TV shows found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentTvShows.map((show) => (
                          <TableRow key={show.id}>
                            <TableCell>{show.title}</TableCell>
                            <TableCell>
                              {new Date(show.firstAirDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{show.numberOfSeasons}</TableCell>
                            <TableCell>{show.rating}</TableCell>
                            <TableCell>{formatPrice(show.rentPrice)}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete("tvshows", show.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {totalTvPages > 1 && (
                    <Pagination 
                      currentPage={currentTvPage}
                      totalPages={totalTvPages}
                      pageNumbers={tvPageNumbers}
                      onPageChange={handleTvPageChange}
                    />
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;


// import React, { useState, useEffect } from "react";
// import { Plus, Trash2, Film, Tv, X } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { uploadMedia } from "../../utils/cloudinary";

// const AdminPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [tvShows, setTvShows] = useState([]);
//   const [isAddingMovie, setIsAddingMovie] = useState(false);
//   const [isAddingTvShow, setIsAddingTvShow] = useState(false);
//   const [activeTab, setActiveTab] = useState("movies");
//   const [formErrors, setFormErrors] = useState({});

//   // Form states
//   const [movieForm, setMovieForm] = useState({
//     title: "",
//     overview: "",
//     posterFile: null,
//     backdropFile: null,
//     releaseDate: "",
//     runtime: "",
//     genres: "",
//     cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
//     isAction: false,
//     isComedy: false,
//     isDrama: false,
//     isHorror: false,
//     rating: "",
//     trailer: "",
//     trailerFile: null,
//     rentPrice: "0.00",
//   });

//   const [tvShowForm, setTvShowForm] = useState({
//     title: "",
//     overview: "",
//     posterFile: null,
//     backdropFile: null,
//     firstAirDate: "",
//     lastAirDate: "",
//     numberOfSeasons: "",
//     numberOfEpisodes: "",
//     genres: "",
//     cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
//     isAction: false,
//     isComedy: false,
//     isDrama: false,
//     isHorror: false,
//     rating: "",
//     trailer: "",
//     trailerFile: null,
//     rentPrice: "0.00",
//   });

//   useEffect(() => {
//     fetchMovies();
//     fetchTvShows();
//   }, []);

//   const fetchMovies = async () => {
//     try {
//       const response = await fetch("/api/admin/movies");
//       const data = await response.json();
//       if (data.success) {
//         setMovies(data.movies);
//       }
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//     }
//   };

//   const fetchTvShows = async () => {
//     try {
//       const response = await fetch("/api/admin/tvshows");
//       const data = await response.json();
//       if (data.success) {
//         setTvShows(data.tvShows);
//       }
//     } catch (error) {
//       console.error("Error fetching TV shows:", error);
//     }
//   };

//   const handleAddMovie = async (e) => {
//     e.preventDefault();
//     try {
//       // Upload images and trailer to Cloudinary
//       const posterUrl = await uploadMedia(movieForm.posterFile, "image");
//       const backdropUrl = movieForm.backdropFile
//         ? await uploadMedia(movieForm.backdropFile, "image")
//         : null;
//       const trailerUrl = movieForm.trailerFile
//         ? await uploadMedia(movieForm.trailerFile, "video")
//         : null;
  
//       // Filter out empty cast members
//       const filteredCast = movieForm.cast.filter(member => member.name.trim() !== "");
  
//       const response = await fetch("/api/admin/movies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...movieForm,
//           posterPath: posterUrl,
//           backdropPath: backdropUrl,
//           trailer: trailerUrl,
//           genres: movieForm.genres.split(",").map((g) => g.trim()),
//           cast: filteredCast,
//         }),
//       });
  
//       if (response.ok) {
//         setIsAddingMovie(false);
//         fetchMovies();
//         // Reset form
//         setMovieForm({
//           title: "",
//           overview: "",
//           posterFile: null,
//           backdropFile: null,
//           trailerFile: null,
//           releaseDate: "",
//           runtime: "",
//           genres: "",
//           cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
//           isAction: false,
//           isComedy: false,
//           isDrama: false,
//           isHorror: false,
//           rating: "",
//           trailer: "",
//           rentPrice: "0.00",
//         });
//       }
//     } catch (error) {
//       console.error("Error adding movie:", error);
//     }
//   };

//   const handleAddTvShow = async (e) => {
//     e.preventDefault();
//     try {
//       // Upload media files to Cloudinary
//       const posterUrl = await uploadMedia(tvShowForm.posterFile, "image");
//       const backdropUrl = tvShowForm.backdropFile
//         ? await uploadMedia(tvShowForm.backdropFile, "image")
//         : null;
//       const trailerUrl = tvShowForm.trailerFile
//         ? await uploadMedia(tvShowForm.trailerFile, "video")
//         : null;

//       // Filter out empty cast members
//       const filteredCast = tvShowForm.cast.filter(member => member.name.trim() !== "");

//       const response = await fetch("/api/admin/tvshows", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...tvShowForm,
//           posterPath: posterUrl,
//           backdropPath: backdropUrl,
//           trailer: trailerUrl,
//           genres: tvShowForm.genres.split(",").map((g) => g.trim()),
//           cast: filteredCast,
//         }),
//       });

//       if (response.ok) {
//         setIsAddingTvShow(false);
//         fetchTvShows();
//         // Reset form
//         setTvShowForm({
//           title: "",
//           overview: "",
//           posterFile: null,
//           backdropFile: null,
//           trailerFile: null,
//           firstAirDate: "",
//           lastAirDate: "",
//           numberOfSeasons: "",
//           numberOfEpisodes: "",
//           genres: "",
//           cast: [{ name: "", role: "Actor", character: "", profilePath: "" }],
//           isAction: false,
//           isComedy: false,
//           isDrama: false,
//           isHorror: false,
//           trailer: "",
//           rating: "",
//           rentPrice: "0.00",
//         });
//       }
//     } catch (error) {
//       console.error("Error adding TV show:", error);
//     }
//   };

//   const handleDelete = async (type, id) => {
//     try {
//       const response = await fetch(`/api/admin/${type}/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         if (type === "movies") {
//           fetchMovies();
//         } else {
//           fetchTvShows();
//         }
//       }
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const formatPrice = (price) => {
//     if (price === null || price === undefined) return "₦0.00";
//     return `₦${Number(price).toFixed(2)}`;
//   };

//   // Handle cast member changes for movies
//   const handleMovieCastChange = (index, field, value) => {
//     const updatedCast = [...movieForm.cast];
//     updatedCast[index] = {
//       ...updatedCast[index],
//       [field]: value
//     };
//     setMovieForm({
//       ...movieForm,
//       cast: updatedCast
//     });
//   };

//   // Handle cast member changes for TV shows
//   const handleTvCastChange = (index, field, value) => {
//     const updatedCast = [...tvShowForm.cast];
//     updatedCast[index] = {
//       ...updatedCast[index],
//       [field]: value
//     };
//     setTvShowForm({
//       ...tvShowForm,
//       cast: updatedCast
//     });
//   };

//   // Add new cast member for movies
//   const addMovieCastMember = () => {
//     setMovieForm({
//       ...movieForm,
//       cast: [...movieForm.cast, { name: "", role: "Actor", character: "", profilePath: "" }]
//     });
//   };

//   // Add new cast member for TV shows
//   const addTvCastMember = () => {
//     setTvShowForm({
//       ...tvShowForm,
//       cast: [...tvShowForm.cast, { name: "", role: "Actor", character: "", profilePath: "" }]
//     });
//   };

//   // Remove cast member for movies
//   const removeMovieCastMember = (index) => {
//     const updatedCast = [...movieForm.cast];
//     updatedCast.splice(index, 1);
//     setMovieForm({
//       ...movieForm,
//       cast: updatedCast
//     });
//   };

//   // Remove cast member for TV shows
//   const removeTvCastMember = (index) => {
//     const updatedCast = [...tvShowForm.cast];
//     updatedCast.splice(index, 1);
//     setTvShowForm({
//       ...tvShowForm,
//       cast: updatedCast
//     });
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="mb-4">
//               <TabsTrigger value="movies" className="flex items-center gap-2">
//                 <Film className="w-4 h-4" />
//                 Movies
//               </TabsTrigger>
//               <TabsTrigger value="tvshows" className="flex items-center gap-2">
//                 <Tv className="w-4 h-4" />
//                 TV Shows
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="movies">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold">Movies</h3>
//                 <Dialog open={isAddingMovie} onOpenChange={setIsAddingMovie}>
//                   <DialogTrigger asChild>
//                     <Button className="flex items-center gap-2">
//                       <Plus className="w-4 h-4" />
//                       Add Movie
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                       <DialogTitle>Add New Movie</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleAddMovie} className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="title">Title</Label>
//                           <Input
//                             id="title"
//                             value={movieForm.title}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 title: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="releaseDate">Release Date</Label>
//                           <Input
//                             id="releaseDate"
//                             type="date"
//                             value={movieForm.releaseDate}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 releaseDate: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="rating">Rating</Label>
//                           <Input
//                             id="rating"
//                             value={movieForm.rating}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 rating: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="genres">
//                             Genres (comma-separated)
//                           </Label>
//                           <Input
//                             id="genres"
//                             value={movieForm.genres}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 genres: e.target.value,
//                               })
//                             }
//                             placeholder="Drama, Action, Comedy"
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="rentPrice">Rental Price (₦)</Label>
//                           <Input
//                             id="rentPrice"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={movieForm.rentPrice}
//                             onChange={(e) => {
//                               setMovieForm({
//                                 ...movieForm,
//                                 rentPrice: e.target.value,
//                               });
//                               setFormErrors({ ...formErrors, rentPrice: null });
//                             }}
//                             className={
//                               formErrors.rentPrice ? "border-red-500" : ""
//                             }
//                             required
//                           />
//                           {formErrors.rentPrice && (
//                             <p className="text-sm text-red-500">
//                               {formErrors.rentPrice}
//                             </p>
//                           )}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="runtime">Runtime (minutes)</Label>
//                           <Input
//                             id="runtime"
//                             type="number"
//                             value={movieForm.runtime}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 runtime: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-4 gap-4 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isAction"
//                             checked={movieForm.isAction}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 isAction: e.target.checked,
//                                 isComedy: false,
//                                 isDrama: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isAction">Popular Movies</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isComedy"
//                             checked={movieForm.isComedy}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 isComedy: e.target.checked,
//                                 isAction: false,
//                                 isDrama: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isComedy">Top Rated</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isDrama"
//                             checked={movieForm.isDrama}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 isDrama: e.target.checked,
//                                 isAction: false,
//                                 isComedy: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isDrama">Now Playing</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isHorror"
//                             checked={movieForm.isHorror}
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 isHorror: e.target.checked,
//                                 isAction: false,
//                                 isComedy: false,
//                                 isDrama: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isHorror">Upcoming</Label>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="overview">Overview</Label>
//                         <Textarea
//                           id="overview"
//                           value={movieForm.overview}
//                           onChange={(e) =>
//                             setMovieForm({
//                               ...movieForm,
//                               overview: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>

//                       {/* Cast Members Section */}
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <Label>Cast Members</Label>
//                           <Button 
//                             type="button" 
//                             size="sm" 
//                             onClick={addMovieCastMember}
//                             className="flex items-center gap-1"
//                           >
//                             <Plus className="w-4 h-4" /> Add Cast Member
//                           </Button>
//                         </div>
                        
//                         {movieForm.cast.map((member, index) => (
//                           <div key={index} className="p-3 border rounded-md space-y-3">
//                             <div className="flex justify-between items-center">
//                               <h4 className="font-medium">Cast Member {index + 1}</h4>
//                               {movieForm.cast.length > 1 && (
//                                 <Button 
//                                   type="button" 
//                                   variant="ghost" 
//                                   size="sm" 
//                                   onClick={() => removeMovieCastMember(index)}
//                                   className="h-8 w-8 p-0"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <div className="space-y-2">
//                                 <Label htmlFor={`cast-${index}-name`}>Name</Label>
//                                 <Input
//                                   id={`cast-${index}-name`}
//                                   value={member.name}
//                                   onChange={(e) => handleMovieCastChange(index, 'name', e.target.value)}
//                                   required
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`cast-${index}-role`}>Role</Label>
//                                 <select
//                                   id={`cast-${index}-role`}
//                                   value={member.role}
//                                   onChange={(e) => handleMovieCastChange(index, 'role', e.target.value)}
//                                   className="w-full h-10 px-3 border rounded-md"
//                                   required
//                                 >
//                                   <option value="Actor">Actor</option>
//                                   <option value="Director">Director</option>
//                                   <option value="Producer">Producer</option>
//                                   <option value="Writer">Writer</option>
//                                 </select>
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`cast-${index}-character`}>Character (for actors)</Label>
//                                 <Input
//                                   id={`cast-${index}-character`}
//                                   value={member.character}
//                                   onChange={(e) => handleMovieCastChange(index, 'character', e.target.value)}
//                                   disabled={member.role !== 'Actor'}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`cast-${index}-profilePath`}>Profile URL</Label>
//                                 <Input
//                                   id={`cast-${index}-profilePath`}
//                                   value={member.profilePath}
//                                   onChange={(e) => handleMovieCastChange(index, 'profilePath', e.target.value)}
//                                   placeholder="https://example.com/profile.jpg"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="poster">Poster Image</Label>
//                           <Input
//                             id="poster"
//                             type="file"
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 posterFile: e.target.files[0],
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="backdrop">Backdrop Image</Label>
//                           <Input
//                             id="backdrop"
//                             type="file"
//                             onChange={(e) =>
//                               setMovieForm({
//                                 ...movieForm,
//                                 backdropFile: e.target.files[0],
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="trailer">Trailer Video</Label>
//                         <Input
//                           id="trailer"
//                           type="file"
//                           accept="video/*"
//                           onChange={(e) =>
//                             setMovieForm({
//                               ...movieForm,
//                               trailerFile: e.target.files[0],
//                             })
//                           }
//                         />
//                       </div>
                      
//                       <Button type="submit" className="w-full">
//                         Add Movie
//                       </Button>
//                     </form>
//                   </DialogContent>
//                 </Dialog>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Title</TableHead>
//                     <TableHead>Release Date</TableHead>
//                     <TableHead>Rating</TableHead>
//                     <TableHead>Rent Price</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {movies.map((movie) => (
//                     <TableRow key={movie.id}>
//                       <TableCell>{movie.title}</TableCell>
//                       <TableCell>
//                         {new Date(movie.releaseDate).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>{movie.rating}</TableCell>
//                       <TableCell>{formatPrice(movie.rentPrice)}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDelete("movies", movie.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TabsContent>

//             <TabsContent value="tvshows">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold">TV Shows</h3>
//                 <Dialog open={isAddingTvShow} onOpenChange={setIsAddingTvShow}>
//                   <DialogTrigger asChild>
//                     <Button className="flex items-center gap-2">
//                       <Plus className="w-4 h-4" />
//                       Add TV Show
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                       <DialogTitle>Add New TV Show</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleAddTvShow} className="space-y-4 ">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="tvTitle">Title</Label>
//                           <Input
//                             id="tvTitle"
//                             value={tvShowForm.title}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 title: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="firstAirDate">First Air Date</Label>
//                           <Input
//                             id="firstAirDate"
//                             type="date"
//                             value={tvShowForm.firstAirDate}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 firstAirDate: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="lastAirDate">Last Air Date</Label>
//                           <Input
//                             id="lastAirDate"
//                             type="date"
//                             value={tvShowForm.lastAirDate}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 lastAirDate: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="numberOfSeasons">
//                             Number of Seasons
//                           </Label>
//                           <Input
//                             id="numberOfSeasons"
//                             type="number"
//                             value={tvShowForm.numberOfSeasons}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 numberOfSeasons: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="numberOfEpisodes">
//                             Number of Episodes
//                           </Label>
//                           <Input
//                             id="numberOfEpisodes"
//                             type="number"
//                             value={tvShowForm.numberOfEpisodes}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 numberOfEpisodes: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="rentPrice">Rental Price (₦)</Label>
//                           <Input
//                             id="rentPrice"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={tvShowForm.rentPrice}
//                             onChange={(e) => {
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 rentPrice: e.target.value,
//                               });
//                               setFormErrors({ ...formErrors, rentPrice: null });
//                             }}
//                             className={
//                               formErrors.rentPrice ? "border-red-500" : ""
//                             }
//                             required
//                           />
//                           {formErrors.rentPrice && (
//                             <p className="text-sm text-red-500">
//                               {formErrors.rentPrice}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="rating">Rating</Label>
//                           <Input
//                             id="rating"
//                             value={tvShowForm.rating}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 rating: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="genres">Genres (comma-separated)</Label>
//                           <Input
//                             id="genres"
//                             value={tvShowForm.genres}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 genres: e.target.value,
//                               })
//                             }
//                             placeholder="Drama, Action, Comedy"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-4 gap-4 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isAction"
//                             checked={tvShowForm.isAction}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 isAction: e.target.checked,
//                                 isComedy: false,
//                                 isDrama: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isAction">Popular TvShows</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isComedy"
//                             checked={tvShowForm.isComedy}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 isComedy: e.target.checked,
//                                 isAction: false,
//                                 isDrama: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isComedy">On The Air</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isDrama"
//                             checked={tvShowForm.isDrama}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 isDrama: e.target.checked,
//                                 isAction: false,
//                                 isComedy: false,
//                                 isHorror: false,
//                               })
//                             }
//                           />
//                           <Label htmlFor="isDrama">Airing Today</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             id="isHorror"
//                             checked={tvShowForm.isHorror}
//                             onChange={(e) =>
//                               setTvShowForm({
//                                 ...tvShowForm,
//                                 isHorror: e.target.checked,
// isAction: false,
// isComedy: false,
// isDrama: false,
// })
// }
// />
// <Label htmlFor="isHorror">Top Rated</Label>
// </div>
// </div>

// <div className="space-y-2">
// <Label htmlFor="overview">Overview</Label>
// <Textarea
// id="overview"
// value={tvShowForm.overview}
// onChange={(e) =>
// setTvShowForm({
//   ...tvShowForm,
//   overview: e.target.value,
// })
// }
// required
// />
// </div>

// {/* Cast Members Section */}
// <div className="space-y-3">
// <div className="flex justify-between items-center">
// <Label>Cast Members</Label>
// <Button 
// type="button" 
// size="sm" 
// onClick={addTvCastMember}
// className="flex items-center gap-1"
// >
// <Plus className="w-4 h-4" /> Add Cast Member
// </Button>
// </div>

// {tvShowForm.cast.map((member, index) => (
// <div key={index} className="p-3 border rounded-md space-y-3">
// <div className="flex justify-between items-center">
//   <h4 className="font-medium">Cast Member {index + 1}</h4>
//   {tvShowForm.cast.length > 1 && (
//     <Button 
//       type="button" 
//       variant="ghost" 
//       size="sm" 
//       onClick={() => removeTvCastMember(index)}
//       className="h-8 w-8 p-0"
//     >
//       <X className="w-4 h-4" />
//     </Button>
//   )}
// </div>
// <div className="grid grid-cols-2 gap-3">
//   <div className="space-y-2">
//     <Label htmlFor={`tv-cast-${index}-name`}>Name</Label>
//     <Input
//       id={`tv-cast-${index}-name`}
//       value={member.name}
//       onChange={(e) => handleTvCastChange(index, 'name', e.target.value)}
//       required
//     />
//   </div>
//   <div className="space-y-2">
//     <Label htmlFor={`tv-cast-${index}-role`}>Role</Label>
//     <select
//       id={`tv-cast-${index}-role`}
//       value={member.role}
//       onChange={(e) => handleTvCastChange(index, 'role', e.target.value)}
//       className="w-full h-10 px-3 border rounded-md"
//       required
//     >
//       <option value="Actor">Actor</option>
//       <option value="Director">Director</option>
//       <option value="Producer">Producer</option>
//       <option value="Writer">Writer</option>
//     </select>
//   </div>
//   <div className="space-y-2">
//     <Label htmlFor={`tv-cast-${index}-character`}>Character (for actors)</Label>
//     <Input
//       id={`tv-cast-${index}-character`}
//       value={member.character}
//       onChange={(e) => handleTvCastChange(index, 'character', e.target.value)}
//       disabled={member.role !== 'Actor'}
//     />
//   </div>
//   <div className="space-y-2">
//     <Label htmlFor={`tv-cast-${index}-profilePath`}>Profile URL</Label>
//     <Input
//       id={`tv-cast-${index}-profilePath`}
//       value={member.profilePath}
//       onChange={(e) => handleTvCastChange(index, 'profilePath', e.target.value)}
//       placeholder="https://example.com/profile.jpg"
//     />
//   </div>
// </div>
// </div>
// ))}
// </div>

// <div className="grid grid-cols-2 gap-4">
// <div className="space-y-2">
// <Label htmlFor="tvPoster">Poster Image</Label>
// <Input
// id="tvPoster"
// type="file"
// onChange={(e) =>
//   setTvShowForm({
//     ...tvShowForm,
//     posterFile: e.target.files[0],
//   })
// }
// required
// />
// </div>
// <div className="space-y-2">
// <Label htmlFor="tvBackdrop">Backdrop Image</Label>
// <Input
// id="tvBackdrop"
// type="file"
// onChange={(e) =>
//   setTvShowForm({
//     ...tvShowForm,
//     backdropFile: e.target.files[0],
//   })
// }
// />
// </div>
// </div>

// <div className="space-y-2">
// <Label htmlFor="tvTrailer">Trailer Video</Label>
// <Input
// id="tvTrailer"
// type="file"
// accept="video/*"
// onChange={(e) =>
// setTvShowForm({
//   ...tvShowForm,
//   trailerFile: e.target.files[0],
// })
// }
// />
// </div>

// <Button type="submit" className="w-full">
// Add TV Show
// </Button>
// </form>
// </DialogContent>
// </Dialog>
// </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Title</TableHead>
//                     <TableHead>First Air Date</TableHead>
//                     <TableHead>Seasons</TableHead>
//                     <TableHead>Rating</TableHead>
//                     <TableHead>Rent Price</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {tvShows.map((show) => (
//                     <TableRow key={show.id}>
//                       <TableCell>{show.title}</TableCell>
//                       <TableCell>
//                         {new Date(show.firstAirDate).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>{show.numberOfSeasons}</TableCell>
//                       <TableCell>{show.rating}</TableCell>
//                       <TableCell>{formatPrice(show.rentPrice)}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDelete("tvshows", show.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminPage;
