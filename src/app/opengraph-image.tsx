import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Neatoolkit - Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontData = await readFile(
    join(process.cwd(), "public/fonts/newsreader-700.ttf"),
  );

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
          backgroundColor: "#FAF8F5",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontFamily: "Newsreader",
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            Neatoolkit
          </div>
          <div
            style={{
              width: 180,
              height: 4,
              backgroundColor: "#CA8A04",
              borderRadius: 2,
              marginTop: 12,
            }}
          />
          <div
            style={{
              fontSize: 28,
              color: "#434343",
              marginTop: 20,
              letterSpacing: "0.01em",
            }}
          >
            Free Online Tools
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
