import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #1C3D78 0%, #173A73 100%)",
          borderRadius: 110,
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.24)",
            color: "white",
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -8,
          }}
        >
          SS
        </div>
      </div>
    ),
    size,
  );
}

