const parse_dev_server = {
  appId: "#",
  url: "https://cryptic-waters-41617.herokuapp.com/parse/"
};

//Beta Staging Server
const parse_staging_server = {
  appId: "#",
  url: "https://cryptic-waters-41617.herokuapp.com/parse/"
};

//Beta Production Server
const parse_prod_server = {
  appId: "#",
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
