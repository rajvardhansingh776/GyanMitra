import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, ArrowLeft } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
       <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-muted-foreground" />
            <div>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col items-center text-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="md:col-span-2 grid gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
