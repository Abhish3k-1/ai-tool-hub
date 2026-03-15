import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 w-full min-w-0">
                {children}
            </div>
        </div>
    );
}
