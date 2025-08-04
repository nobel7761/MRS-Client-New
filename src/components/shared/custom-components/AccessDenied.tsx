import Link from "next/link";

interface AccessDeniedProps {
  message?: string;
  backPath?: string;
  backText?: string;
}

const AccessDenied = ({
  message = "You don't have permission to access this page.",
  backPath = "/admin",
  backText = "Go Back to Dashboard",
}: AccessDeniedProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          href={backPath}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {backText}
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
