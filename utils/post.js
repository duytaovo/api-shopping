const { Axios } = require("axios");
const axios = new Axios({ baseURL: "http://localhost:8080/api/v1/" });

module.exports.post = async (url, body, header) => {
  const data = await axios.post(url, { ...body }, { ...header });
  return data;
};
