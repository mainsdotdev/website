import Link from "next/link";

type ChangelogCardProps = {
  version: string;
  date: string;
  title: string;
  highlight?: string;
  url?: string;
  description?: string;
};

export function ChangelogCard({
  version,
  date,
  title,
  highlight,
  description,
  url,
}: ChangelogCardProps) {
  const renderTitle = () => {
    if (!highlight) return title;

    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-primary-500">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  const content = (
    <>
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-0 bg-primary-900/50 text-primary-200 text-[11px] rounded-full glass-card">
          {version}
        </span>
      </div>
      <h3 className="text-white text-sm mb-4">{renderTitle()}</h3>
      <h4 className="text-primary-400 text-xs mb-2">{description}</h4>
      <span className="text-primary-400 text-xs">{date}</span>

    </>
  );

  if (url) {
    return (
      <Link 
        href={url}
        className="block bg-primary-900/10 glass-outline rounded-2xl px-4 py-4  transition-all duration-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-primary-900/30 glass-outline rounded-lg p-4 hover:bg-primary-900/50 transition-all duration-300">
      {content}
    </div>
  );
}
