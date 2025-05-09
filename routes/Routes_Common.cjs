const express = require("express");
const router = express.Router();
const Commnon = require("../WorkService/Model_Common.cjs");

router.post("/GetMenu", Commnon.GetMenu);
router.post("/GetFactory", Commnon.GetFactory);
router.post("/Login", Commnon.Login);
router.post("/Login2", Commnon.Login2);
router.post("/GetDataUser", Commnon.GetDataUser);
router.post("/UploadFile", Commnon.UploadFile);
router.post("/UploadSub", Commnon.UploadSub);
router.post("/UploadAdd", Commnon.UploadAdd);
router.post("/GetFileServer", Commnon.GetFileServer);
router.post("/EmailSend", Commnon.EmailSend);
router.post("/GetFile", Commnon.GetFile);
router.post("/GetFileDetail", Commnon.GetFileDetail);
router.post("/UploadFileDetail", Commnon.UploadFileDetail);
router.post("/GetEmailUser", Commnon.GetEmailUser);
router.post("/GetEmailHrStaff", Commnon.GetEmailHrStaff);

module.exports = router;
