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
  ArrowLeft,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { role: "user", content: values.question };
    const historyForApi = [...messages, userMessage];

    // Add user message and a placeholder for the assistant's response
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" }, // Placeholder for streaming
    ]);
    setIsLoading(true);
    form.reset({ ...values, question: "" });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: values.question,
          engagementLevel: values.engagement,
          pastPerformance: values.performance,
          history: messages, // Send history before the new question
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is empty.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunkValue;
          }
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error solving problem:", error);
      const errorMessageContent = "I'm sorry, I encountered an error. Please check your API key or try again.";
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content === '') {
          lastMessage.content = errorMessageContent;
        } else {
          newMessages.push({ role: 'assistant', content: errorMessageContent });
        }
        return newMessages;
      });
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
    <>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">GyanMitra AI</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:h-[calc(100vh-12rem)]">
        <div className="md:col-span-1">
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
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col min-h-[70vh] md:min-h-0">
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
                            {isLoading && message.role === 'assistant' && message.content === '' && (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm text-muted-foreground">Thinking...</span>
                               </div>
                            )}
                         </div>
                      </div>
                      {message.role === "user" && (
                         <Avatar className="h-8 w-8">
                           <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                         </Avatar>
                      )}
                    </div>
                  ))}
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
    </>
  );
}
