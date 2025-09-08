import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store"; 
import { selectIsAuthenticated } from "../../app/authSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isVisible, setIsVisible] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/public/google/login`;
    } catch (err) {
      console.error("❌ Google login redirect failed:", err);
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      navigate("/rooms", { replace: true })
    }
    setIsVisible(true);
  }, [isAuthenticated, navigate]);


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-teal-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Room Expense</span>
            </div>
            <div className="hidden md:flex space-x-8 text-gray-600">
              <a href="#" className="hover:text-blue-600 transition">Features</a>
              <a href="#" className="hover:text-blue-600 transition">About</a>
              <a href="#" className="hover:text-blue-600 transition">Contact</a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Hero Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">Trusted by 703+ students</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Split Bills,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Stay Friends
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                The smartest way for roommates to track shared expenses, split bills seamlessly, 
                and maintain financial transparency in your shared space.
              </p>

              {/* Ultra Fancy Wallet Card UI */}
              <div className="mb-16 max-w-sm mx-auto perspective-1000">
                <div className="group relative bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Moving shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Card shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Glowing border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                  
                  {/* Animated chip */}
                  <div className="absolute top-6 left-6 w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md group-hover:shadow-lg group-hover:shadow-yellow-400/50 transition-shadow duration-300">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded opacity-50"></div>
                  </div>
                  
                  {/* Holographic NFC symbol */}
                  <div className="absolute top-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 border-2 border-white/40 rounded-full">
                      <div className="w-3 h-3 border border-white/40 rounded-full m-auto mt-1"></div>
                    </div>
                  </div>
                  
                  {/* Card number with glow effect */}
                  <div className="mt-12 mb-6 space-y-2 relative z-10">
                    <div className="flex space-x-4 text-white/60 group-hover:text-white/80 transition-colors">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-75"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-150"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-225"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-300"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-375"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-450"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-525"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-600"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-675"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-750"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 group-hover:shadow-sm group-hover:shadow-white/50 transition-all delay-825"></div>
                      </div>
                      <div className="text-white font-mono text-lg tracking-wider group-hover:text-white group-hover:text-shadow-sm transition-all duration-300">0703</div>
                    </div>
                  </div>
                  
                  {/* Glowing card holder info */}
                  <div className="text-white/80 text-sm font-medium mb-2 group-hover:text-white transition-colors">ROOMMATE</div>
                  <div className="text-white text-lg font-bold mb-6 group-hover:text-white group-hover:text-shadow-sm transition-all">EXPENSE CARD</div>
                  
                  {/* Enhanced Google Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full group/btn relative px-6 py-4 bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all "
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <FcGoogle className="text-xl group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold group-hover/btn:font-bold transition-all">Continue with Google</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping delay-300"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping delay-700"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center opacity-80 hover:opacity-100 transition-opacity">Secure • Free • No fees</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <span>© 2025 Room Expense</span>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Abstract Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-indigo-400/30 rounded-full animate-bounce" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
};

export default HomePage;