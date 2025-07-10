import satori from "satori";
// import { html } from "satori-html";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

// const markup = html`<div
//       style={{
//         background: "#fefbfb",
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: "-1px",
//           right: "-1px",
//           border: "4px solid #000",
//           background: "#ecebeb",
//           opacity: "0.9",
//           borderRadius: "4px",
//           display: "flex",
//           justifyContent: "center",
//           margin: "2.5rem",
//           width: "88%",
//           height: "80%",
//         }}
//       />

//       <div
//         style={{
//           border: "4px solid #000",
//           background: "#fefbfb",
//           borderRadius: "4px",
//           display: "flex",
//           justifyContent: "center",
//           margin: "2rem",
//           width: "88%",
//           height: "80%",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             margin: "20px",
//             width: "90%",
//             height: "90%",
//           }}
//         >
//           <p
//             style={{
//               fontSize: 72,
//               fontWeight: "bold",
//               maxHeight: "84%",
//               overflow: "hidden",
//             }}
//           >
//             {post.data.title}
//           </p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "100%",
//               marginBottom: "8px",
//               fontSize: 28,
//             }}
//           >
//             <span>
//               by{" "}
//               <span
//                 style={{
//                   color: "transparent",
//                 }}
//               >
//                 "
//               </span>
//               <span style={{ overflow: "hidden", fontWeight: "bold" }}>
//                 {post.data.author}
//               </span>
//             </span>

//             <span style={{ overflow: "hidden", fontWeight: "bold" }}>
//               {SITE.title}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>`;

export default async post => {
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
                padding: "48px 64px",
                width: "900px",
                maxWidth: "92%",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: "bold",
                      margin: 0,
                      textAlign: "center",
                      lineHeight: 1.1,
                      color: "#473e2e",
                    },
                    children: post.data.title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginTop: 40,
                      fontSize: 32,
                      color: "#a06441",
                      fontWeight: "bold",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: { color: "#473e2e", fontWeight: "bold" },
                          children: `by ${post.data.author}`,
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: { color: "#a06441", fontWeight: "bold" },
                          children: SITE.title,
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
      fonts: await loadGoogleFonts(
        post.data.title + post.data.author + SITE.title + "by"
      ),
    }
  );
};
