import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useVerifyEmailMutation } from '../../hooks/useQuery';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || 'An error occurred';
            setIsSuccess(false);
            console.log(error);

            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 ">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully.
                </p>
                <Link to="/auth/sign-in" className="text-sm text-blue-500 mt-6">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500" />
                <h3 className="text-lg font-semibold">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again.
                </p>

                <Link to="/auth/sign-in" className="text-sm text-blue-500 mt-6">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
