const express = require("express");
const router = express.Router();
const Letter = require("../WorkService/Model_Letter.cjs");

router.post("/GetDataPersonByIDCode", Letter.GetDataPersonByIDCode);
router.post("/GenReqNo", Letter.GenReqNo);
router.post("/GetSupervisorUp", Letter.GetSupervisorUp);
router.post("/InsSendSubmit", Letter.InsSendSubmit);
router.post("/InsSendSubmit2", Letter.InsSendSubmit2);
router.post("/GetDataHeaderLetter", Letter.GetDataHeaderLetter);
router.post("/GetLetterType", Letter.GetLetterType);
router.post("/UpdateSvApprove", Letter.UpdateSvApprove);
router.post("/GetConditionClose", Letter.GetConditionClose);
router.post("/UpdateHrStaff", Letter.UpdateHrStaff);

module.exports = router;
