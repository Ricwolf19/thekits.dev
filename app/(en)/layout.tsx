import "../global.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RootHtml } from "@/components/shell/RootHtml";
import { rootMetadata, viewport } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata("en");
export { viewport };

const Layout = ({ children }: { children: ReactNode }) => (
  <RootHtml locale="en">{children}</RootHtml>
);

export default Layout;
