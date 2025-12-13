import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Globe, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            await login(data);
        } catch (error) {
            // Error is handled by AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        toast.info("Google Sign In is not yet implemented");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md">
                {/* ... existing Card content ... */}

                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">Email</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Password</FormLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-800 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-gray-300 dark:border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Keep me signed in</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full text-white" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleSignIn}
                            >
                                <Globe className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                    <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </CardFooter>
            </Card>

            <div className="fixed top-4 right-4 p-4 bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-gray-200 dark:border-slate-800 w-64 text-sm z-50">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Demo Accounts (Click to Fill)</h3>
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => {
                            form.setValue("email", "citizen@example.com");
                            form.setValue("password", "password123");
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Citizen</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">citizen@example.com</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            form.setValue("email", "worker1@example.com");
                            form.setValue("password", "password123");
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Worker</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">worker1@example.com</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            form.setValue("email", "admin@example.com");
                            form.setValue("password", "password123");
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Admin</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</div>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Login;
