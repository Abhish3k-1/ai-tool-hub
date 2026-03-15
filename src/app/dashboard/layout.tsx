import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="page-enter w-full min-w-0 transition-all duration-300">
            {children}
        </div>
    );
}
