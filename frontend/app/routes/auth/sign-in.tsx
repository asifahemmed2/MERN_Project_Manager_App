import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/lib/schema';
import { useSignInMutation } from '../../hooks/useQuery';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

type SignInForm = z.infer<typeof signInSchema>;
const SignIn = () => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const { mutate, isPending } = useSignInMutation();
  const { signIn } = useAuth();
  const handleOnSubmit = (data: SignInForm) => {
    mutate(data, {
      onSuccess: (data) => {
        signIn(data);
        toast.success('Signed in successfully');
        form.reset();
        navigate('/dashboard');
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || 'An error occurred';
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
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
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm text-blue-600"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <CardFooter className="flex items-center justify-center mt-6">
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  to="/auth/sign-up"
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
