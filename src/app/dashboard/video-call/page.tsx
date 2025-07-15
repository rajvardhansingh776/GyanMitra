
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Send, HeartPulse, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VideoCallPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">Video Call</h1>
      </div>
      <div className="flex h-full flex-col lg:flex-row gap-4 flex-1">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative rounded-lg overflow-hidden bg-muted border min-h-[300px] md:min-h-0">
            <Image
              src="https://placehold.co/1280x720.png"
              alt="Student's Video"
              fill
              className="object-cover"
              data-ai-hint="student video"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              Raj Singh
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-40 h-32 lg:w-60 lg:h-44 rounded-lg overflow-hidden bg-muted border self-start">
              <Image
                src="https://placehold.co/240x176.png"
                alt="Teacher's Video"
                fill
                className="object-cover"
                data-ai-hint="teacher video"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-md text-xs">
                You
              </div>
            </div>
            <div className="bg-card p-2 rounded-lg border flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <Mic className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <Video className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <ScreenShare className="h-6 w-6" />
                </Button>
                <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full">
                  <PhoneOff className="h-6 w-6" />
                </Button>
            </div>
          </div>
        </div>
        <Card className="lg:w-80 xl:w-96 flex flex-col min-h-[400px] lg:min-h-0">
          <CardHeader>
            <CardTitle>Session Tools</CardTitle>
            <CardDescription>Chat, transcript and analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 bg-muted/50 rounded-lg p-4 text-sm space-y-2 overflow-y-auto">
              <p><strong>You:</strong> Welcome, Raj! Let's start with quadratic equations.</p>
              <p><strong>Raj Singh:</strong> Sounds good, I had some trouble with the homework.</p>
            </div>
            <div className="relative">
              <Textarea placeholder="Type your message here..." className="pr-12"/>
              <Button size="icon" variant="ghost" className="absolute top-1/2 right-2 -translate-y-1/2">
                  <Send className="h-5 w-5"/>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/dashboard/engagement-analysis">
                <HeartPulse className="mr-2 h-4 w-4" />
                Analyze Engagement
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
