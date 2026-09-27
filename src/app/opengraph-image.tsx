import { ImageResponse } from "next/og";

export const alt = "Minha Listinha — achadinhos e cupons com desconto real";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 800,
          }}
        >
          ML
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16, display: "flex" }}>
          Minha Listinha
        </div>
        <div style={{ fontSize: 34, marginTop: 20, opacity: 0.92, display: "flex" }}>
          achadinhos e cupons com desconto real
        </div>
      </div>
    ),
    { ...size }
  );
}
