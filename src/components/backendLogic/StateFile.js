import React, { useState, useEffect } from "react";
import AppContext from "./ContextFile";

const StateFile = (props) => {
  const [results, setResults] = useState([]);

  const [utmAcceptanceObj, setUtmAcceptanceObj] = useState([]);

  const [links, setLinks] = useState([]);

  const [utmAppendedLinks, setUtmAppendedLinks] = useState([]);

  const [loadings, setLoading] = useState(false);

  const [gotResult, setGotResult] = useState(false);

    /////api call to get all of the valid links from the email
    const getAllValidLinks = async (acceptanceCriteria, content, type) => {
      setLoading(true);
      console.log('Link Extraction Started');
      const response = await fetch(
        `https://83051t06p5.execute-api.ap-south-1.amazonaws.com/dev/links/ExtractLinks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileContent: content, fileType: type }),
        }
      );
      if (response.ok) {
        const jsonData = await response.json(); // Parse JSON response from the server
        let filtered = [];
        jsonData.forEach((element) => {
            if (
              !element.link.includes("view.explore") &&
              !element.link.includes("profile_center") &&
              !element.link.includes("subscription_center") &&
              !element.link.includes("unsub_center") &&
              !element.link.includes("aka.ms") &&
              !element.link.includes("mailto")
            ) {
              if (!filtered.includes(element.link)) {
                filtered.push(element.link);
            }
            }
        });
        if (filtered) {
          console.log(filtered);
          parseUTMParameters(acceptanceCriteria, filtered);
        }
      } else {
        console.error("Request failed with status: " + response.status);
      }
    };

  //parsing utm parameters and creating an object of utm parameters
  const parseUTMParameters = (utmString, filteredLinks) => {
    console.log("UTM parsing started");
    const utmObject = {};
    const searchParams = new URLSearchParams(utmString);

    searchParams.forEach((value, key) => {
      if (key !== "utm_term") {
        utmObject[key] = value;
      }
    });

    for (const key in utmObject) {
      if (utmObject.hasOwnProperty(key) && typeof utmObject[key] === "string") {
        utmObject[key] = utmObject[key].replace(/%/g, "");
        utmObject[key] = utmObject[key].replace(/_/g, "_");
        utmObject[key] = utmObject[key].replace(/\u200B/g, "");
      }
    }
    setUtmAcceptanceObj(utmObject);
    getUTMAppendedLinks(utmObject, filteredLinks);
    return utmObject;
  };

  //////////doing the api call to get the utm appended links
  const getUTMAppendedLinks = async (utmObject, filteredLinks) => {
    let ut = utmObject;
    console.log('Validating links with UTM Parameters');
    console.log('Filtered Links', filteredLinks);
    const response = await fetch(
      `https://6o4jy472i0.execute-api.ap-south-1.amazonaws.com/dev/links/getUtmAppendedLinks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ links: filteredLinks }),
      }
    );
    if (response.ok) {
      const jsonData = await response.json(); // Parse JSON response from the server
      console.log('JSON Data', jsonData);
      const validatedLinks = jsonData.filter(link => link.includes("utm_") && !link.includes('tiktok') && !link.includes('whatsapp') && !link.includes('snapchat'));
      console.log("Validated Links:", validatedLinks);
      /////removing extra stuffs from link instead of decoding the link
      const cleanedUrls = validatedLinks.map(url => {
        const hasMultipleSpaces = /(%20){2,}/.test(url); // Check for multiple %20 sequences
        const hasZeroWidthSpace = /%e2%80%8b/.test(url); // Check for %E2%80%8B
      
        if (hasMultipleSpaces || hasZeroWidthSpace) {
          return url.replace(/(%20)+|(%e2%80%8b)/g, ''); // Remove the sequences if found
        }
        return url; // Return the original URL if no changes are needed
      });
      setUtmAppendedLinks(cleanedUrls);
      console.log("UTM appended links", cleanedUrls); // Log the JSON data received from the serve
      validateAll(cleanedUrls, ut);
    } else {
      console.error("Request failed with status: " + response.status);
    }
  };

  //////logic to cross check each and every link with utm parameters
  function validateEachUtmParameters(link, acc) {
    // console.log(link.replace(/\?.*?utm/g,'?utm'));
    const url = new URL(link.replace(/\?.*?utm/g, "?utm"));
    //console.log(url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    // console.log(searchParams);
    const errors = [];
    const errorMain = [];
    // console.log(searchParams);

    for (const param in acc) {
      if (searchParams[param] !== acc[param]) {
        //  console.log(searchParams[param]);
        errors.push({
          emailName: searchParams.utm_term,
          expected: acc[param],
          actual: searchParams[param],
          param: param,
          resValue: false,
        });
      } else {
        //  console.log(searchParams[param]);
        errors.push({
          emailName: searchParams.utm_term,
          expected: acc[param],
          actual: searchParams[param],
          param: param,
          resValue: true,
        });
      }
    }

    if (errors.every((error) => error.resValue === true)) {
      //  console.log('true called');
      errorMain.push({ emailName: `${searchParams.utm_term}`, resValue: true });
    } else {
      //  console.log('false called');
      errorMain.push({
        emailName: `${searchParams.utm_term}`,
        resValue: false,
      });
    }

    return { errorMain, errors };
  }

  function getQueryParameters(url) {
    const queryString = url.split('?')[1] || '';
    const pairs = queryString.split('&');
    const params = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
            try {
                params[key] = decodeURIComponent(value);
            } catch (e) {
                params[key] = value; // Keep it as is if decoding fails
            }
        }
    });
    return params;
}

  const validateAll = (finalLinks, utmObject) => {
    let ac = utmObject;
    const allResults = [];
    console.log("validation started fo all");
    finalLinks.forEach((link) => {
      const isValid = validateEachUtmParameters(link, ac);
      const url = new URL(link);
      const searchParams = Object.fromEntries(url.searchParams.entries());
      allResults.push({ name: searchParams.utm_term, res: isValid });
      //console.log(isValid);
    });

    // After processing all links, set the results array
    setResults((prevRes) => [...prevRes, ...allResults]);
    // props.setLoading(false);
    setLoading(false);
    setGotResult(true);
  };

  return (
    <AppContext.Provider
      value={{
        utmAcceptanceObj,
        setUtmAcceptanceObj,
        utmAppendedLinks,
        results,
        loadings,
        setGotResult,
        gotResult,
        setLinks,
        setResults,
        getAllValidLinks
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default StateFile;
