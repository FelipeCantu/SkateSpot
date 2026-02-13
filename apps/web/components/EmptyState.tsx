"use client";

import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="mb-4 text-neutral-600">{icon}</div>
            )}
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-neutral-400 max-w-sm mb-6">{description}</p>
            )}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
