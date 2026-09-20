import type { Metadata } from "next";

import { ReleasesPage } from "@/components/pages/ReleasesPage";
import {
  type PackageRouteParams,
  packageParams,
  releasesMetadata,
} from "@/lib/routes/packageRoutes";

type Props = { params: Promise<PackageRouteParams> };

export const generateStaticParams = packageParams;
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  releasesMetadata(params, "en");

const Page = async ({ params }: Props) => (
  <ReleasesPage pkg={(await params).pkg} locale="en" />
);

export default Page;
