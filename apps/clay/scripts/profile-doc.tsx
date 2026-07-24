/* React-PDF template for X-TECH profiles. Brand-styled, Vietnamese via
 * Be Vietnam Pro. Rendered to a buffer by gen-profiles.tsx. */
import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ProfileDoc } from "../src/data/profile-content";

const BLUE = "#1653F0";
const CYAN = "#2E9BFF";
const GOLD = "#C7A24B";
const INK = "#0F1A33";
const MUTED = "#5A6478";
const LINE = "#E3E8F2";

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 46, fontFamily: "BeVietnamPro", color: INK, fontSize: 10.5, lineHeight: 1.5 },
  // Cover
  coverBand: { backgroundColor: BLUE, borderRadius: 14, padding: 28, color: "#fff" },
  logo: { width: 46, height: 46, marginBottom: 14 },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: "#DCE6FF", textTransform: "uppercase" },
  coverTitle: { fontSize: 24, fontWeight: 700, marginTop: 8 },
  coverIntro: { fontSize: 11, color: "#EAF1FF", marginTop: 12, lineHeight: 1.6 },
  coverMeta: { fontSize: 9, color: "#C6D6FF", marginTop: 18 },
  // Sections
  section: { marginTop: 20 },
  sTitle: { fontSize: 13, fontWeight: 700, color: BLUE },
  sRule: { height: 2, width: 34, backgroundColor: GOLD, marginTop: 5, marginBottom: 8, borderRadius: 2 },
  sSub: { fontSize: 10, color: MUTED, marginBottom: 8, lineHeight: 1.55 },
  sNote: { fontSize: 9.5, color: INK, backgroundColor: "#F4F7FD", borderLeftWidth: 2, borderLeftColor: CYAN, padding: 8, borderRadius: 4, marginBottom: 8 },
  // Feature rows
  feature: { flexDirection: "row", marginBottom: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginTop: 5, marginRight: 8 },
  fLabel: { fontWeight: 700, color: INK },
  fBenefit: { color: MUTED },
  bullet: { flexDirection: "row", marginBottom: 4 },
  bDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: CYAN, marginTop: 5, marginRight: 8 },
  bText: { flex: 1, color: INK },
  // Footer
  footer: { position: "absolute", bottom: 26, left: 46, right: 46, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8, fontSize: 8, color: MUTED },
});

const COMPANY_LINE = "CÔNG TY CỔ PHẦN CÔNG NGHỆ X-TECH · Hotline 094.643.8585 · lienhe@x-tech.com.vn";

export function ProfileDocument({ doc, logoPath, dateLabel }: { doc: ProfileDoc; logoPath: string; dateLabel: string }) {
  return (
    <Document title={`${doc.name} — Hồ sơ giới thiệu`} author="X-TECH">
      <Page size="A4" style={s.page} wrap>
        <View style={s.coverBand}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={s.logo} src={logoPath} />
          <Text style={s.eyebrow}>
            {doc.kind === "company" ? "Hồ sơ công ty" : doc.kind === "services" ? "Hồ sơ dịch vụ" : "Hồ sơ sản phẩm"}
          </Text>
          <Text style={s.coverTitle}>{doc.tagline}</Text>
          {doc.intro ? <Text style={s.coverIntro}>{doc.intro}</Text> : null}
          <Text style={s.coverMeta}>Cập nhật: {dateLabel}</Text>
        </View>

        {doc.sections.map((sec, i) => (
          <View key={i} style={s.section}>
            <Text style={s.sTitle}>{sec.title}</Text>
            <View style={s.sRule} />
            {sec.subtitle ? <Text style={s.sSub}>{sec.subtitle}</Text> : null}
            {sec.note ? <Text style={s.sNote}>{sec.note}</Text> : null}
            {sec.features?.map((f, k) => (
              <View key={k} style={s.feature}>
                <View style={s.dot} />
                <Text style={{ flex: 1 }}>
                  <Text style={s.fLabel}>{f.label}</Text>
                  <Text style={s.fBenefit}> — {f.benefit}</Text>
                </Text>
              </View>
            ))}
            {sec.bullets?.map((b, k) => (
              <View key={k} style={s.bullet}>
                <View style={s.bDot} />
                <Text style={s.bText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text>{COMPANY_LINE}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
