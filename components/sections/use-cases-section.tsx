import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { UseCaseCard } from "@/components/use-case-card";
import { WorkspaceList } from "@/components/demo/workspace-list";
import { IssuesList } from "@/components/demo/issues-list";
import { FileExplorer } from "@/components/demo/file-explorer";

type UseCase = {
  title: string;
  description: string;
  image?: string;
};

type UseCasesSectionProps = {
  useCases: readonly UseCase[];
};

const demoComponents: Record<number, ReactNode> = {
  0: <WorkspaceList />,
  1: <FileExplorer />,
  2: <IssuesList />,
};

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 className="text-3xl md:text-5xl text-white mb-12 text-center tracking-tight">
          Built for agent workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={useCase.title}
              {...useCase}
              component={demoComponents[index]}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
