import { format } from "date-fns";

type PostMetaProps = {
  date: string;
  author?: string;
  dateFormat?: string;
  className?: string;
};

export function PostMeta({
  date,
  author,
  dateFormat = "MMM dd, yyyy",
  className = "flex items-center gap-2 text-xs text-primary-400",
}: PostMetaProps) {
  return (
    <div className={className}>
      {author && <span>{author}</span>}
      {author && <span>&middot;</span>}
      <time dateTime={date}>
        {format(new Date(date), dateFormat)}
      </time>
    </div>
  );
}
