const axios = require("axios");

module.exports.get = async (url, body, header) => {
  const data = await axios.get(url, { ...body }, { ...header });
  return data.data;
};
