"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Bot,
  BrainCircuit,
  Loader2,
  Sparkles,
  ClipboardCheck,
  ArrowLeft,
} from "lucide-react";
import type { AiProblemSolverOutput } from "@/ai/flows/ai-problem-solver";
import { aiProblemSolver } from "@/ai/flows/ai-problem-solver";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  question: z
    .string()
    .min(1, { message: "Please enter a question." })
    .max(500, { message: "Question must not exceed 500 characters." }),
  engagement: z.number().min(0).max(1),
  performance: z.number().min(0).max(1),
});

export default function AiProblemSolverPage() {
  const [result, setResult] = useState<AiProblemSolverOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      engagement: 0.75,
      performance: 0.6,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiProblemSolver({
        question: values.question,
        engagementLevel: values.engagement,
        pastPerformance: values.performance,
      });
      setResult(response);
    } catch (error) {
      console.error("Error solving problem:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with the AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isLoading) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The solution has been copied.",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">AI Problem Solver</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                AI Problem Solver
              </CardTitle>
              <CardDescription>
                Get help with any problem. The AI will adjust to your learning
                pace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Question</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., How do I solve 2x + 5 = 15?"
                            rows={5}
                            {...field}
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engagement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recent Engagement Level</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={1}
                            step={0.01}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Simulated based on your recent activity.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="performance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Past Performance</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={1}
                            step={0.01}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Simulated based on your problem-solving history.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Help
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="min-h-[60vh]">
              <CardHeader>
                <CardTitle>AI Generated Solution</CardTitle>
                <CardDescription>
                  Here's a step-by-step solution tailored for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-1/4 mt-4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                )}
                {result && (
                  <div className="space-y-6 animate-in fade-in-50">
                    <div>
                      <h3 className="font-semibold mb-2">Solution</h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-lg relative">
                        <p>{result.solution}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => copyToClipboard(result.solution)}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Difficulty Level</h3>
                      <p className="text-sm text-muted-foreground">
                        {result.difficultyLevel}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Explanation</h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{result.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
                {!isLoading && !result && (
                  <div className="flex flex-col items-center justify-center text-center h-80">
                    <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Your solution will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
