import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-center bg-cover flex flex-col justify-center items-center text-white"
    style={{ backgroundImage: `url('/404.png')`}}
    >
      <header className="absolute top-0 left-0 p-4 bg-black w-full">
        <Link to={"/"}>
        <img src="/ms.svg" alt="LostImage" className="h-8" />
        </Link>
      </header>
      <main className="text-center error-page--content z-10">
        <h1 className="text-6xl font-semibold mb-4">Lost your way?</h1>
        <p className="text-xl mb-6">Sorry, we can't find that page. You'll find lots to explore on the home page </p>
        <Link to={"/"} className="rounded bg-white py-2 px-2 text-black hover:underline">Back to Homepage</Link>
      </main>
    </div>
  )
}

export default NotFoundPage
