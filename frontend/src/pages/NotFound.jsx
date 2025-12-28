import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 text-center">

        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-white opacity-5 select-none">
            404 Not Found
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-pink-500">
              Lost Your <br /> Route ?
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <p className="text-gray-400 font-mono text-sm md:text-base tracking-widest uppercase">
            [ Error_Code: Page_Not_Found ]
          </p>
          <p className="max-w-md mx-auto text-gray-500 text-lg leading-relaxed">
            The url you provided led to an empty resource. The resource has been moved, 
            deleted, or never existed in this dimension. Please wait or retrieve back.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold transition-all hover:bg-white/10 active:scale-95"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Home
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-black rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] active:scale-95"
          >
            <HomeIcon className="w-5 h-5" />
            Return to Dashboard
          </button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-4 opacity-20">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-teal-500"></div>
          <div className="w-2 h-2 rounded-full bg-teal-500"></div>
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-teal-500"></div>
        </div>
      </div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );
};

export default NotFound;