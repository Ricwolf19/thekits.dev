import { listkitManifest } from "../content/listkit.map";
import { uploaderkitManifest } from "../content/uploaderkit.map";
import { assertParity, resolveManifest } from "../lib/content/manifest";
import { parseReadme } from "../lib/content/parse";
import { PACKAGES, readmeRawUrl, type PackageId } from "../lib/site";

const manifests = {
  listkit: listkitManifest,
  uploaderkit: uploaderkitManifest,
};

for (const id of ["listkit", "uploaderkit"] as PackageId[]) {
  const info = PACKAGES[id];
  const v = (await (await fetch(`https://registry.npmjs.org/${id}`)).json())[
    "dist-tags"
  ].latest;
  const [en, es] = await Promise.all(
    (["en", "es"] as const).map(async (l) =>
      parseReadme(await (await fetch(readmeRawUrl(info, v, l))).text()),
    ),
  );
  console.log(`\n=== ${id}@${v} (published) ===`);
  console.log(
    `  sections: EN ${en.sections.length} / ES ${es.sections.length}`,
  );
  try {
    assertParity(id, en, es);
    const pages = resolveManifest(id, manifests[id], en);
    console.log(`  BUILD OK — ${pages.length} pages`);
  } catch (e) {
    console.log(`  BUILD BLOCKED — ${(e as Error).message}`);
  }
}
