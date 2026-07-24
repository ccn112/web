import { allProfiles } from "../src/data/profile-content";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { ProfileDocument } from "./profile-doc";
import path from "node:path"; import fs from "node:fs";
const fontsDir = path.resolve("scripts/fonts");
Font.register({ family: "Inter", fonts: [{ src: path.join(fontsDir, "Inter_400Regular.ttf") }] });
Font.register({ family: "Jakarta", fonts: [{ src: path.join(fontsDir, "PlusJakartaSans_700Bold.ttf"), fontWeight: 700 }, { src: path.join(fontsDir, "PlusJakartaSans_600SemiBold.ttf"), fontWeight: 600 }, { src: path.join(fontsDir, "PlusJakartaSans_800ExtraBold.ttf"), fontWeight: 800 }] });
const logo = "data:image/png;base64," + fs.readFileSync("public/brand/xtech-logo-white-original.png").toString("base64");
const embed = (p: string) => "data:image/png;base64," + fs.readFileSync(path.join("public", p.replace(/^\//, ""))).toString("base64");
const xb = allProfiles().find((p) => p.key === "xbooking")!;
for (const n of [10, 11, 12, 13]) {
  const doc = { ...xb, coverImage: xb.coverImage ? embed(xb.coverImage) : undefined, sections: xb.sections.slice(0, n).map((s) => ({ ...s, image: s.image ? embed(s.image) : undefined })) };
  try { const b = await renderToBuffer(ProfileDocument({ doc, logoPath: logo, dateLabel: "x" })); console.log("slice", n, "OK", b.length); }
  catch (e: any) { console.log("slice", n, "FAIL", e.message); break; }
}
