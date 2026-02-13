import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="mb-6 p-4 rounded-full bg-neutral-900 border border-white/10">
                <MapPin size={48} className="text-neutral-500" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">404</h1>
            <h2 className="text-xl font-bold text-neutral-300 mb-4">Spot Not Found</h2>
            <p className="text-neutral-500 mb-8 max-w-md">
                Looks like this spot doesn&apos;t exist or has been removed. Maybe it&apos;s time to discover new ones!
            </p>
            <div className="flex gap-4">
                <Link
                    href="/map"
                    className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg transition-colors"
                >
                    Explore Map
                </Link>
                <Link
                    href="/"
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
