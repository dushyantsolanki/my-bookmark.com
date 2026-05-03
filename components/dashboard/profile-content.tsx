"use client";

import React from "react";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  Bookmark,
  Star,
  Trash2,
  ShieldCheck,
  Camera,
  LogOut,
  Pencil,
  Tag,
  FolderOpen,
  Check,
  CheckCircle2,
  Zap
} from "lucide-react";
import Script from "next/script";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for casual bookmarking",
    features: [
      "Up to 10 Bookmarks",
      "Up to 3 Collections",
      "Up to 5 Tags",
      "Web Dashboard Access",
    ],
    cta: "Current Plan",
    planId: null,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "Unlimited power for serious collectors",
    features: [
      "Unlimited Bookmarks",
      "Unlimited Collections",
      "Unlimited Tags",
      "Full Extension Access",
      "Priority Email Support",
    ],
    cta: "Upgrade to Pro",
    planId: process.env.NEXT_PUBLIC_RAZORPAY_PRO_PLAN_ID || "plan_xyz",
  },
];

export function ProfileContent() {
  const { user, bookmarks, collections, tags, fetchBookmarks, logout } = useBookmarksStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchBookmarks({}, { silent: true });
  }, [fetchBookmarks]);

  const handleSubscription = async (planId: string) => {
    try {
      setLoading(planId);

      const response = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const options = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "MyBookmark Pro",
        description: "Monthly Subscription",
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.message) {
            window.location.reload();
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#3b82f6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const stats = [
    {
      label: "Total Bookmarks",
      value: bookmarks.length,
      icon: Bookmark,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Favorites",
      value: bookmarks.filter(b => b.isFavorite).length,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Collections",
      value: collections.length,
      icon: FolderOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      label: "Tags Used",
      value: tags.length,
      icon: Tag,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
  ];

  return (
    <div className="flex-1 w-full overflow-auto bg-muted/30 pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-background" />
          <div className="px-6 pb-6">
            <div className="relative -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                <div className="relative group mt-4">
                  <Avatar className="size-24 border-4 border-background shadow-xl ring-1 ring-border">
                    <AvatarImage src={user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "Lndev"}`} />
                    <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="size-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{user?.name || "User Name"}</h1>
                    {user?.subscription === "pro" && (
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-500/20">
                        <Zap className="size-2.5 fill-amber-500" />
                        PRO
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                    <Mail className="size-3.5" />
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Pencil className="size-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <Button variant="destructive" size="sm" onClick={logout}>
                  <LogOut className="size-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card"
            >
              <div
                className={cn("size-10 rounded-lg flex items-center justify-center", stat.bg, stat.color)}
              >
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Details */}
          <Card className="shadow-xs bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="size-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your personal information and how it's displayed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    disabled={!isEditing}
                    className="pl-9 bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    defaultValue={user?.email}
                    disabled={!isEditing}
                    className="pl-9 bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="joined">Member Since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="joined"
                    defaultValue={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "September 2024"}
                    disabled
                    className="pl-9 bg-muted/10 border-border/20"
                  />
                </div>
              </div>
              {isEditing && (
                <Button className="w-full mt-2">Save Changes</Button>
              )}
            </CardContent>
          </Card>

          {/* Security & Settings */}
          <Card className="shadow-xs bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Security & Settings
              </CardTitle>
              <CardDescription>
                Update your security preferences and app settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">Change your account password.</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Two-Factor Auth</p>
                  <p className="text-xs text-muted-foreground text-emerald-500">Currently Disabled.</p>
                </div>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove all data.</p>
                </div>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-primary" />
            <h2 className="text-xl font-bold">Subscription Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingPlans.map((plan) => {
              const isCurrent = (user?.subscription || "free") === plan.name.toLowerCase();
              return (
                <Card
                  key={plan.name}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300",
                    isCurrent ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:shadow-md"
                  )}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 p-2">
                      <CheckCircle2 className="size-5 text-primary fill-background" />
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-baseline gap-2">
                      {plan.name}
                      <span className="text-2xl font-black">{plan.price}</span>
                      {plan.period && <span className="text-xs font-medium text-muted-foreground">{plan.period}</span>}
                    </CardTitle>
                    <CardDescription className="text-xs">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="size-3.5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || loading === plan.planId || !plan.planId}
                      onClick={() => plan.planId && handleSubscription(plan.planId)}
                    >
                      {loading === plan.planId ? "Processing..." : isCurrent ? "Active Plan" : plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
