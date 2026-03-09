import { type ReactNode } from "react";

type UseCaseCardProps = {
  title: string;
  description: string;
  image?: string;
  component?: ReactNode;
};

export function UseCaseCard({ title, description, component }: UseCaseCardProps) {
  return (
    <div className="group flex flex-col h-full first:border-none sm:border-l  border-primary-900 sm:px-4 px-2">
      <div className={`relative w-full mb-8 flex items-center justify-center overflow-hidden ${component ? "h-90" : "aspect-square"}`}>
        {component}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-primary-950 to-transparent" />
      </div>
      <h3 className="text-base  text-white mb-2">{title}</h3>
      <p className="text-primary-400 text-sm leading-relaxed mb-12">{description}</p>
    </div>
  );
}
