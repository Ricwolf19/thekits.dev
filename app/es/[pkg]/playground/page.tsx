import type { Metadata } from "next";

import { PlaygroundPage } from "@/components/pages/PlaygroundPage";
import {
  type PackageRouteParams,
  packageParams,
  playgroundMetadata,
} from "@/lib/routes/packageRoutes";

type Props = { params: Promise<PackageRouteParams> };

export const generateStaticParams = packageParams;
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  playgroundMetadata(params, "es");

const Page = async ({ params }: Props) => (
  <PlaygroundPage pkg={(await params).pkg} locale="es" />
);

export default Page;
