import { Table, Upload } from "lucide-react";

import type { PackageId } from "@/lib/site";

const ICON: Record<PackageId, typeof Table> = {
  listkit: Table,
  uploaderkit: Upload,
};

/**
 * The glyph that stands for a package — a table for listkit, an upload arrow
 * for uploaderkit. One owner for the map, so the nav, the sidebar tabs and the
 * hub cards cannot drift apart; size comes from the caller.
 */
export const PackageIcon = ({
  id,
  className = "size-4",
}: {
  id: PackageId;
  className?: string;
}) => {
  const Glyph = ICON[id];
  return <Glyph className={className} />;
};
