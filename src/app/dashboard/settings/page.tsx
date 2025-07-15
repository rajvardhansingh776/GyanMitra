
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
const savedSettingsData: SettingsState = {
  emailNotifications: true,
  pushNotifications: false,
};

// Represents the saved theme. In a real app, this would also come from a database.
let savedThemeValue = "system";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>(savedSettingsData);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // This state tracks the chosen theme setting ('light', 'dark', 'system')
  const [selectedTheme, setSelectedTheme] = useState(savedThemeValue);

  useEffect(() => {
    setMounted(true);
    // When component mounts, sync the theme selection state from the provider
    // The `theme` from useTheme() correctly gives us 'light', 'dark', or 'system'
    setSelectedTheme(theme || 'system');
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;
    // Check if current settings (including theme) are different from saved settings
    const notificationsChanged =
      JSON.stringify(settings) !== JSON.stringify(savedSettingsData);
    const themeChanged = selectedTheme !== savedThemeValue;
    setIsDirty(notificationsChanged || themeChanged);
  }, [settings, selectedTheme, mounted]);

  const handleSettingChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleThemeSelectionChange = (value: string) => {
    setSelectedTheme(value);
  }

  const handleSaveChanges = () => {
    setIsLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      // In a real app, you'd update your backend here.
      // For this simulation, we'll update our 'saved' data objects.
      Object.assign(savedSettingsData, settings);
      savedThemeValue = selectedTheme;
      setTheme(selectedTheme); // Apply the theme globally
      
      setIsLoading(false);
      setIsDirty(false); 
      toast({
        title: "Settings Saved",
        description: "Your new settings have been applied.",
      });
    }, 1500);
  };
  
  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSettings(savedSettingsData);
      setSelectedTheme(savedThemeValue);
      setTheme(savedThemeValue); // Also reset the live theme
      setIsLoading(false);
      toast({
        title: "Settings Reset",
        description: "Your settings have been restored to the last saved state.",
        variant: 'default'
      });
    }, 500);
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
                    value={selectedTheme}
                    onValueChange={handleThemeSelectionChange}
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
                Save Changes
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
