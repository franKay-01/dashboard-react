const parse_dev_server = {
  appId: "d55f9778-9269-40c2-84a2-e0caaf2ad87a",
  url: "https://cryptic-waters-41617.herokuapp.com/parse/"
};

//Beta Staging Server
const parse_staging_server = {
  appId: "d55f9778-9269-40c2-84a2-e0caaf2ad87a",
  url: "https://cryptic-waters-41617.herokuapp.com/parse/"
};

//Beta Production Server
const parse_prod_server = {
  appId: "d55f9778-9269-40c2-84a2-e0caaf2ad87a",
  url: "https://cryptic-waters-41617.herokuapp.com/parse/"
};

let parseSettings;
if (process.env.NODE_ENV === "development") {
  parseSettings = parse_dev_server;
} else if (process.env.NODE_ENV === "production") {
  parseSettings = parse_prod_server;
} else {
  parseSettings = parse_staging_server;
}

export { parseSettings };
