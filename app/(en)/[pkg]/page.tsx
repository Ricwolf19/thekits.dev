import type { Metadata } from "next";

import { PackageLanding } from "@/components/pages/PackageLanding";
import {
  landingMetadata,
  type PackageRouteParams,
  packageParams,
} from "@/lib/routes/packageRoutes";

type Props = { params: Promise<PackageRouteParams> };

export const generateStaticParams = packageParams;
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  landingMetadata(params, "en");

const Page = async ({ params }: Props) => (
  <PackageLanding pkg={(await params).pkg} locale="en" />
);

export default Page;
