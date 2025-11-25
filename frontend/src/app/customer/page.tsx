"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Home,
  Ticket,
  CreditCard,
  Settings,
  MapPin,
  LogOut,
  Award,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  ShoppingBag,
  Coffee,
  Clock,
  Plus,
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
  const [error, setError] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [membershipData, setMembershipData] = React.useState<SummaryResponse['data']['membership'] | null>(null);
  const [active, setActive] = React.useState<string>("dashboard");
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [upcomingTickets, setUpcomingTickets] = React.useState<any[]>([]);
  const [visits, setVisits] = React.useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);
  const [purchaseHistory, setPurchaseHistory] = React.useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<any | null>(null);
  const [showTicketModal, setShowTicketModal] = React.useState(false);
  const [autoRenew, setAutoRenew] = React.useState<boolean>(false);
  const [loadingAutoRenew, setLoadingAutoRenew] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<any>(null);
  const [showPaymentRequiredMessage, setShowPaymentRequiredMessage] = React.useState(false);

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
      const [profileRes, summaryRes, ticketsRes, visitsRes, eventsRes, purchaseRes, paymentRes] = await Promise.all([
        apiClient.get<ProfileResponse>("/auth/profile"),
        apiClient.get<SummaryResponse>("/me/summary"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/tickets"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/visits"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/event-registrations"),
        apiClient.get<{ success: boolean; data: any[] }>("/me/purchase-history"),
        apiClient.get("/me/payment-method").catch(() => ({ data: { success: true, data: null } })), // Silently fail if no payment method
      ]);

      setProfile(profileRes.data.data);
      setMembershipData(summaryRes.data.data.membership);
      setUpcomingTickets(summaryRes.data.data.ticketsUpcoming || []);
      setVisits(visitsRes.data.data || []);
      setTickets(ticketsRes.data.data || []);
      setUpcomingEvents(eventsRes.data.data || []);
      setPurchaseHistory(purchaseRes.data.data || []);
      
      // Load auto-renew status
      if (profileRes.data.data?.membership_auto_renew !== undefined) {
        setAutoRenew(profileRes.data.data.membership_auto_renew);
      }
      
      // Load payment method
      setPaymentMethod(paymentRes.data.data);
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

    // If enabling auto-renewal, check if payment method exists
    if (newValue && !paymentMethod) {
      // Show visible message instead of alert
      setShowPaymentRequiredMessage(true);
      return;
    }

    // Clear message if successfully toggling
    setShowPaymentRequiredMessage(false);
    setLoadingAutoRenew(true);
    setError(null);

    try {
      const response = await apiClient.put('/me/membership/auto-renew', {
        autoRenew: newValue,
      });

      if (response.data.success) {
        setAutoRenew(newValue);
      } else {
        setError(response.data.message || 'Failed to update auto-renewal');
      }
    } catch (err: any) {
      console.error('Failed to toggle auto-renew:', err);
      setError(err.response?.data?.message || 'Failed to update auto-renewal. Please try again.');
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
      {/* Error Alert */}
      {error && (
        <div className="lg:col-span-2">
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            dismissible={true}
          />
        </div>
      )}

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
              <button onClick={() => setActive("purchase-history")} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${active === "purchase-history" ? "bg-dark_spring_green-100 text-dark_spring_green-800" : "hover:bg-gray-50"}`}>
                <ShoppingBag className="h-4 w-4" /> Purchase History
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-sea_green-600" /> Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-gray-600">No upcoming events registered.</p>
                  ) : (
                    upcomingEvents.map((event: any, i: number) => {
                      const isCancelled = event.event_deleted_at !== null && event.event_deleted_at !== undefined;
                      return (
                        <div 
                          key={i} 
                          className={`rounded-xl border-2 p-4 ${
                            isCancelled 
                              ? 'border-red-400 bg-red-50' 
                              : 'border-gray-200 bg-sea_green-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-semibold ${isCancelled ? 'text-red-800 line-through' : 'text-gray-900'}`}>
                                  {event.event_name}
                                </p>
                                {isCancelled && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-200 text-red-800">
                                    Cancelled
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {event.event_date && (
                                  <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                )}
                                {event.start_time && (
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                    {event.end_time && ` - ${new Date(`2000-01-01T${event.end_time}`).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}`}
                                  </p>
                                )}
                                {event.location && (
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Participants: {event.number_of_participants} • Registered: {new Date(event.registration_date).toLocaleDateString()}
                                </p>
                                {isCancelled && (
                                  <p className="text-sm text-red-700 font-medium mt-2 bg-red-100 rounded-md px-3 py-2 border border-red-300">
                                    This event has been cancelled. You will receive a refund.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

            </div>
          </>
        )}

        {/* Purchase History Tab */}
        {active === 'purchase-history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-sea_green-600" /> Purchase History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchaseHistory.length === 0 ? (
                <p className="text-gray-600">No purchase history found.</p>
              ) : (
                purchaseHistory.map((purchase: any, i: number) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {purchase.purchase_type === 'gift_shop' ? (
                            <ShoppingBag className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Coffee className="h-4 w-4 text-amber-600" />
                          )}
                          <p className="font-semibold text-gray-900">{purchase.item_name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                            {purchase.purchase_type === 'gift_shop' ? 'Gift Shop' : 'Cafe'}
                          </span>
                        </div>
                        {purchase.item_description && (
                          <p className="text-sm text-gray-600 mb-2">{purchase.item_description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Quantity: {purchase.quantity}</span>
                          <span>•</span>
                          <span>${Number(purchase.unit_price).toFixed(2)} each</span>
                          <span>•</span>
                          <span className="font-semibold text-gray-900">Total: ${Number(purchase.line_total).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Purchased: {new Date(purchase.purchase_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
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
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Auto-Renewal</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {autoRenew 
                            ? 'Your membership will automatically renew on the expiration date'
                            : 'Turn on to automatically renew your membership when it expires'}
                        </p>
                        {showPaymentRequiredMessage && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium">
                              ⚠️ You must have a payment method on file to enable auto-renewal. Please add a payment method in the Payment Methods section below.
                            </p>
                          </div>
                        )}
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
          <div className="space-y-6">
            {/* Personal Information Card */}
            <Card className="border-2 border-gray-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                    <div className="p-2 rounded-lg bg-sea_green-100">
                      <User className="h-5 w-5 text-sea_green-700" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push('/customer/profile')}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {`${profile?.customer_first_name || user?.first_name || ''} ${profile?.customer_last_name || user?.last_name || ''}`.trim() || '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {profile?.customer_email || profile?.email || '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {profile?.customer_phone || '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Registered</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(profile?.registration_date)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information Card */}
            <Card className="border-2 border-gray-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                  <div className="p-2 rounded-lg bg-sea_green-100">
                    <MapPin className="h-5 w-5 text-sea_green-700" />
                  </div>
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {profile?.address || profile?.city || profile?.state || profile?.zip_code ? (
                    <>
                      {profile?.address && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Street Address</p>
                          <p className="text-base font-semibold text-gray-900">{profile.address}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {profile?.city && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">City</p>
                            <p className="text-base font-semibold text-gray-900">{profile.city}</p>
                          </div>
                        )}
                        {profile?.state && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">State</p>
                            <p className="text-base font-semibold text-gray-900">{profile.state}</p>
                          </div>
                        )}
                        {profile?.zip_code && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">ZIP Code</p>
                            <p className="text-base font-semibold text-gray-900">{profile.zip_code}</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No address information on file</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Credit Information Card */}
            <Card className="border-2 border-gray-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                  <div className="p-2 rounded-lg bg-sea_green-100">
                    <CreditCard className="h-5 w-5 text-sea_green-700" />
                  </div>
                  Credit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {paymentMethod ? (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Saved Card</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {paymentMethod.card_number || '**** **** **** ****'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {paymentMethod.cardholder_name} • Expires {String(paymentMethod.expiry_month).padStart(2, '0')}/{paymentMethod.expiry_year}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push('/customer/profile');
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Manage Payment Method
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-50 rounded-lg inline-block mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No credit card on file</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
