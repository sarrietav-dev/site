import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "linear-gradient(135deg, #eee5cd 0%, #e4d9be 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          color: "#473e2e",
          position: "relative",
        },
        children: [
          // Decorative corner elements
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "48px",
                left: "48px",
                width: "80px",
                height: "80px",
                border: "4px solid #a06441",
                borderRadius: "50%",
                opacity: 0.2,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "48px",
                right: "48px",
                width: "60px",
                height: "60px",
                border: "3px solid #a06441",
                borderRadius: "12px",
                transform: "rotate(45deg)",
                opacity: 0.15,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "48px",
                left: "48px",
                width: "40px",
                height: "40px",
                border: "2px solid #a06441",
                borderRadius: "8px",
                opacity: 0.25,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "48px",
                right: "48px",
                width: "56px",
                height: "56px",
                border: "3px solid #a06441",
                borderRadius: "50%",
                opacity: 0.2,
              },
            },
          },
          // Main content card
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #473e2e",
                background: "linear-gradient(135deg, #fffbe9 0%, #f8f3e3 100%)",
                borderRadius: "32px",
                boxShadow: "0 12px 40px rgba(71, 62, 46, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 96px",
                width: "1000px",
                maxWidth: "88%",
                position: "relative",
              },
              children: [
                // Decorative top flourish
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      top: "32px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "40px",
                            height: "3px",
                            background: "linear-gradient(90deg, transparent 0%, #a06441 100%)",
                            borderRadius: "2px",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "12px",
                            height: "12px",
                            border: "2px solid #a06441",
                            borderRadius: "50%",
                            background: "#fffbe9",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "40px",
                            height: "3px",
                            background: "linear-gradient(90deg, #a06441 0%, transparent 100%)",
                            borderRadius: "2px",
                          },
                        },
                      },
                    ],
                  },
                },
                // Main content
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      marginBottom: "56px",
                    },
                    children: [
                      {
                        type: "h1",
                        props: {
                          style: {
                            fontSize: 80,
                            fontWeight: "700",
                            margin: 0,
                            marginBottom: "24px",
                            color: "#473e2e",
                            letterSpacing: "-0.02em",
                            lineHeight: 0.9,
                          },
                          children: SITE.title,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 36,
                            margin: 0,
                            color: "#a06441",
                            fontWeight: "500",
                            lineHeight: 1.3,
                            maxWidth: "800px",
                            letterSpacing: "-0.01em",
                          },
                          children: SITE.desc,
                        },
                      },
                    ],
                  },
                },
                // Website URL section
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingTop: "32px",
                      borderTop: "3px solid #e4d9be",
                      width: "100%",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 24,
                            color: "#a06441",
                            fontWeight: "500",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                          },
                          children: "Visit",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 40,
                            color: "#473e2e",
                            fontWeight: "700",
                            letterSpacing: "-0.01em",
                          },
                          children: new URL(SITE.website).hostname,
                        },
                      },
                    ],
                  },
                },
                // Decorative bottom flourish
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      bottom: "32px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "24px",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent 0%, #a06441 100%)",
                            borderRadius: "1px",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "8px",
                            height: "8px",
                            border: "2px solid #a06441",
                            borderRadius: "50%",
                            background: "#fffbe9",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "16px",
                            height: "2px",
                            background: "#a06441",
                            borderRadius: "1px",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "8px",
                            height: "8px",
                            border: "2px solid #a06441",
                            borderRadius: "50%",
                            background: "#fffbe9",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "24px",
                            height: "2px",
                            background: "linear-gradient(90deg, #a06441 0%, transparent 100%)",
                            borderRadius: "1px",
                          },
                        },
                      },
                    ],
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
      fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.website + "Visit"),
    }
  );
};
