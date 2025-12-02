
import { Link } from "wouter";

export function Logo({ className = "", size = "text-2xl" }: { className?: string; size?: string }) {
    return (
        <Link href="/">
            <a className={`flex items-center gap-2 font-bold ${size} ${className} hover:opacity-90 transition-opacity`}>
                <div className="bg-gradient-to-br from-hope-green to-trust-blue text-white p-1.5 rounded-lg shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    <span className="text-hope-green">स</span>ahaay<span className="text-trust-blue">Connect</span>
                </span>
            </a>
        </Link>
    );
}
