/*
 * Build-time profile PDF generator with change management.
 *
 * For each profile (company, services, 5 products) we hash the content and only
 * (re)generate the PDF when it changed since last run — the filename is
 * date-stamped ([YYYYMMDD]<Name>_Profile.pdf) and the previous file is removed.
 * A manifest tracks the latest file+hash; a generated JSON map feeds the
 * download button in the app.
 *
 * Run: pnpm --filter @x/clay gen:profiles   (also runs before `next build`)
 */
import React from "react";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { allProfiles } from "../src/data/profile-content";
import { ProfileDocument } from "./profile-doc";

const here = path.dirname(fileURLToPath(import.meta.url));
const clayRoot = path.resolve(here, "..");
const fontsDir = path.join(here, "fonts");
const outDir = path.join(clayRoot, "public", "profiles");
const manifestPath = path.join(outDir, "manifest.json");
const generatedMapPath = path.join(clayRoot, "src", "data", "profiles.generated.json");
const logoFile = path.join(clayRoot, "public", "brand", "xtech-logo-white-original.png");
// Pass the logo as a data URI so react-pdf embeds it directly (a Windows file
// path gets misread as a URL → "fetch failed").
const logoData = "data:image/png;base64," + fs.readFileSync(logoFile).toString("base64");

// Bump when the PDF TEMPLATE changes so PDFs regenerate even if content is same.
const TEMPLATE_VERSION = "v2";

Font.register({
  family: "BeVietnamPro",
  fonts: [
    { src: path.join(fontsDir, "BeVietnamPro_400Regular.ttf") },
    { src: path.join(fontsDir, "BeVietnamPro_600SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(fontsDir, "BeVietnamPro_700Bold.ttf"), fontWeight: 700 },
  ],
});
// Be Vietnam Pro has no italics registered → avoid react-pdf substituting.
Font.registerHyphenationCallback((w) => [w]);

type ManifestEntry = { name: string; file: string; hash: string; date: string };
type Manifest = Record<string, ManifestEntry>;

function readManifest(): Manifest {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
  } catch {
    return {};
  }
}

function stamp(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function dateLabel(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const manifest = readManifest();
  const now = new Date();
  const day = stamp(now);
  const profiles = allProfiles();

  let created = 0;
  let skipped = 0;

  for (const doc of profiles) {
    const hash = crypto.createHash("sha256").update(TEMPLATE_VERSION + JSON.stringify(doc)).digest("hex").slice(0, 16);
    const prev = manifest[doc.key];

    if (prev && prev.hash === hash && fs.existsSync(path.join(outDir, prev.file))) {
      skipped++;
      continue;
    }

    const file = `[${day}]${doc.filenameBase}.pdf`;
    const buffer = await renderToBuffer(
      <ProfileDocument doc={doc} logoPath={logoData} dateLabel={dateLabel(now)} />,
    );
    fs.writeFileSync(path.join(outDir, file), buffer);

    // Remove the previous dated file for this profile if the name changed.
    if (prev && prev.file && prev.file !== file) {
      const old = path.join(outDir, prev.file);
      if (fs.existsSync(old)) fs.rmSync(old);
    }

    manifest[doc.key] = { name: doc.name, file, hash, date: day };
    created++;
    console.log(`  ✓ ${doc.key.padEnd(10)} → ${file}`);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  // App-facing map for the download button: key → { name, file, date }.
  const map: Record<string, { name: string; file: string; date: string }> = {};
  for (const [k, v] of Object.entries(manifest)) map[k] = { name: v.name, file: v.file, date: v.date };
  fs.writeFileSync(generatedMapPath, JSON.stringify(map, null, 2) + "\n");

  console.log(`profiles: ${created} generated, ${skipped} unchanged → public/profiles/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
