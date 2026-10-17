import { SignUp, SignIn, useUser } from '@clerk/react';
import React from 'react'
import { Navigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Login = ({ mode = "login" }) => {

    const isRegister = mode === "register";
    const { isLoaded, isSignedIn } = useUser()

    if (isLoaded && isSignedIn) {
        return <Navigate to="/dashboard" replace />
    }

    const clerkAppearance = {
        variables: {
            colorPrimary: '#2B5CF0',
            fontFamily: 'Urbanist, sans-serif',
            borderRadius: '12px',
        },
        elements: {
            card: 'shadow-none bg-transparent border-0',
            rootBox: 'w-full',
        }
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-4"
            style={{ backgroundColor: 'var(--bg-page)' }}
        >
            <div className="w-full max-w-[440px] flex flex-col items-center">
                {/* Logo above the Clerk widget */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <div style={{ color: 'var(--text-primary)' }}>
                        <Logo size={32} />
                    </div>
                    <p className="mt-2 text-[14px]" style={{ color: 'var(--text-muted)' }}>
                        Simple, secure video meetings.
                    </p>
                </div>

                {/* Flat card wrapping existing Clerk widget */}
                <div
                    className="w-full rounded-[12px] border p-2 sm:p-4 flex justify-center"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                    }}
                >
                    {isRegister ? (
                        <SignUp
                            routing="path"
                            path="/register"
                            signInUrl="/login"
                            fallbackRedirectUrl="/dashboard"
                            appearance={clerkAppearance}
                        />
                    ) : (
                        <SignIn
                            routing="path"
                            path="/login"
                            signUpUrl="/register"
                            fallbackRedirectUrl="/dashboard"
                            appearance={clerkAppearance}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
