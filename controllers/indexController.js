const getIndex = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to SecondSeller API root.",
  });
};

module.exports = {
  getIndex,
};
