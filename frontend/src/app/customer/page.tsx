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
  X,
} from "lucide-react";

type ProfileResponse = {
  success: boolean;
  data: any;
};

type SummaryResponse = {
  success: boolean;
  data: {
    membership: { 
      annual_pass: 'yes' | 'no';
      status: 'Active' | 'Expired' | 'None';
      membership_start_date?: string | null;
      membership_end_date?: string | null;
    };
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
  const [membershipData, setMembershipData] = React.useState<SummaryResponse['data']['membership'] | null>(null);
  const [active, setActive] = React.useState<string>("dashboard");
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [upcomingTickets, setUpcomingTickets] = React.useState<any[]>([]);
  const [visits, setVisits] = React.useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<any | null>(null);
  const [showTicketModal, setShowTicketModal] = React.useState(false);
  const [autoRenew, setAutoRenew] = React.useState<boolean>(false);
  const [loadingAutoRenew, setLoadingAutoRenew] = React.useState(false);

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
      setMembershipData(summaryRes.data.data.membership);
      setUpcomingTickets(summaryRes.data.data.ticketsUpcoming || []);
      setVisits(visitsRes.data.data || []);
      setTickets(ticketsRes.data.data || []);
      
      // Load auto-renew status
      if (profileRes.data.data?.membership_auto_renew !== undefined) {
        setAutoRenew(profileRes.data.data.membership_auto_renew);
      }
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

  // Use backend-computed membership status instead of computing client-side
  const membership = React.useMemo(() => {
    if (!membershipData) {
      return { status: "None" as const, detail: "No membership", expired: false };
    }
    const status = membershipData.status || "None";
    const detail = status === "Active" ? "Annual Pass" : (status === "Expired" ? "Expired" : "No membership");
    return { status, detail, expired: status === "Expired" };
  }, [membershipData]);

  const membershipDates = React.useMemo(() => {
    if (membership.status === 'None' || !membershipData) return { start: null as Date | null, expiry: null as Date | null };
    // Use dates from backend-computed membership data
    const startRaw = membershipData.membership_start_date;
    const endRaw = membershipData.membership_end_date;
    
    const startDate = startRaw ? new Date(startRaw) : null;
    const expiry = endRaw ? new Date(endRaw) : null;
    
    // Validate dates
    if (startDate && Number.isNaN(startDate.getTime())) return { start: null, expiry: null };
    if (expiry && Number.isNaN(expiry.getTime())) return { start: null, expiry: null };
    
    return { start: startDate, expiry };
  }, [membership.status, membershipData]);

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

  const handleToggleAutoRenew = async () => {
    const newValue = !autoRenew;
    setLoadingAutoRenew(true);
    
    try {
      const response = await apiClient.put('/me/membership/auto-renew', {
        autoRenew: newValue,
      });
      
      if (response.data.success) {
        setAutoRenew(newValue);
      } else {
        alert(response.data.message || 'Failed to update auto-renewal');
      }
    } catch (error: any) {
      console.error('Failed to toggle auto-renew:', error);
      alert(error.response?.data?.message || 'Failed to update auto-renewal. Please try again.');
    } finally {
      setLoadingAutoRenew(false);
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
              {/* Removed My Tickets tab */}
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

        {/* Dashboard Overview - now shows all tickets */}
        {active === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temporarily hidden per request; keep for later re-enable */}
              {false && (
                <StatsCard title="Tickets Purchased" value={3} icon={Ticket} iconColor="text-sea_green-600" />
              )}
              {false && (
                <StatsCard title="Total Visits" value={8} icon={MapPin} iconColor="text-dark_spring_green-600" />
              )}
              {/* Stretch the Membership card to fill available columns while others are hidden */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Membership</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{membership.status}</p>
                        {(membership.status === 'Active' || membership.status === 'Expired') && membershipDates.start && membershipDates.expiry && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(membershipDates.start)} - {formatDate(membershipDates.expiry)}
                          </p>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-50`}>
                        <CreditCard className={`h-6 w-6 text-dark_spring_green-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-sea_green-600" /> Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tickets.length === 0 ? (
                    <p className="text-gray-600">No tickets found.</p>
                  ) : (
                    tickets.filter((t:any) => {
                      // Upcoming = visit date today or in future
                      if (!t.visit_date) return true;
                      const visit = new Date(t.visit_date);
                      const now = new Date();
                      return visit >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    }).map((t:any,i:number)=> (
                      <div key={i} className="rounded-xl border border-gray-200 bg-dark_spring_green-50 p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{t.ticket_type} Ticket</p>
                          <p className="text-sm text-gray-600">{t.visit_date ? new Date(t.visit_date).toLocaleDateString() : 'Flexible date'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-900">${Number(t.price).toFixed(2)}</span>
                          <Button size="sm" onClick={() => {
                            setSelectedTicket(t);
                            setShowTicketModal(true);
                          }}>View Ticket</Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Removed My Tickets tab content */}

        {/* Events section removed as requested */}

        {/* Visits - now shows past tickets */}
        {active === 'visits' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-amber-600" /> Visit History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tickets.filter((t:any) => {
                // Past = visit date before today
                if (!t.visit_date) return false;
                const visit = new Date(t.visit_date);
                const now = new Date();
                return visit < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              }).length === 0 ? (
                <p className="text-gray-600">No past tickets found.</p>
              ) : (
                tickets.filter((t:any) => {
                  if (!t.visit_date) return false;
                  const visit = new Date(t.visit_date);
                  const now = new Date();
                  return visit < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                }).map((t:any,i:number)=> (
                  <div key={i} className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{t.ticket_type} Ticket</p>
                      <p className="text-sm text-gray-600">{t.visit_date ? new Date(t.visit_date).toLocaleDateString() : '—'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">${Number(t.price).toFixed(2)}</span>
                      <Button size="sm" onClick={() => {
                        setSelectedTicket(t);
                        setShowTicketModal(true);
                      }}>View Ticket</Button>
                    </div>
                  </div>
                ))
              )}
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
              {membership.status === "None" || membership.status === "Expired" ? (
                // No membership or expired membership - show purchase/renew option
                <div>
                  <div className={`rounded-xl p-5 shadow mb-4 ${membership.status === "Expired" ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white" : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"}`}>
                    <p className="text-sm">
                      {membership.status === "Expired" ? "Your annual pass has expired" : "You don't have an active membership"}
                    </p>
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
                      {membership.status === "Expired" ? "Renew Membership" : "Buy Membership"}
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

                  {/* Auto-Renewal Toggle */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Auto-Renewal</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {autoRenew 
                            ? 'Your membership will automatically renew on the expiration date'
                            : 'Turn on to automatically renew your membership when it expires'}
                        </p>
                      </div>
                      <button
                        onClick={handleToggleAutoRenew}
                        disabled={loadingAutoRenew}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:ring-offset-2 ${
                          autoRenew ? 'bg-sea_green-600' : 'bg-gray-200'
                        } ${loadingAutoRenew ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoRenew ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

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
                    <Button variant="outline" onClick={() => router.push('/membership/confirmation')}>
                      View Details
                    </Button>
                    {/* Show Renew button if auto-renewal is OFF and membership expires within 30 days */}
                    {(() => {
                      if (!autoRenew && membershipDates.expiry) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const expiryDate = new Date(membershipDates.expiry);
                        expiryDate.setHours(0, 0, 0, 0);
                        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
                          return (
                            <Button onClick={() => router.push('/membership')}>
                              Renew Membership
                            </Button>
                          );
                        }
                      }
                      return null;
                    })()}
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
              <div><span className="text-gray-500">Annual Pass:</span> <span className="font-medium">{membership.status === "Expired" ? "no (expired)" : (profile?.annual_pass || 'no')}</span></div>
              <div><span className="text-gray-500">Registered:</span> <span className="font-medium">{formatDate(profile?.registration_date)}</span></div>
              {membership.status === 'Active' && (
                <div><span className="text-gray-500">Membership Expires:</span> <span className="font-medium">{membershipDates.expiry ? formatDate(membershipDates.expiry) : '—'}</span></div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTicketModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Ticket className="h-6 w-6 text-sea_green-600" />
                Ticket Details
              </h2>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-dark_spring_green-50 border border-dark_spring_green-200">
                <span className="text-sm font-medium text-gray-600">Ticket ID</span>
                <span className="font-bold text-dark_spring_green-700">#{selectedTicket.ticket_id}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ticket Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedTicket.ticket_type}</p>
                </div>
                {/* Removed status display */}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Visit Date</span>
                  <span className="font-medium text-gray-900">
                    {selectedTicket.visit_date ? new Date(selectedTicket.visit_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Flexible'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Purchase Date</span>
                  <span className="font-medium text-gray-900">
                    {selectedTicket.purchase_date ? new Date(selectedTicket.purchase_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">{selectedTicket.payment_method || 'N/A'}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-sea_green-600">${Number(selectedTicket.price).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-dark_spring_green-600 hover:bg-dark_spring_green-700"
                  onClick={() => setShowTicketModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
