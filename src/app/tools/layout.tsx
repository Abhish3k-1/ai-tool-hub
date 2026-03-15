import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function ToolsLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex w-full items-start pb-24 md:pb-0">
                <Sidebar />
                <div className="page-enter flex-1 w-full min-w-0 transition-all duration-300">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
