const db = require("../../models/db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const express = require("express");
const router = express.Router();

router.get("/list_inactive_spaces/:daysInterval", function (req, res, next) {
  // daysInterval: number of days the space has existed
  const daysInterval = req.params.daysInterval;
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - daysInterval);
  db.Space.findAll({
    where: { updatedAt: { [Op.lt]: currentDate }, space_type: "space" },
  }).then((spaces) => {
    res.status(200).json(spaces.map((space) => space._id));
  });
});

module.exports = router;
