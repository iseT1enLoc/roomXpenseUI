export default function ErrorComponent({handleRetry}){
    return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-lg mb-6">Error: {roomError}</p>
          <button
            onClick={handleRetry}
            className="bg-teal-500 hover:bg-teal-600 text-black font-medium py-2 px-6 rounded-lg shadow transition"
          >
            Try again
          </button>
        </div>
    </div>
    )
}