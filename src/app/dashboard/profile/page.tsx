"use client";

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
import { User, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." }),
  email: z.string().email(),
  avatar: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
    mode: "onChange",
  });
  
  useEffect(() => {
    form.reset(user);
  }, [user, form]);


  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    // Simulate an API call to save the data
    setTimeout(() => {
      updateUser(data);
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1500);
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "Image Too Large",
          description: "Please select an image smaller than 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        form.setValue("avatar", newAvatarUrl, { shouldDirty: true });
        updateUser({ avatar: newAvatarUrl }); // Update context for live preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">My Profile</h1>
      </div>
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
                src={user.avatar}
                alt={user.fullName}
                data-ai-hint="student avatar"
              />
              <AvatarFallback>
                {user.fullName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
              onChange={handlePhotoChange}
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </Button>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="md:col-span-2 grid gap-6"
            >
               <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" type="button" onClick={() => form.reset(user)}>Cancel</Button>
                <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
