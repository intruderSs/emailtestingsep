const express = require("express");
const cors = require('cors');

const app = express();
const port = 5000;
const http = require("http");
const https = require("https");

app.use(cors());
app.use(express.json());

const userAgent = 'Shahil Sinha';  ///this is just a random string

function getFinalUrlWithUtm(link) {
  const protocol = link.startsWith("https://") ? https : http;
  const options = {
    headers: {
      'User-Agent': userAgent,
    },
  };
  return new Promise((resolve, reject) => {
    const req = protocol.get(link, options, (res) => {
      if (res.statusCode === 200) {
        const finalUrl = res.headers.location || link;
        resolve(finalUrl);
      } else if (res.statusCode === 500) {
        console.log(`Internal Server Error (500) for URL: ${link}`);
        const finalUrl = res.headers.location || link;
        resolve(finalUrl);
      }
      else if (res.headers.location) {
        // Handle redirects
        resolve(getFinalUrlWithUtm(res.headers.location));
      } else {
        console.log(`Failed to retrieve the URL. Status code: ${res.statusCode}`);
        const finalUrl = res.headers.location || link;
        resolve(finalUrl);
      }
    });
    req.on("error", (error) => {
      console.log(`Request error: ${error.message}`);
      console.log(link);
      resolve(link);
    });
    req.end();
  });
}

app.post("/test", (req, res) => {

  const links = req.body.links;

  const finalUrls = [];

  const promises = links.map((link) => {
    return getFinalUrlWithUtm(link)
      .then((finalUrl) => {
        if (finalUrl) {
          finalUrls.push(finalUrl);
        } else {
          console.log(`Failed to retrieve URL for: ${link}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  Promise.all(promises)
    .then(() => {
      // Send the finalUrls array as the response
      res.status(200).send(finalUrls);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Error: " + error);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});