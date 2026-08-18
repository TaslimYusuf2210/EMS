import { Link, Navigate } from "react-router-dom";
import { Loader2, Home, LayoutDashboard, Compass } from "lucide-react";
import { useGetCurrentUser } from "../hooks/useQuery/useGetCurrentUser";

function getToken(): string | null {
  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch {
    return null;
  }
}

function NotFoundLoading() {
  return (
    <div className="min-h-screen bg-[#fefae0] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fefae0] flex flex-col">
      {/* Brand header */}
      <header className="max-w-6xl w-full mx-auto px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#faedcd] flex items-center justify-center text-neutral-950 font-black text-lg shadow-sm">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            StaffSync
          </span>
        </Link>
      </header>

      {/* 404 body */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-lg">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute -inset-6 bg-[#e9edc9]/60 rounded-full blur-2xl" />
            <div className="relative text-8xl md:text-9xl font-extrabold tracking-tight text-indigo-950 leading-none">
              4<span className="text-[#7d8a4e]">0</span>4
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Page not found
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Check the URL, or head back to your dashboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-neutral-950 bg-[#faedcd] hover:bg-[#ccd5ae] rounded-xl shadow-lg shadow-indigo-100 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-indigo-700 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              Go home
            </Link>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Compass className="w-4 h-4" />
            Lost? Try the dashboard to find your way.
          </div>
        </div>
      </main>
    </div>
  );
}

function NotFoundResolver() {
  const { isLoading, isError } = useGetCurrentUser();

  if (isLoading) return <NotFoundLoading />;
  if (isError) return <Navigate to="/login" replace />;

  return <NotFoundPage />;
}

export default function NotFound() {
  const token = getToken();

  // No token → not authorized → send to login.
  if (!token) return <Navigate to="/login" replace />;

  // Token present → verify against /auth/me before showing the 404 page.
  return <NotFoundResolver />;
}
