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
          background: "linear-gradient(135deg, #7f56ff 0%, #5b2be1 100%)",
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
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "white",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -8,
          }}
        >
          S
        </div>
      </div>
    ),
    size,
  );
}

