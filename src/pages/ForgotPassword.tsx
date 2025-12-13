import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setEmailSent(true);
        toast.success("Reset link sent to your email");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!emailSent ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="m@example.com"
                                                    {...field}
                                                    className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-800"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full text-white" disabled={loading}>
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
                                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setEmailSent(false)}
                            >
                                Try another email
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remember your password?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                    <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPassword;
