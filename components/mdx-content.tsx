"use client";

import { useMDXComponent } from 'next-contentlayer2/hooks';

type MDXContentProps = {
  code: string;
};

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component />;
}
