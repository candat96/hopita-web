import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-400 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="flex items-center gap-2">
            <Activity className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">Hopita</h1>
          </div>
          <p className="text-teal-100 text-sm">
            He thong quan tri phuc hoi chuc nang thong minh
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
