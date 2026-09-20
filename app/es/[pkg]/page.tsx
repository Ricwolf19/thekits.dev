import type { Metadata } from "next";

import { PackageOverview } from "@/components/pages/PackageOverview";
import {
  landingMetadata,
  type PackageRouteParams,
  packageParams,
} from "@/lib/routes/packageRoutes";

type Props = { params: Promise<PackageRouteParams> };

export const generateStaticParams = packageParams;
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  landingMetadata(params, "es");

const Page = async ({ params }: Props) => (
  <PackageOverview pkg={(await params).pkg} locale="es" />
);

export default Page;
