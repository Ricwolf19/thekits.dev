import type { Metadata } from "next";

import { DocsRoute } from "@/components/pages/DocsRoute";
import {
  docsMetadata,
  docsParams,
  type DocsRouteParams,
} from "@/lib/routes/packageRoutes";

type Props = { params: Promise<DocsRouteParams> };

// `dynamicParams` is incompatible with `cacheComponents`, so an unknown first
// segment is rejected by the `isPackageId` guard in the layout instead. Next
// also resolves the static `/es` tree ahead of this dynamic `[pkg]`.
export const generateStaticParams = docsParams;
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  docsMetadata(params, "es");

const Page = ({ params }: Props) => <DocsRoute params={params} locale="es" />;

export default Page;
