import type { Metadata } from "next";

import { Hub } from "@/components/pages/Hub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ kind: "home" }, "es", {
  ownsOgImage: true,
});

const Page = () => <Hub locale="es" />;

export default Page;
