import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DocsShell } from "@/components/pages/DocsShell";
import { isPackageId } from "@/lib/site";

const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ pkg: string }>;
}) => {
  const { pkg } = await params;
  if (!isPackageId(pkg)) notFound();
  return (
    <DocsShell pkg={pkg} locale="en">
      {children}
    </DocsShell>
  );
};

export default Layout;
