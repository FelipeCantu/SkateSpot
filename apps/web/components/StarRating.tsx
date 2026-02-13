"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
    readonly?: boolean;
}

export function StarRating({ value, onChange, size = 18, readonly = false }: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = value >= star;
                const halfFilled = !filled && value >= star - 0.5;

                return (
                    <button
                        key={star}
                        onClick={() => !readonly && onChange?.(star)}
                        disabled={readonly}
                        className={`transition-colors ${
                            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        } ${filled || halfFilled ? "text-yellow-400" : "text-neutral-600"}`}
                    >
                        <Star
                            size={size}
                            className={filled ? "fill-yellow-400" : halfFilled ? "fill-yellow-400/50" : ""}
                        />
                    </button>
                );
            })}
        </div>
    );
}
