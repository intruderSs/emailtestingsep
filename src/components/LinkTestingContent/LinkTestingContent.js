import React, { useState, useEffect } from "react";
import shapeImage from "../../images/shape.png";
import panda from "../../images/linkpage.png";
import * as XLSX from "xlsx";

function LinkTestingContent(props) {
  const [excelSheet, setExcelSheet] = useState("");
  const [emailFile, setEmailFile] = useState("");
  const [Links, setLinks] = useState([]);

  const [filteredLinks, setFilteredLinks] = useState([]);

  const [linksWithTitle, setLinksWithTitle] = useState([]);

  useEffect(() => {
    let filtered = [];
    Links.forEach((element) => {
      if (
        !element.includes("view.explore") &&
        !element.includes("aka.ms") &&
        !element.includes("mailto")
      ) {
        // if (!filtered.includes(element)) {
        filtered.push(element);
        //}
      }
    });
    setFilteredLinks(filtered);
  }, [Links]);

  ///This function is getting excel file as input and converting everything in it into key value pairs
  const handleExcelFile = (e) => {
    const file = e;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // assuming you want the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Convert array of arrays to key-value pairs
      const keyValuePairs = jsonData.slice(1).reduce((acc, row) => {
        // Assuming the first cell in each row is the key and the second cell is the value
        if (row.length >= 2) {
          acc[row[0]] = row[1];
        }
        return acc;
      }, {});
      setExcelSheet(keyValuePairs);
    };

    reader.readAsBinaryString(file);
  };

  const handleEmailFile = (files) => {
    const file = files;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const emailContent = e.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(emailContent, "text/html");

        // Extract and decode links from anchor tags
        const anchorTags = doc.querySelectorAll("a");

        const extractedLinks = Array.from(anchorTags)
          .map((anchor) => decodeURIComponent(anchor.href))
          .filter((link) => link.trim() !== "");
        console.log("Extracted Liniks", extractedLinks);
        setLinks(extractedLinks);

        const linksWithTitle = Array.from(anchorTags).map((anchor) => ({
          title: decodeURIComponent(anchor.title),
          link: decodeURIComponent(anchor.href),
        })).filter((link) => link.link.trim() !== "");
        console.log(linksWithTitle);
        let filteredWithTitle = [];
        let neglected = [];
        linksWithTitle.forEach((element) => {
          if (
            !element.link.includes("view.explore") &&
            !element.link.includes("aka.ms") &&
            !element.link.includes("mailto")
          ) {
            // if (!filtered.includes(element)) {
            filteredWithTitle.push(element);
            //}
          } else {
            neglected.push(element);
          }
        });
         console.log(">>>>", filteredWithTitle);
         setLinksWithTitle(filteredWithTitle);
         console.log(">>>>----", neglected);
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async (e) => {
    const linkss = [
      { name: 'link1', link: 'https://example.com/page1' },
      { name: 'link2', link: 'https://example.com/page2' },
      // Add more key-value pairs as needed
    ];
   const linksToSend = linkss.map(({ link }) => link);
    e.preventDefault();
    const response = await fetch(
      `https://6o4jy472i0.execute-api.ap-south-1.amazonaws.com/dev/links/getUtmAppendedLinks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ links: linksToSend }),
      }
    );
    if (response.ok) {
      const jsonData = await response.json(); // Parse JSON response from the server
      console.log("j>>>>", jsonData); // Log the JSON data received from the server
      const mergedLinks = linkss.map((item, index) => ({
        ...item,
        utmAppendedLink: jsonData[index]
      }));
      console.log('Merged Links', mergedLinks);
    } else {
      console.error("Request failed with status: " + response.status);
    }
  };

  const handleSubmit = () => {};

  return (
    <div>
      <img src={shapeImage} alt="" className="shape" />
      <div>
        <div className="containers" id="login-container">
          <div className="forms-container">
            <div className="signin-signup">
              <div action="" className="sign-in-form">
                <h2 className="title">
                  <span>Test Link Redirects...</span>
                </h2>
                <div className="input-field emailSelector">
                  <i className="fas fa-envelope"></i>
                  {emailFile && (
                    <label htmlFor="file-input">
                      {emailFile.toString().slice(16, 40)}
                    </label>
                  )}
                  {!emailFile && (
                    <label htmlFor="file-input">
                      Click here to upload the email file
                    </label>
                  )}
                  <input
                    value={emailFile}
                    onChange={(e) => {
                      setEmailFile(e.target.value);
                      handleEmailFile(e.target.files[0]);
                    }}
                    id="file-input"
                    className="emailFileSelector"
                    accept={".eml" || ".htm"}
                    name="email file"
                    type="file"
                    placeholder="Click here to upload the email file"
                  ></input>
                </div>
                {/*This input field accepts the excel sheet*/}
                <div className="input-field emailSelector">
                  <i className="fa-solid fa-table"></i>
                  {excelSheet && (
                    <label htmlFor="file-input excel">
                      {excelSheet.toString().slice(12, 40)}
                    </label>
                  )}
                  {!excelSheet && (
                    <label htmlFor="file-input excel">
                      Click here to upload the excel sheet
                    </label>
                  )}
                  <input
                    onChange={(e) => {
                      handleExcelFile(e.target.files[0]);
                    }}
                    id="file-input excel"
                    className="emailFileSelector"
                    accept=".xlsx"
                    name="excel sheet"
                    type="file"
                    placeholder="Click here to upload the sheet"
                  ></input>
                </div>
                <button
                  disabled={excelSheet === "" && emailFile === ""}
                  className="submitBtn"
                  onClick={handleValidate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <img src={panda} className="image_link" alt=""></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkTestingContent;
