// fetch-messages.js

const axios = require("axios");

const data = JSON.stringify({
  collection: "messages",
  database: "MacDb",
  dataSource: "bel-chat",
  projection: {
    _id: 1,
  },
});

const config = {
  method: "post",
  url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-tfaat/endpoint/data/v1/action/findOne",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key":
      "f0LNAMtvH5T4f8QzllIWroB2r9J2Ekv7LPk1jM4WjjZdwOSqT44A1M0hIJfJMQPT",
    Accept: "application/ejson",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
