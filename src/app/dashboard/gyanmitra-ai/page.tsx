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
import { useState, useEffect, useRef } from "react";
import {
  Bot,
  BrainCircuit,
  Loader2,
  Sparkles,
  ClipboardCheck,
  ArrowLeft,
  User,
} from "lucide-react";
import type { GyanMitraAiOutput } from "@/ai/flows/gyanmitra-ai";
import { gyanmitraAi } from "@/ai/flows/gyanmitra-ai";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  question: z
    .string()
    .min(1, { message: "Please enter a question." })
    .max(500, { message: "Question must not exceed 500 characters." }),
  engagement: z.number().min(0).max(1),
  performance: z.number().min(0).max(1),
});

type Message = {
  role: "user" | "assistant";
  content: string;
  explanation?: string;
};

export default function GyanMitraAiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      engagement: 0.75,
      performance: 0.6,
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const streamText = (
    text: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      let index = 0;
      const words = text.split(" ");
      const interval = setInterval(() => {
        if (index < words.length) {
          const chunk = (index > 0 ? " " : "") + words[index];
          onChunk(chunk);
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { role: "user", content: values.question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset({ ...values, question: "" });

    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const response = await gyanmitraAi({
        question: values.question,
        engagementLevel: values.engagement,
        pastPerformance: values.performance,
        history: history,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        explanation: "",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      await streamText(response.solution, (chunk) => {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      });

      if (response.explanation) {
        await streamText(response.explanation, (chunk) => {
          setMessages((prev) =>
            prev.map((msg, i) =>
              i === prev.length - 1
                ? { ...msg, explanation: (msg.explanation || "") + chunk }
                : msg
            )
          );
        });
      }
    } catch (error) {
      console.error("Error solving problem:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
      if (form.getValues("question").trim()) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">GyanMitra AI</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                Student Profile
              </CardTitle>
              <CardDescription>
                Adjust these sliders to simulate different student contexts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
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
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Ask a question to start. Use Shift+Enter for new lines.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                  {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground pt-16">
                      <Bot className="h-16 w-16 mb-4" />
                      <p>Your conversation will appear here.</p>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-4",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xl p-4 rounded-lg",
                          message.role === "assistant"
                            ? "bg-card border shadow-sm"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                           <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        {message.explanation && (
                          <div className="mt-4 pt-4 border-t">
                            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Explanation
                            </h3>
                             <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown>{message.explanation}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                         <Avatar className="h-8 w-8">
                           <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                         </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                     <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                           <AvatarFallback>
                             <Bot className="h-5 w-5" />
                           </AvatarFallback>
                         </Avatar>
                       <div className="max-w-xl p-4 rounded-lg bg-muted">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                       </div>
                     </div>
                  )}
                </div>
              </ScrollArea>
              <div className="mt-auto pt-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="relative"
                  >
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., How do I solve 2x + 5 = 15?"
                              rows={2}
                              {...field}
                              onKeyDown={handleKeyDown}
                              className="pr-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="absolute bottom-2 right-2"
                      disabled={isLoading || !form.getValues("question").trim()}
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
