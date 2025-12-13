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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Globe, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.enum(["citizen", "worker"], {
        required_error: "Please select a role",
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "citizen",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...apiData } = data;
            await register(apiData);
        } catch (error) {
            // Error handled by AuthContext
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        toast.info("Google Sign Up is not yet implemented");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">Phone (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+1234567890"
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
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">I am a...</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-800">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
                                                <SelectItem value="citizen" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-slate-800">Citizen</SelectItem>
                                                <SelectItem value="worker" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-slate-800">Clean Worker</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">Password</FormLabel>
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
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 dark:text-gray-100">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...field}
                                                    className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-800 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    {showConfirmPassword ? (
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
                            <Button type="submit" className="w-full text-white" disabled={loading}>
                                {loading ? "Creating account..." : "Create account"}
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
                                onClick={handleGoogleSignUp}
                            >
                                <Globe className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
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

export default Register;
