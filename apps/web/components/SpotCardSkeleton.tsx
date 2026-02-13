export function SpotCardSkeleton() {
    return (
        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden animate-pulse">
            {/* Hero placeholder */}
            <div className="aspect-[16/10] bg-neutral-800" />

            {/* Info placeholder */}
            <div className="p-3 space-y-2.5">
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
                <div className="flex gap-3">
                    <div className="h-3 bg-neutral-800 rounded w-12" />
                    <div className="h-3 bg-neutral-800 rounded w-16" />
                    <div className="h-3 bg-neutral-800 rounded w-14 ml-auto" />
                </div>
                <div className="flex gap-1">
                    <div className="h-4 bg-neutral-800 rounded-full w-12" />
                    <div className="h-4 bg-neutral-800 rounded-full w-10" />
                    <div className="h-4 bg-neutral-800 rounded-full w-14" />
                </div>
            </div>
        </div>
    );
}
