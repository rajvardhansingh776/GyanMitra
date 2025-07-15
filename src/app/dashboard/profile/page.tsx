import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <CardTitle>My Profile</CardTitle>
          </div>
          <CardDescription>
            View and manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col items-center text-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-primary/50">
              <AvatarImage
                src="https://placehold.co/128x128.png"
                alt="@student"
                data-ai-hint="student avatar"
              />
              <AvatarFallback>RD</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>
          <form className="md:col-span-2 grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Raj Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue="raj.doe@example.com"
                disabled
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
