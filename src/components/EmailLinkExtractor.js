// import React, { useState, useEffect } from "react";

// function EmailLinkExtractor() {
//   const [links, setLinks] = useState([]);
//   const [filteredLinks, setFilteredLinks] = useState([]);
//   const [htmlContent, setHtmlContent] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const emailContent = e.target.result;
//         if (file.name.endsWith('.eml')) {
//           // Send .eml content to the backend for parsing
//           try {
//             const response = await fetch('http://localhost:3001/parse-eml', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ emlContent: emailContent }),
//             });
//             if (response.ok) {
//               const { htmlContent } = await response.json();
//               parseHtmlContent(htmlContent);
//             } else {
//               console.error('Failed to parse .eml file:', response.statusText);
//             }
//           } catch (error) {
//             console.error('Error parsing .eml file:', error);
//           }
//         } else if (file.name.endsWith('.htm')) {
//           // Directly parse .htm content
//           parseHtmlContent(emailContent);
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   const parseHtmlContent = (htmlContent) => {
//     setHtmlContent(htmlContent);

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlContent, "text/html");

//     // Extract and decode links from anchor tags
//     const anchorTags = doc.querySelectorAll("a");
//     const extractedLinks = Array.from(anchorTags).map((anchor) =>
//       decodeURIComponent(anchor.href)
//     );
//     setLinks(extractedLinks);

//     const linksWithTitle = Array.from(anchorTags).map((anchor) => ({
//       title: decodeURIComponent(anchor.title),
//       link: decodeURIComponent(anchor.href),
//     }));
//     console.log(linksWithTitle);
//     let filteredWithTitle = [];
//     let neglected = [];
//     linksWithTitle.forEach((element) => {
//       if (
//         !element.link.includes("view.explore") &&
//         !element.link.includes("profile_center") &&
//         !element.link.includes("subscription_center") &&
//         !element.link.includes("unsub_center") &&
//         !element.link.includes("aka.ms") &&
//         !element.link.includes("mailto")
//       ) {
//         filteredWithTitle.push(element);
//       } else {
//         neglected.push(element);
//       }
//     });
//     console.log("Filtered Links:", filteredWithTitle);
//     console.log("Neglected Links:", neglected);
//   };

//   useEffect(() => {
//     let filtered = [];
//     links.forEach((element) => {
//       if (
//         !element.includes("view.explore") &&
//         !element.includes("profile_center") &&
//         !element.includes("subscription_center") &&
//         !element.includes("unsub_center") &&
//         !element.includes("aka.ms") &&
//         !element.includes("mailto")
//       ) {
//         filtered.push(element);
//       }
//     });
//     setFilteredLinks(filtered);
//   }, [links]);

//   const handleValidate = async (e) => {
//     e.preventDefault();
//     const response = await fetch(
//       `https://6o4jy472i0.execute-api.ap-south-1.amazonaws.com/dev/links/getUtmAppendedLinks`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({ links: filteredLinks }),
//       }
//     );
//     if (response.ok) {
//       const jsonData = await response.json();
//       console.log("Validation Response:", jsonData);
//       const validatedLinks = jsonData.filter(link => link.includes("utm_") && !link.includes("CPC") && !link.includes("whatsapp") && !link.includes("snapchat"));
//       console.log("Validated Links:", validatedLinks);
//     } else {
//       console.error("Request failed with status: " + response.status);
//     }
//   };

//   return (
//     <>
//       <div>
//         <input type="file" accept=".eml,.htm" onChange={handleFileChange} />
//         <div>
//           <h2>Extracted Links:</h2>
//           <ul>
//             {links.map((link, index) => (
//               <li key={index}>{link}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="text-center p-3">
//           <button
//             className="mx-3 btn"
//             onClick={handleValidate}
//             style={{ background: "#1798c1", color: "#fff" }}
//           >
//             Validate
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default EmailLinkExtractor;

import React, { useState, useEffect } from "react";

function EmailLinkExtractor() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        let fileType = '';
        
        if (file.name.endsWith('.eml')) {
          fileType = 'eml';
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          fileType = 'html';
        }

        if (fileType) {
          try {
            const response = await fetch('https://83051t06p5.execute-api.ap-south-1.amazonaws.com/dev/links/ExtractLinks', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ fileContent, fileType }),
            });

            if (response.ok) {
              // const { htmlContent } = await response.json();
              // parseHtmlContent(htmlContent);
              console.log(response.json());
            } else {
              console.error(`Failed to parse ${fileType} file:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error parsing ${fileType} file:`, error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const parseHtmlContent = (htmlContent) => {
    setHtmlContent(htmlContent);

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const anchorTags = doc.querySelectorAll("a");
    const extractedLinks = Array.from(anchorTags).map((anchor) =>
      decodeURIComponent(anchor.href)
    );
    setLinks(extractedLinks);

    const linksWithTitle = Array.from(anchorTags).map((anchor) => ({
      title: decodeURIComponent(anchor.title),
      link: decodeURIComponent(anchor.href),
    }));

    let filteredWithTitle = [];
    let neglected = [];
    linksWithTitle.forEach((element) => {
      if (
        !element.link.includes("view.explore") &&
        !element.link.includes("profile_center") &&
        !element.link.includes("subscription_center") &&
        !element.link.includes("unsub_center") &&
        !element.link.includes("aka.ms") &&
        !element.link.includes("mailto")
      ) {
        filteredWithTitle.push(element);
      } else {
        neglected.push(element);
      }
    });

    console.log("Filtered Links:", filteredWithTitle);
    console.log("Neglected Links:", neglected);
  };

  useEffect(() => {
    let filtered = [];
    links.forEach((element) => {
      if (
        !element.includes("view.explore") &&
        !element.includes("profile_center") &&
        !element.includes("subscription_center") &&
        !element.includes("unsub_center") &&
        !element.includes("aka.ms") &&
        !element.includes("mailto")
      ) {
        filtered.push(element);
      }
    });
    setFilteredLinks(filtered);
  }, [links]);

  const handleValidate = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://6o4jy472i0.execute-api.ap-south-1.amazonaws.com/dev/links/getUtmAppendedLinks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ links: filteredLinks }),
      }
    );

    if (response.ok) {
      const jsonData = await response.json();
      console.log("Validation Response:", jsonData);
      const validatedLinks = jsonData.filter(link => link.includes("utm_") && !link.includes("CPC") && !link.includes("whatsapp") && !link.includes("snapchat"));
      console.log("Validated Links:", validatedLinks);
    } else {
      console.error("Request failed with status: " + response.status);
    }
  };

  return (
    <>
      <div>
        <input type="file" accept=".eml,.htm,.html" onChange={handleFileChange} />
        <div>
          <h2>Extracted Links:</h2>
          <ul>
            {links.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
        <div className="text-center p-3">
          <button
            className="mx-3 btn"
            onClick={handleValidate}
            style={{ background: "#1798c1", color: "#fff" }}
          >
            Validate
          </button>
        </div>
      </div>
    </>
  );
}

export default EmailLinkExtractor;
