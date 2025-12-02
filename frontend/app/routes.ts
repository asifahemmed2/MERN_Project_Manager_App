import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/auth/auth-layout.tsx', [
    index('routes/root/home.tsx'),
    route('auth/sign-in', 'routes/auth/sign-in.tsx'),
    route('auth/sign-up', 'routes/auth/sign-up.tsx'),
    route('auth/forgot-password', 'routes/auth/forgot-password.tsx'),
    route('auth/reset-password', 'routes/auth/reset-password.tsx'),
    route('auth/verify-email', 'routes/auth/verify-email.tsx'),
  ]),
  layout('routes/dashboard/dashboard-layout.tsx', [
    route('dashboard', 'routes/dashboard/index.tsx'),
  ])
] satisfies RouteConfig;
