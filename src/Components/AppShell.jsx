import Navbar from './Navbar';

const AppShell = ({ children, className = '', withDock = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Navbar />
      <main className={`pt-[72px] px-4 sm:px-6 lg:px-8 ${withDock ? 'pb-28' : 'pb-10 sm:pb-12'} ${className}`}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
