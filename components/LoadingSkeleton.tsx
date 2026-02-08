"use client";

export function CardSkeleton() {
    return (
        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden mb-6 max-w-xl mx-auto animate-pulse">
            <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800" />
                <div className="space-y-2 flex-1">
                    <div className="h-3 bg-neutral-800 rounded w-24" />
                    <div className="h-2 bg-neutral-800 rounded w-16" />
                </div>
            </div>
            <div className="aspect-[4/5] bg-neutral-800" />
            <div className="p-4 space-y-3">
                <div className="flex gap-4">
                    <div className="h-6 w-12 bg-neutral-800 rounded" />
                    <div className="h-6 w-12 bg-neutral-800 rounded" />
                    <div className="h-6 w-12 bg-neutral-800 rounded" />
                </div>
                <div className="h-3 bg-neutral-800 rounded w-full" />
                <div className="h-3 bg-neutral-800 rounded w-2/3" />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-32 bg-neutral-800" />
            <div className="max-w-2xl mx-auto px-4">
                <div className="-mt-16 mb-4 flex justify-between items-end">
                    <div className="w-32 h-32 rounded-full bg-neutral-700 border-4 border-black" />
                    <div className="h-10 w-28 bg-neutral-800 rounded-lg" />
                </div>
                <div className="space-y-3">
                    <div className="h-6 bg-neutral-800 rounded w-40" />
                    <div className="h-4 bg-neutral-800 rounded w-24" />
                    <div className="h-3 bg-neutral-800 rounded w-full max-w-md" />
                    <div className="flex gap-6">
                        <div className="h-12 w-16 bg-neutral-800 rounded" />
                        <div className="h-12 w-16 bg-neutral-800 rounded" />
                        <div className="h-12 w-16 bg-neutral-800 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="divide-y divide-white/5 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                    <div className="w-8 h-4 bg-neutral-800 rounded" />
                    <div className="w-10 h-10 rounded-full bg-neutral-800" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-neutral-800 rounded w-32" />
                        <div className="h-2 bg-neutral-800 rounded w-20" />
                    </div>
                    <div className="h-4 w-12 bg-neutral-800 rounded" />
                </div>
            ))}
        </div>
    );
}
