import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SimulationBanner from './SimulationBanner';

export default function Layout() {
  return (
    <div className="flex h-screen bg-darker text-slate-200 overflow-hidden font-[Inter]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <main className="flex-1 overflow-auto p-6 pb-20">
          <Outlet />
        </main>
        <SimulationBanner />
      </div>
    </div>
  );
}
