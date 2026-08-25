import { DiffViewer } from "@/components/demo/diff-viewer";
import { ReviewSectionShell } from "@/components/sections/review-section-shell";

export function ReviewSection() {
  return (
    <ReviewSectionShell>
      <DiffViewer />
    </ReviewSectionShell>
  );
}
