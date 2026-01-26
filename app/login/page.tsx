import LoginForm from './login-form';
import { Suspense } from 'react';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>;
}) {
    const { callbackUrl } = await searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>
                <Suspense fallback={<div className="text-center">Loading form...</div>}>
                    <LoginForm callbackUrl={callbackUrl} />
                </Suspense>
            </div>
        </div>
    )
}
