import type { Metadata } from "next";

import { Hub } from "@/components/pages/Hub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ kind: "home" }, "en", {
  ownsOgImage: true,
});

const Page = () => <Hub locale="en" />;

export default Page;
