"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Settings, Palette, Loader2, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type SettingsState = {
  emailNotifications: boolean;
  pushNotifications: boolean;
};

// Represents the settings as they are saved in a database.
const savedSettingsData: SettingsState = {
  emailNotifications: true,
  pushNotifications: false,
};
let savedThemeValue = "system";

// Represents the application's default settings.
const defaultSettingsData: SettingsState = {
  emailNotifications: true,
  pushNotifications: false,
};
const defaultThemeValue = "system";


export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>(savedSettingsData);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [currentTheme, setCurrentTheme] = useState("system");
  
  useEffect(() => {
    setMounted(true);
    // On mount, restore settings from our "saved" data
    setSettings(savedSettingsData);
    setCurrentTheme(savedThemeValue);
  }, []);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettingsData) || currentTheme !== savedThemeValue;
  
  const handleSettingChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      // In a real app, you'd update your backend here.
      // For this simulation, we'll update our 'saved' data objects.
      Object.assign(savedSettingsData, settings);
      savedThemeValue = currentTheme;
      setTheme(currentTheme);
      
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your new settings have been applied.",
      });
    }, 1500);
  };
  
  const handleReset = () => {
    setSettings(defaultSettingsData);
    setCurrentTheme(defaultThemeValue);
    setTheme(defaultThemeValue);
    toast({
      title: "Settings Reset",
      description: "Your settings have been reset to their defaults.",
      variant: 'default'
    });
  };
  
  if (!mounted) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle>Settings</CardTitle>
            </div>
             <CardDescription>
                Manage your account and notification settings.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
             <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                </h3>
                <div className="space-y-4 pl-7">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
             </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                </h3>
                <div className="space-y-4 pl-7">
                    <Skeleton className="h-20 w-full" />
                </div>
              </div>

             <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your account and notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your progress and sessions.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                 <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get push notifications on your devices.
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("pushNotifications", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </h3>
             <div className="space-y-4 pl-7">
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Theme</Label>
                   <p className="text-sm text-muted-foreground">
                    Select your preferred color scheme.
                  </p>
                </div>
                <Select
                  value={currentTheme}
                  onValueChange={setCurrentTheme}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
           <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleReset} disabled={isLoading}>
                Reset to Default
              </Button>
              <Button onClick={handleSaveChanges} disabled={!isDirty || isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
