/* React-PDF template for X-TECH profiles. Title = Plus Jakarta Sans, body =
 * Inter (both Vietnamese-capable). Image fields arrive as data URIs (embedded
 * by gen-profiles.tsx). Rendered to a buffer at build time. */
import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ProfileDoc } from "../src/data/profile-content";

const BLUE = "#1653F0";
const BLUE_DK = "#0B39C4";
const CYAN = "#2E9BFF";
const GOLD = "#C7A24B";
const INK = "#101A30";
const MUTED = "#586074";
const LINE = "#E5EAF3";
const SOFT = "#F5F8FE";

const TITLE = "Jakarta";
const BODY = "Inter";

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 58, paddingHorizontal: 44, fontFamily: BODY, color: INK, fontSize: 10, lineHeight: 1.5 },
  // Cover (own page, full blue)
  cover: { fontFamily: BODY, color: "#fff", padding: 0 },
  coverFill: { backgroundColor: BLUE, height: "100%", paddingTop: 64, paddingBottom: 54, paddingHorizontal: 52, position: "relative" },
  logo: { width: 132, height: 40, objectFit: "contain", marginBottom: 40 },
  eyebrow: { fontFamily: TITLE, fontWeight: 700, fontSize: 10, letterSpacing: 2, color: "#BFD3FF", textTransform: "uppercase" },
  coverTitle: { fontFamily: TITLE, fontWeight: 800, fontSize: 30, lineHeight: 1.18, marginTop: 14, maxWidth: 430 },
  coverIntro: { fontFamily: BODY, fontSize: 12, color: "#E7EEFF", marginTop: 18, lineHeight: 1.65, maxWidth: 430 },
  coverImgWrap: { marginTop: 30 },
  coverImg: { width: 491, height: 368 },
  coverFoot: { position: "absolute", left: 52, right: 52, bottom: 40, borderTopWidth: 1, borderTopColor: "#6F93FF", paddingTop: 14, fontSize: 9, color: "#CBD8FF", lineHeight: 1.6 },
  coverFootName: { fontFamily: TITLE, fontWeight: 700, color: "#fff", fontSize: 10 },
  // Content
  secHeader: { marginTop: 22, marginBottom: 6 },
  secTitle: { fontFamily: TITLE, fontWeight: 700, fontSize: 14, color: BLUE_DK },
  secRule: { height: 2.5, width: 36, backgroundColor: GOLD, marginTop: 6, borderRadius: 2 },
  secSub: { fontFamily: BODY, fontSize: 10, color: MUTED, marginTop: 8, lineHeight: 1.6 },
  note: { backgroundColor: SOFT, padding: 10, marginTop: 10, flexDirection: "row" },
  noteBar: { width: 2.5, backgroundColor: CYAN, marginRight: 9 },
  noteText: { flex: 1, fontFamily: BODY, fontSize: 9.5, color: INK, lineHeight: 1.55 },
  img: { width: 507, height: 380, marginTop: 12 },
  feature: { flexDirection: "row", marginTop: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginTop: 4.5, marginRight: 9 },
  fLabel: { fontFamily: TITLE, fontWeight: 600, color: INK },
  fBenefit: { fontFamily: BODY, color: MUTED },
  bullet: { flexDirection: "row", marginTop: 5 },
  bDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: CYAN, marginTop: 5, marginRight: 9 },
  bText: { flex: 1, fontFamily: BODY, color: INK },
  footerRule: { position: "absolute", bottom: 44, left: 44, right: 44, height: 1, backgroundColor: LINE },
  footer: { position: "absolute", bottom: 26, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", paddingTop: 8, fontSize: 8, color: MUTED },
});

const KIND_LABEL: Record<string, string> = { company: "Hồ sơ công ty", services: "Hồ sơ dịch vụ", product: "Hồ sơ sản phẩm" };
const COMPANY_LINE = "CÔNG TY CỔ PHẦN CÔNG NGHỆ X-TECH";
const CONTACT_LINE = "Hotline 094.643.8585  ·  lienhe@x-tech.com.vn  ·  x-tech.com.vn";

export function ProfileDocument({ doc, logoPath, dateLabel }: { doc: ProfileDoc; logoPath: string; dateLabel: string }) {
  return (
    <Document title={`${doc.name} — ${KIND_LABEL[doc.kind]}`} author="X-TECH">
      {/* Cover page */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverFill}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={s.logo} src={logoPath} />
          <Text style={s.eyebrow}>{KIND_LABEL[doc.kind]}</Text>
          <Text style={s.coverTitle}>{doc.tagline}</Text>
          {doc.intro ? <Text style={s.coverIntro}>{doc.intro}</Text> : null}
          {doc.coverImage ? (
            <View style={s.coverImgWrap}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image style={s.coverImg} src={doc.coverImage} />
            </View>
          ) : null}
          <View style={s.coverFoot}>
            <Text style={s.coverFootName}>{COMPANY_LINE}</Text>
            <Text>{CONTACT_LINE}</Text>
            <Text>Cập nhật: {dateLabel}</Text>
          </View>
        </View>
      </Page>

      {/* One page per section — keeps each topic tidy and, crucially, keeps an
          image + its text on a single page (react-pdf mis-lays images that flow
          across page breaks). */}
      {doc.sections.map((sec, i) => (
        <Page key={i} size="A4" style={s.page} wrap>
          <View style={s.secHeader}>
            <Text style={s.secTitle}>{sec.title}</Text>
            <View style={s.secRule} />
          </View>
          {sec.subtitle ? <Text style={s.secSub}>{sec.subtitle}</Text> : null}
          {sec.note ? (
            <View style={s.note}>
              <View style={s.noteBar} />
              <Text style={s.noteText}>{sec.note}</Text>
            </View>
          ) : null}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {sec.image ? <Image style={s.img} src={sec.image} /> : null}
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

          <View style={s.footerRule} fixed />
          <View style={s.footer} fixed>
            <Text>{COMPANY_LINE} · {CONTACT_LINE}</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
          </View>
        </Page>
      ))}
    </Document>
  );
}
