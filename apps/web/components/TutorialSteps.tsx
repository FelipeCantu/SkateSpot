"use client";

interface Step {
  step: number;
  text: string;
  timestamp?: number;
}

export function TutorialSteps({ steps }: { steps: Step[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-white text-sm uppercase tracking-wider">Steps</h3>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {step.step || i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-200">{step.text}</p>
              {step.timestamp !== undefined && (
                <span className="text-xs text-neutral-500">
                  {Math.floor(step.timestamp / 60)}:{String(step.timestamp % 60).padStart(2, "0")}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
