"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProfileResponse = {
  success: boolean;
  data: any;
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [fetching, setFetching] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [edit, setEdit] = React.useState(false);

  const [form, setForm] = React.useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

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
      const res = await apiClient.get<ProfileResponse>("/auth/profile");
      const data = res.data.data;
      setProfile(data);
      setForm({
        email: data?.customer_email || data?.email || "",
        first_name: data?.customer_first_name || data?.employee_first_name || "",
        last_name: data?.customer_last_name || data?.employee_last_name || "",
        phone: data?.customer_phone || data?.employee_phone || "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        zip_code: data?.zip_code || "",
      });
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load profile");
    } finally {
      setFetching(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await authService.updateProfile(form);
      await load();
      setEdit(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "—";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString();
  };

  const membership = React.useMemo(() => {
    const type = profile?.membership_type as string | undefined;
    const end = profile?.membership_end_date as string | undefined;
    const annualPass = profile?.annual_pass as "yes" | "no" | undefined;

    let status = "None";
    let detail = "No membership";
    if (type && type !== "none") {
      if (end) {
        const expired = new Date(end).getTime() < Date.now();
        status = expired ? "Expired" : "Active";
        detail = `${type} · Ends ${formatDate(end)}`;
      } else {
        status = "Active";
        detail = `${type}`;
      }
    } else if (annualPass) {
      status = annualPass === "yes" ? "Active" : "None";
      detail = annualPass === "yes" ? "Annual Pass" : "No membership";
    }
    return { status, detail };
  }, [profile]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">{error}</div>
            <div className="mt-4">
              <Button onClick={load}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-1">View and update your account information</p>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              {edit ? (
                <input name="email" value={form.email} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.email || "—"}</span>
              )}
            </Field>
            <Field label="Account ID">
              <span>{String(profile?.account_id ?? "—")}</span>
            </Field>
            <Field label="Role">
              <span>{profile?.role}</span>
            </Field>
            <Field label="Last Login">
              <span>{formatDate(profile?.last_login_at)}</span>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name">
              {edit ? (
                <input name="first_name" value={form.first_name} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.first_name || "—"}</span>
              )}
            </Field>
            <Field label="Last Name">
              {edit ? (
                <input name="last_name" value={form.last_name} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.last_name || "—"}</span>
              )}
            </Field>
            <Field label="Phone">
              {edit ? (
                <input name="phone" value={form.phone} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.phone || "—"}</span>
              )}
            </Field>
            <Field label="Address">
              {edit ? (
                <input name="address" value={form.address} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.address || "—"}</span>
              )}
            </Field>
            <Field label="City">
              {edit ? (
                <input name="city" value={form.city} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.city || "—"}</span>
              )}
            </Field>
            <Field label="State">
              {edit ? (
                <input name="state" value={form.state} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.state || "—"}</span>
              )}
            </Field>
            <Field label="ZIP Code">
              {edit ? (
                <input name="zip_code" value={form.zip_code} onChange={onChange} className="w-full rounded border p-2" />
              ) : (
                <span>{form.zip_code || "—"}</span>
              )}
            </Field>
          </div>

          <div className="mt-4 flex gap-3">
            {!edit ? (
              <Button onClick={() => setEdit(true)}>Edit</Button>
            ) : (
              <>
                <Button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button onClick={() => { setEdit(false); load(); }} variant="outline">Cancel</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status"><span>{membership.status}</span></Field>
            <Field label="Details"><span>{membership.detail}</span></Field>
          </div>
          <div className="mt-4">
            {membership.status === "None" || membership.status === "Expired" ? (
              <Button onClick={() => router.push("/membership")}>Get Membership</Button>
            ) : (
              <Button onClick={() => router.push("/membership/confirmation")}>Manage Membership</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}
