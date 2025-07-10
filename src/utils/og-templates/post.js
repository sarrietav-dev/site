import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async post => {
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
                top: "32px",
                left: "32px",
                width: "64px",
                height: "64px",
                border: "3px solid #a06441",
                borderRadius: "50%",
                opacity: 0.3,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "32px",
                right: "32px",
                width: "48px",
                height: "48px",
                border: "2px solid #a06441",
                borderRadius: "8px",
                transform: "rotate(45deg)",
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
                borderRadius: "24px",
                boxShadow: "0 8px 32px rgba(71, 62, 46, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "56px 72px",
                width: "960px",
                maxWidth: "90%",
                position: "relative",
              },
              children: [
                // Decorative top border
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      top: "24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "120px",
                      height: "4px",
                      background: "linear-gradient(90deg, transparent 0%, #a06441 50%, transparent 100%)",
                      borderRadius: "2px",
                    },
                  },
                },
                // Title section
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      marginBottom: "48px",
                      width: "100%",
                    },
                    children: [
                      {
                        type: "h1",
                        props: {
                          style: {
                            fontSize:
                              post.data.title.length > 60
                                ? 44
                                : post.data.title.length > 40
                                ? 56
                                : post.data.title.length > 30
                                ? 64
                                : 72,
                            fontWeight: "700",
                            margin: 0,
                            lineHeight: 1.1,
                            color: "#473e2e",
                            letterSpacing: "-0.02em",
                            maxWidth: "820px",
                            wordBreak: "break-word",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxHeight: "3.6em", // 3 lines * lineHeight
                          },
                          children: post.data.title,
                        },
                      },
                    ],
                  },
                },
                // Bottom section with author and site
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      paddingTop: "24px",
                      borderTop: "2px solid #e4d9be",
                      position: "relative",
                    },
                    children: [
                      // Author section
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 24,
                                  color: "#a06441",
                                  fontWeight: "500",
                                  marginBottom: "4px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.1em",
                                },
                                children: "Written by",
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 32,
                                  color: "#473e2e",
                                  fontWeight: "700",
                                },
                                children: post.data.author,
                              },
                            },
                          ],
                        },
                      },
                      // Site branding
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            textAlign: "right",
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 36,
                                  color: "#473e2e",
                                  fontWeight: "700",
                                  letterSpacing: "-0.01em",
                                },
                                children: SITE.title,
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 20,
                                  color: "#a06441",
                                  fontWeight: "500",
                                  marginTop: "4px",
                                },
                                children: new URL(SITE.website).hostname,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                // Decorative bottom border
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      bottom: "24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      height: "3px",
                      background: "linear-gradient(90deg, transparent 0%, #a06441 50%, transparent 100%)",
                      borderRadius: "2px",
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
      fonts: await loadGoogleFonts(
        post.data.title + post.data.author + SITE.title + "Written by"
      ),
    }
  );
};
