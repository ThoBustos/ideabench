import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "IdeaBench — Where my ideas grow.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-700-normal.ttf"
  ).then((res) => res.arrayBuffer());

  const bgImageData = await readFile(
    join(process.cwd(), "public/assets/hero-bg.png")
  );
  const bgBase64 = `data:image/png;base64,${bgImageData.toString("base64")}`;

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
          position: "relative",
        }}
      >
        <img
          src={bgBase64}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontFamily: "Geist",
              fontWeight: 700,
              color: "#1a4040",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Where my ideas grow.
          </div>
          <div
            style={{
              fontSize: 30,
              fontFamily: "Geist",
              fontWeight: 700,
              color: "rgba(30,65,65,0.55)",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            Vote for the ones that deserve more love.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
