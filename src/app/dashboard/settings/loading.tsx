import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Palette, Settings } from "lucide-react";

export default function SettingsLoading() {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-24" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8 text-muted-foreground" />
              <div>
                <Skeleton className="h-7 w-24 mb-2" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
             <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Skeleton className="h-6 w-32" />
                </h3>
                <div className="space-y-4 pl-7">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
             </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <Skeleton className="h-6 w-32" />
                </h3>
                <div className="space-y-4 pl-7">
                    <Skeleton className="h-20 w-full" />
                </div>
              </div>
             <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  