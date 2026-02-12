import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sweet & Smart 2026 – Event companion app";

export default async function OGImage() {
  const logoData = await readFile(
    join(process.cwd(), "public", "logo-sweet-smart-2026.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
          background: "linear-gradient(180deg, #1C3D78 0%, #13295A 100%)",
          gap: 24,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Sweet & Smart 2026"
          width={360}
          height={360}
          style={{ objectFit: "contain" }}
        />
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 28,
            fontWeight: 500,
            margin: 0,
          }}
        >
          Event companion app
        </p>
      </div>
    ),
    size,
  );
}
