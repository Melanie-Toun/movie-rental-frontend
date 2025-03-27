import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react";

const AuthScreen = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleFormSubmit = (e) => {
      e.preventDefault();
      navigate("/signup?email=" + email)
    }
  return (
    <div className="hero-bg relative">
      {/* Navbar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4 pb-10">
        <img src="/ms.svg" alt=" Logo" className="w-32 md:w-52" />
        <Link to={"/login"} className=" bg-white py-1 text-gray-500 w-20 text-center rounded-lg hover:bg-black hover:text-white transition-all duration-300 ease-in-out" >Sign In</Link>
      </header>

      {/* hero section */}

      <div className="flex flex-col items-center justify-center text-center py-40 text-white max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Rent. Stream. Enjoy.</h1>
        <p className="text-lg mb-4">Watch your favorite movies and shows anytime, anywhere.</p>
        <p className="mb-4">Ready to watch? Enter your email to create or restart your membership</p>

        <form className="flex flex-col md:flex-row gap-4 w-1/2" onSubmit={handleFormSubmit}>
        <input type="email" placeholder="Email Address" className="p-2 rounded flex-1 bg-black/80 border border-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />

        <button className="bg-black text-xl lg:text-2xl px-2 lg:px-6 py-1 md:py-2 rounded flex justify-center items-center"> Join now
          <ChevronRight className='size-8 md:size-10'/>
        </button>
        </form>
      </div>

      {/* separator */}
      <div className="h-2 w-full bg-[#232323]" aria-hidden='true'/>

      {/* 1st section */}
      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col-reverse px-4 md:px-2">

          {/* left side */}
          <div className="flex-1 relative">
          <img src="/tv.png" alt="Tv Image" className="mt-4 z-20 relative" />
            <img src="/movie.jpg" alt="Enjoy on your TV" className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
          </div>
          
          {/* right side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl mb-4 font-semibold">Stream your favorite movies, anytime!</h2>
            <p className="text-lg md:text-xl">Escape into the world of endless entertainment - Watch your favorite movies anytime, anywhere!</p>
          </div>
        </div>
      </div>

        {/* separator */}
         <div className="h-2 w-full bg-[#232323]" aria-hidden='true'/>

      {/* 2nd section */}
      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2">
          {/* left side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl mb-4 font-semibold">Watch Everywhere</h2>
            <p className="text-lg md:text-xl">Stream Unlimited movies and Tv shows on your phone, tablet, and TV</p>
          </div>

          {/* right side */}
          <div className="flex-1 relative overflow-hidden">
            <img src="/device-pile.png" alt="Device  Image" className="mt-4 z-20 relative" />
            <video className="absolute top-2 left-1/2 -translate-x-1/2 h-4/6 z-10 max-w-[63%]" autoPlay={true} playsInline muted loop>
              <source src="/video-devices.m4v" type="video/mp4"/>
            </video>
          </div>
        </div>
      </div>

      {/* separator */}
      <div className="h-2 w-full bg-[#232323]" aria-hidden='true'/>

      {/* 3rd section */} 

      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2">
          {/* left side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl mb-4 font-semibold">Enjoy on your TV.</h2>
            <p className="text-lg md:text-xl">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>
          {/* right side */}
          <div className="flex-1 relative">
            <img src="/tv.png" alt="Tv Image" className="mt-4 z-20 relative" />
            <img src="/projector.gif" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 z-10" />
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default AuthScreen
