import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "#eee5cd",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'IBM Plex Mono', serif",
          color: "#473e2e",
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #473e2e",
                background: "#fffbe9",
                borderRadius: "16px",
                boxShadow: "0 4px 24px #a0644122",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px 64px 48px 64px",
                width: "900px",
                maxWidth: "92%",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 32,
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 64,
                            fontWeight: "bold",
                            margin: 0,
                            color: "#473e2e",
                          },
                          children: SITE.title,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 32,
                            margin: 0,
                            color: "#473e2e",
                          },
                          children: SITE.desc,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      marginTop: 24,
                      fontSize: 32,
                    },
                    children: {
                      type: "span",
                      props: {
                        style: { color: "#a06441", fontWeight: "bold" },
                        children: new URL(SITE.website).hostname,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.website),
    }
  );
};
