"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpenText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const allSessions = [
    { subject: "Algebra II", status: "Completed", date: "2 days ago", duration: "45 mins", accuracy: "95%" },
    { subject: "Chemistry", status: "Completed", date: "4 days ago", duration: "60 mins", accuracy: "88%" },
    { subject: "Literature", status: "In Progress", date: "1 week ago", duration: "30 mins", accuracy: "N/A" },
    { subject: "Physics", status: "Completed", date: "1 week ago", duration: "50 mins", accuracy: "91%" },
    { subject: "Calculus I", status: "Completed", date: "2 weeks ago", duration: "75 mins", accuracy: "85%" },
    { subject: "Biology", status: "Completed", date: "2 weeks ago", duration: "40 mins", accuracy: "93%" },
    { subject: "World History", status: "Not Started", date: "3 weeks ago", duration: "N/A", accuracy: "N/A" },
    { subject: "English Composition", status: "Completed", date: "1 month ago", duration: "55 mins", accuracy: "90%" },
    { subject: "Geometry", status: "Completed", date: "1 month ago", duration: "60 mins", accuracy: "92%" },
    { subject: "Trigonometry", status: "In Progress", date: "1 month ago", duration: "20 mins", accuracy: "N/A" },
  ];
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Not Started":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "secondary";
    }
  };

export default function SessionsPage() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <BookOpenText className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                A complete history of all your learning sessions.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSessions.map((session) => (
              <TableRow key={session.subject}>
                <TableCell className="font-medium">{session.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getBadgeVariant(session.status)}
                  >
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>{session.accuracy}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {session.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
