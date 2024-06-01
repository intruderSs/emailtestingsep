import React, { useState, useEffect } from "react";
import AppContext from "./ContextFile";

const StateFile = (props) => {
  const [results, setResults] = useState([]);

  const [utmAcceptanceObj, setUtmAcceptanceObj] = useState([]);

  const [links, setLinks] = useState([]);

  const [filteredLinks, setFilteredLinks] = useState([]);

  const [utmAppendedLinks, setUtmAppendedLinks] = useState([]);

  const [loadings, setLoading] = useState(false);

  const [gotResult, setGotResult] = useState(false);

  //parsing utm parameters and creating an object of utm parameters
  const parseUTMParameters = (utmString) => {
    setLoading(true);
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
    getUTMAppendedLinks(utmObject);
    return utmObject;
  };

  ////////////////extracting links from the email file

  //////////doing the api call to get the utm appended links
  const getUTMAppendedLinks = async (utmObject) => {
    let ut = utmObject;
    console.log("API call initiated");
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
      const jsonData = await response.json(); // Parse JSON response from the server
      const shahil = [];
      jsonData.forEach((link) => {
        if (link.includes("utm_")) {
          if (
            !link.includes("CPC") &&
            !link.includes("whatsapp") &&
            !link.includes("snapchat")
          ) {
            shahil.push(link);
            return true;
          }
        }
        return false;
      });
      setUtmAppendedLinks(shahil);
      console.log("UTM appended links", shahil); // Log the JSON data received from the serve
      validateAll(shahil, ut);
    } else {
      console.error("Request failed with status: " + response.status);
    }
  };

  useEffect(() => {
    if (links.length > 0) {
      console.log("Started filtering out the links");
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
          //if (!filtered.includes(element)) {
            filtered.push(element);
         // }
        }
      });
      setFilteredLinks(filtered);
    }
  }, [links]);

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

  const validateAll = (finalLinks, utmObject) => {
    let ac = utmObject;
    const allResults = [];
    console.log("validation started fo all");
    finalLinks.forEach((link) => {
      const isValid = validateEachUtmParameters(decodeURIComponent(link), ac);
      const url = new URL(decodeURIComponent(link));
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
        parseUTMParameters,
        setUtmAcceptanceObj,
        getUTMAppendedLinks,
        utmAppendedLinks,
        results,
        loadings,
        setGotResult,
        gotResult,
        setLinks,
        setResults,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default StateFile;
