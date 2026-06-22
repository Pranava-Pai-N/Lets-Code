import { ArrowUpIcon } from "lucide-react";
import { Link } from "react-router-dom";

const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200/60 bg-slate-50/50 py-12 dark:border-slate-800 dark:bg-transparent">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row justify-between items-center gap-6">

                <p className="text-xs font-medium text-slate-500 tracking-wider">
                    &copy; {new Date().getFullYear()} Let's Code
                </p>

                <div className="flex items-center gap-8 text-xs font-semibold text-slate-600 tracking-wide">
                    <Link to="/privacy" className="hover:text-indigo-600 transition-colors duration-200">
                        Privacy
                    </Link>
                    <Link to="/terms" className="hover:text-indigo-600 transition-colors duration-200">
                        Terms
                    </Link>
                    <Link to="/about-me" className="hover:text-indigo-600 transition-colors duration-200">
                        Developed By
                    </Link>

                    <button
                        onClick={handleScroll}
                        className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 active:scale-95"
                        aria-label="Scroll to top"
                    >
                        <ArrowUpIcon className="w-4 h-4 animate-pulse" />
                    </button>
                </div>

            </div>
        </footer>
    )
}