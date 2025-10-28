"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Ticket,
  CreditCard,
  Settings,
  MapPin,
  LogOut,
  Award,
} from "lucide-react";

type ProfileResponse = {
  success: boolean;
  data: any;
};

type SummaryResponse = {
  success: boolean;
  data: {
    membership: { annual_pass: 'yes' | 'no' };
    ticketsUpcoming: any[];
    visitsRecent: any[];
  };
};

const StatsCard = ({ title, value, icon: Icon, iconColor }: { title: string; value: string | number; icon: any; iconColor: string }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [fetching, setFetching] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const [active, setActive] = React.useState<string>("dashboard");
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [upcomingTickets, setUpcomingTickets] = React.useState<any[]>([]);
  const [visits, setVisits] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated]);

  const load = async () => {
    try {
      setFetching(true);
      const [profileRes, summaryRes, ticketsRes, visitsRes] = await Promise.all([
        apiClient.get<ProfileResponse>("/auth/profile"),
        apiClient.get<SummaryResponse>("/me/summary"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/tickets"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/visits"),
      ]);

      setProfile(profileRes.data.data);
      setUpcomingTickets(summaryRes.data.data.ticketsUpcoming || []);
      setVisits(visitsRes.data.data || []);
      setTickets(ticketsRes.data.data || []);
    } catch (e: any) {
      console.error("Failed to load profile", e);
    } finally {
      setFetching(false);
    }
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "—";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString();
  };

  const membership = React.useMemo(() => {
    const annualPass = profile?.annual_pass as "yes" | "no" | undefined;
    const status = annualPass === "yes" ? "Active" : "None";
    const detail = annualPass === "yes" ? "Annual Pass" : "No membership";
    return { status, detail };
  }, [profile]);

  const membershipDates = React.useMemo(() => {
    if (membership.status !== 'Active') return { start: null as Date | null, expiry: null as Date | null };
    const raw = (profile?.membership_purchase_date || profile?.registration_date) as string | Date | undefined;
    if (!raw) return { start: null as Date | null, expiry: null as Date | null };
    const startDate = new Date(raw);
    if (Number.isNaN(startDate.getTime())) return { start: null as Date | null, expiry: null as Date | null };
    const expiry = new Date(startDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return { start: startDate, expiry };
  }, [membership.status, profile]);

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      router.replace("/login");
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const firstName = profile?.customer_first_name || user?.first_name || 'Guest';

  // Removed events-related quick actions and recent activity to eliminate event references

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <Card>
          <CardContent className="p-3">
            <nav className="space-y-1">
              <button onClick={() => setActive("dashboard")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "dashboard" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <Home className="h-4 w-4" /> Dashboard
              </button>
              <button onClick={() => setActive("tickets")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "tickets" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <Ticket className="h-4 w-4" /> My Tickets
              </button>
              <button onClick={() => setActive("visits")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "visits" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <MapPin className="h-4 w-4" /> Visit History
              </button>
              <button onClick={() => setActive("membership")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "membership" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <Award className="h-4 w-4" /> Membership
              </button>
              <button onClick={() => setActive("profile")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "profile" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <Settings className="h-4 w-4" /> Profile Status
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* Main content */}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}! 🦁</h1>
            <p className="text-gray-600 mt-1">Your zoo adventure dashboard</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/customer/profile")}>{firstName}'s Account</Button>
        </div>

        {/* Dashboard Overview */}
        {active === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard title="Tickets Purchased" value={3} icon={Ticket} iconColor="text-sea_green-600" />
              <StatsCard title="Total Visits" value={8} icon={MapPin} iconColor="text-dark_spring_green-600" />
              <StatsCard title="Membership" value={membership.status} icon={CreditCard} iconColor="text-dark_spring_green-600" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-sea_green-600" /> Upcoming Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingTickets.map((t:any,i:number)=> (
                    <div key={i} className="rounded-xl border border-gray-200 bg-dark_spring_green-50 p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{t.ticket_type} Ticket</p>
                        <p className="text-sm text-gray-600">{t.visit_date ? new Date(t.visit_date).toLocaleDateString() : 'Flexible date'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="rounded-full bg-green-500/10 text-green-700 text-xs px-3 py-1">Confirmed</span>
                        <span className="font-semibold text-gray-900">${Number(t.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Tickets */}
        {active === 'tickets' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-sea_green-600" /> My Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tickets.map((t:any)=> (
                <div key={t.ticket_id} className="rounded-xl border-2 border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{t.ticket_type} Ticket</p>
                      <p className="text-sm text-gray-600">{t.visit_date ? new Date(t.visit_date).toLocaleDateString() : 'Flexible date'}</p>
                    </div>
                    <span className="rounded-full bg-green-500/10 text-green-700 text-xs px-3 py-1">Confirmed</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-700 space-x-6">
                      <span><span className="text-gray-500">Purchase Date</span> <span className="font-semibold">{t.purchase_date ? new Date(t.purchase_date).toLocaleDateString() : '—'}</span></span>
                      <span><span className="text-gray-500">Price</span> <span className="font-semibold">${Number(t.price).toFixed(2)}</span></span>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm">View Ticket</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Events section removed as requested */}

        {/* Visits */}
        {active === 'visits' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-amber-600" /> Visit History</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visits.map((v:any,i:number)=> (
                <div key={i} className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-gray-900">{v.visit_date ? new Date(v.visit_date).toLocaleDateString() : '—'}</p>
                  <p className="text-sm text-gray-700">Tickets: {v.tickets_count} · Spent: ${Number(v.total_spent).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Membership */}
        {active === 'membership' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-dark_spring_green-600" /> Membership Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {membership.status === "None" ? (
                // No membership - show purchase option
                <div>
                  <div className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white p-5 shadow mb-4">
                    <p className="text-sm">You don't have an active membership</p>
                  </div>
                  
                  <div className="rounded-2xl border-2 border-gray-200 p-6 max-w-md">
                    <p className="font-semibold text-gray-900 text-lg">Individual Annual Pass</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">$149<span className="text-base font-normal">/year</span></p>
                    <ul className="mt-4 text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Unlimited access for 1 adult for one year</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>10% discount at gift shop and cafés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Free parking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Early access to special events</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Member-only newsletter</span>
                      </li>
                    </ul>
                    <Button className="mt-6 w-full" onClick={() => router.push('/membership')}>
                      Purchase Membership
                    </Button>
                  </div>
                </div>
              ) : (
                // Has membership - show benefits
                <div>
                  <div className="rounded-xl bg-gradient-to-r from-sea_green-500 to-dark_spring_green-600 text-white p-6 shadow mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Active Membership</p>
                        <p className="text-2xl font-bold mt-1">Individual Annual Pass</p>
                      </div>
                      <Award className="h-12 w-12 opacity-90" />
                    </div>
                  </div>

                  {membershipDates.expiry && (
                    <div className="rounded-xl border border-sea_green-200 bg-white p-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                        <span className="text-gray-700">Member since <span className="font-semibold">{formatDate(membershipDates.start!)}</span></span>
                        <span className="text-gray-700">Expires on <span className="font-semibold">{formatDate(membershipDates.expiry)}</span></span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border-2 border-sea_green-200 bg-sea_green-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Your Member Benefits</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Unlimited access for 1 adult for one year</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>10% discount at gift shop and cafés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Free parking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Early access to special events</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sea_green-600 mt-0.5">✓</span>
                        <span>Member-only newsletter</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" onClick={() => router.push('/membership')}>
                      Renew Membership
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/membership/confirmation')}>
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile/Account Details */}
        {active === 'profile' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Account Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/customer/profile')}>Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{`${profile?.customer_first_name || user?.first_name || ''} ${profile?.customer_last_name || user?.last_name || ''}`.trim() || '—'}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{profile?.customer_email || profile?.email || '—'}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{profile?.customer_phone || '—'}</span></div>
              <div><span className="text-gray-500">Address:</span> <span className="font-medium">{profile?.address || '—'}</span></div>
              <div><span className="text-gray-500">City:</span> <span className="font-medium">{profile?.city || '—'}</span></div>
              <div><span className="text-gray-500">State:</span> <span className="font-medium">{profile?.state || '—'}</span></div>
              <div><span className="text-gray-500">ZIP Code:</span> <span className="font-medium">{profile?.zip_code || '—'}</span></div>
              <div><span className="text-gray-500">Annual Pass:</span> <span className="font-medium">{profile?.annual_pass || 'no'}</span></div>
              <div><span className="text-gray-500">Registered:</span> <span className="font-medium">{formatDate(profile?.registration_date)}</span></div>
              {membership.status === 'Active' && (
                <div><span className="text-gray-500">Membership Expires:</span> <span className="font-medium">{membershipDates.expiry ? formatDate(membershipDates.expiry) : '—'}</span></div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
