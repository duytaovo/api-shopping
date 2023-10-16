module.exports.responseSuccess = (res, data) => {
  return res.status(200).send(data);
};
