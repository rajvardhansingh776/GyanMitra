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
import { Bell, Settings, Palette, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

type SettingsState = {
  emailNotifications: boolean;
  pushNotifications: boolean;
};

// Represents the settings as they are saved in a database.
const savedSettings: SettingsState = {
  emailNotifications: true,
  pushNotifications: false,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>(savedSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved settings on initial render
    setSettings(savedSettings);
  }, []);

  useEffect(() => {
    // Check if current settings are different from saved settings
    const hasChanged =
      JSON.stringify(settings) !== JSON.stringify(savedSettings);
    setIsDirty(hasChanged);
  }, [settings]);

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
      // For this simulation, we'll update our 'savedSettings' object.
      Object.assign(savedSettings, settings);
      
      setIsLoading(false);
      setIsDirty(false); 
      toast({
        title: "Settings Saved",
        description: "Your new settings have been applied.",
      });
    }, 1500);
  };
  
  const handleReset = () => {
    setSettings(savedSettings);
    toast({
      title: "Settings Reset",
      description: "Your settings have been restored to the last saved state.",
    });
  };

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
                {!mounted ? (
                  <Skeleton className="w-[180px] h-10" />
                ) : (
                  <Select
                    value={theme}
                    onValueChange={setTheme}
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
                )}
              </div>
            </div>
          </div>
           <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleReset} disabled={isLoading || !isDirty}>
                Reset
              </Button>
              <Button onClick={handleSaveChanges} disabled={!isDirty || isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Settings
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
