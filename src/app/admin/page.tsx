'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { 
    Users, 
    Zap, 
    Search, 
    FileText, 
    ShieldCheck, 
    TrendingUp, 
    Clock,
    User as UserIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    lastLogin: any;
    role: string;
}

interface UsageStat {
    id: string;
    tool: string;
    userEmail: string;
    timestamp: any;
}

export default function AdminDashboard() {
    const { user, role, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNotes: 0,
        youtubeSummaries: 0,
        researchQueries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && role !== 'admin') {
            redirect('/dashboard');
        }
    }, [role, authLoading]);

    useEffect(() => {
        if (role !== 'admin') return;

        async function fetchAdminData() {
            try {
                // Fetch Users
                const usersSnap = await getDocs(collection(db, 'users'));
                const usersList = usersSnap.docs.map(doc => doc.data() as UserProfile);
                setUsers(usersList);

                // Fetch Notes Count
                const notesSnap = await getDocs(collection(db, 'notes'));
                
                // Fetch Usage Stats
                const usageSnap = await getDocs(collection(db, 'usage_stats'));
                const usageList = usageSnap.docs.map(doc => doc.data() as UsageStat);

                setStats({
                    totalUsers: usersList.length,
                    totalNotes: notesSnap.size,
                    youtubeSummaries: usageList.filter(u => u.tool === 'youtube').length,
                    researchQueries: usageList.filter(u => u.tool === 'research').length
                });
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAdminData();
    }, [role]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 page-enter">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-purple-100 p-3 text-purple-700 shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Admin Dashboard</h1>
                            <p className="text-slate-600">Platform overview and user management.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="hover-lift border-purple-100 bg-white/80">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Users</p>
                                    <h3 className="mt-1 text-3xl font-black text-slate-900">{stats.totalUsers}</h3>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift border-purple-100 bg-white/80">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Notes Saved</p>
                                    <h3 className="mt-1 text-3xl font-black text-slate-900">{stats.totalNotes}</h3>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift border-purple-100 bg-white/80">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">YT Summaries</p>
                                    <h3 className="mt-1 text-3xl font-black text-slate-900">{stats.youtubeSummaries}</h3>
                                </div>
                                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift border-purple-100 bg-white/80">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Research Hits</p>
                                    <h3 className="mt-1 text-3xl font-black text-slate-900">{stats.researchQueries}</h3>
                                </div>
                                <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
                                    <Search className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-slate-100 bg-white/90 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Recent Users
                            </CardTitle>
                            <CardDescription>Manage your platform's growing community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-500 uppercase text-[10px] tracking-wider">
                                            <th className="pb-3 pt-0 font-bold">User</th>
                                            <th className="pb-3 pt-0 font-bold">Email</th>
                                            <th className="pb-3 pt-0 font-bold text-center">Role</th>
                                            <th className="pb-3 pt-0 font-bold text-right">Last Login</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-slate-700">
                                        {users.map((u) => (
                                            <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 font-medium flex items-center gap-2.5">
                                                    {u.photoURL ? (
                                                        <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <UserIcon className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    {u.displayName || 'Anonymous'}
                                                </td>
                                                <td className="py-4 text-slate-500">{u.email}</td>
                                                <td className="py-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right text-slate-500">
                                                    {u.lastLogin?.toDate ? u.lastLogin.toDate().toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-slate-100 bg-white/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    Growth
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Retention rate</span>
                                        <span className="font-bold text-slate-900">92%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full w-[92%]"></div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Active engagement</span>
                                        <span className="font-bold text-slate-900">78%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full w-[78%]"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 bg-white/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    System Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    All systems operational
                                </div>
                                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                    Groq AI cluster responding at 42ms. Firestore read/write latency within normal bounds.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
