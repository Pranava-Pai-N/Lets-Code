import { useState } from 'react';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ScaleIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";

const Terms = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    {
      id: 'acceptance',
      title: "Acceptance",
      icon: <DocumentTextIcon className="w-5 h-5" />,
      content: "By accessing 'Let's Code', you confirm that you are at least 10 years of age and agree to comply with these terms. Our platform is a collaborative tool for developers, and usage implies consent to our automated testing and ranking systems."
    },
    {
      id: 'conduct',
      title: "User Conduct",
      icon: <UserGroupIcon className="w-5 h-5" />,
      content: "You agree not to use the code execution environment for mining cryptocurrency, launching DDoS attacks, or attempting to access our internal database strings. Play fair, code hard."
    },
    {
      id: 'license',
      title: "License",
      icon: <ScaleIcon className="w-5 h-5" />,
      content: "We grant you a personal, non-exclusive license to use our compiler and problem sets for educational purposes. You may not republish our problem statements on other platforms without written credit."
    },
    {
      id: 'termination',
      title: "Termination",
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      content: "We reserve the right to suspend accounts that exhibit bot-like behavior or repeatedly submit plagiarized code from external sources."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            <span className='text-red-600'>Terms</span> of <span className="text-indigo-600">Service</span>
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Everything you need to know about using the Let's Code platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === s.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'text-gray-500 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  {s.icon}
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            {sections.map((section) => (
              <div 
                key={section.id} 
                id={section.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    {section.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-indigo dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-indigo-600 rounded-3xl p-8 text-center text-white">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">We value your privacy</h3>
              <p className="text-indigo-100 mb-6">Have questions about these terms or your data?</p>
              <button onClick={() => window.location.href='mailto:pranavpai0309@gmail.com'} className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;