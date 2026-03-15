"use client";

import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const { signOutUser } = useAuth();

    return (
        <button
            onClick={signOutUser}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
        >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
        </button>
    );
}
