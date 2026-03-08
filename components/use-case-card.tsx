import { type ReactNode } from "react";

type UseCaseCardProps = {
  title: string;
  description: string;
  image?: string;
  component?: ReactNode;
};

export function UseCaseCard({ title, description, component }: UseCaseCardProps) {
  return (
    <div className="group flex flex-col h-full first:border-none border-l border-primary-900 px-4">
      <div className={`relative w-full mb-8 flex items-center justify-center overflow-hidden ${component ? "h-90" : "aspect-square"}`}>
        {component}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-primary-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
