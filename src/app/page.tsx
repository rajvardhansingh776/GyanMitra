import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, GraduationCap, UserSquare } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tighter">GyanMitra</h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground mb-12">
            Your personalized AI-powered learning companion. Choose your role to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="items-center">
                    <GraduationCap className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-2xl">For Students</CardTitle>
                    <CardDescription>
                        Access your dashboard, join video calls, and get AI-powered help.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild size="lg" className="w-full max-w-xs">
                        <Link href="/login/student">Student Portal</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="items-center">
                    <UserSquare className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-2xl">For Teachers</CardTitle>
                    <CardDescription>
                        Manage sessions, analyze student engagement, and more.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                     <Button asChild size="lg" className="w-full max-w-xs">
                        <Link href="/login/teacher">Teacher Portal</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
