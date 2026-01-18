import {
  UserIcon,
  CodeBracketIcon,
  UserGroupIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 text-slate-900 dark:text-gray-100 selection:bg-indigo-100 selection:text-indigo-700 font-sans">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <aside className="lg:col-span-4 space-y-10">
            <div className="relative group w-48 h-48 mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20"></div>
              <img
                src="/assets/Developer.jpg"
                alt="My-Profile-Image"
                className="relative z-10 w-full h-full object-cover rounded-[2.5rem] border-2 border-white shadow-xl"
              />
            </div>

            <div className="space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Pranava Pai N</h1>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mt-1">Backend Developer  {<br />}ML Enthusiast{<br />}Student</p>
              </div>

              <div className="space-y-3 text-sm text-slate-500 font-medium">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <MapPinIcon className="w-4 h-4 text-slate-400" />
                  <span className='text-red-600'>Mangalore,</span><span>Karnataka</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <BriefcaseIcon className="w-4 h-4 text-slate-400" />
                  <span>Working on User Friendly Projects</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-4">
                {Object.entries({
                  Github: "https://github.com/Pranava-Pai-N",
                  LinkedIn: "https://in.linkedin.com/in/pranav-pai-n-563106292/",
                  Portfolio : "https://pranava-portfolio-smoky.vercel.app"
                }).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-16">

            <section className="space-y-6">
              <h2 className="inline-flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-[0.3em]">
                <UserIcon className="w-4 h-4" /> About Me
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">I build digital products that balance </span><span className="text-red-600">performance</span> <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">with professional user interfaces.</span>
              </p>
              <div className="space-y-4 text-slate-600 leading-relaxed max-w-2xl">
                <p>
                  <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">With over 3 years of experience in engineering, I specialize in crafting scalable web applications using React, Node.js, and specialized cloud architectures.</span>
                </p>
                <p>
                  <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">When I'm not coding, I'm likely exploring open-source contributions or exploring recent advanced technologies with interest in Data Structures and Algorithms.</span>
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                <CodeBracketIcon className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 mb-2">Technical Excellence</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Clean, maintainable, and highly performant code is my baseline. I specialize in the modern TS/JS ecosystem.
                </p>
              </div>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                <UserGroupIcon className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 mb-2">User Centric Design</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  I bridge the gap between complex backend logic and intuitive frontend experiences for the end user.
                </p>
              </div>
            </section>

            <footer className="pt-8 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Built with Precision &copy;{new Date().getFullYear()}</p>
            </footer>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AboutPage;