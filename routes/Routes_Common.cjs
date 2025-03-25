const express = require("express");
const router = express.Router();
const Commnon = require("../WorkService/Model_Common.cjs");

router.post("/GetMenu", Commnon.GetMenu);
router.post("/GetFactory", Commnon.GetFactory);
router.post("/Login", Commnon.Login);
router.post("/GetDataUser", Commnon.GetDataUser);


module.exports = router;
