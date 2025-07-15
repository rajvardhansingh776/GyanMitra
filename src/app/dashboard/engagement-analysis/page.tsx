"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot,
  Brain,
  Frown,
  HeartPulse,
  Loader2,
  Move,
  Smile,
} from "lucide-react";
import React, { useState } from "react";
import type { AnalyzeStudentEngagementOutput } from "@/ai/flows/analyze-student-engagement";

const mockAnalysis: AnalyzeStudentEngagementOutput = {
  engagementLevel: 78,
  facialExpressionAnalysis:
    "Student shows signs of concentration and occasional smiles, indicating positive engagement.",
  movementAnalysis:
    "Minimal fidgeting and consistent eye contact suggest focused attention on the lesson.",
  overallAnalysis:
    "The student appears to be well-engaged and actively participating in the learning session.",
  suggestedDifficultyAdjustment:
    "Consider slightly increasing the complexity of the next problem to maintain challenge.",
};

export default function EngagementAnalysisPage() {
  const [analysis, setAnalysis] =
    useState<AnalyzeStudentEngagementOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = () => {
    setIsLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  const AnalysisCard = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="p-3 bg-primary/10 rounded-full text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <HeartPulse className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">
          Student Engagement Analysis
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Use our AI to analyze a student's video session and gain insights
          into their engagement level.
        </p>
        <Button onClick={handleAnalysis} disabled={isLoading} className="mt-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run Engagement Analysis"
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {analysis && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                Engagement Score
              </CardTitle>
              <CardDescription>
                Overall engagement level based on multiple factors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-primary">
                  {analysis.engagementLevel}%
                </span>
                <Progress
                  value={analysis.engagementLevel}
                  className="w-full h-4"
                />
              </div>
            </CardContent>
          </Card>
          <AnalysisCard
            icon={<Smile className="h-6 w-6" />}
            title="Facial Expression Analysis"
          >
            {analysis.facialExpressionAnalysis}
          </AnalysisCard>
          <AnalysisCard
            icon={<Move className="h-6 w-6" />}
            title="Movement Analysis"
          >
            {analysis.movementAnalysis}
          </AnalysisCard>
          <AnalysisCard
            icon={<Brain className="h-6 w-6" />}
            title="Overall Analysis"
          >
            {analysis.overallAnalysis}
          </AnalysisCard>
          <AnalysisCard
            icon={<Bot className="h-6 w-6" />}
            title="Suggested Difficulty Adjustment"
          >
            {analysis.suggestedDifficultyAdjustment}
          </AnalysisCard>
        </div>
      )}
    </div>
  );
}
