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
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Student Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your learning dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="raj.singh@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
                    <Input id="password" type="password" defaultValue="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/dashboard?role=student">Login</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#">Create an account</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
