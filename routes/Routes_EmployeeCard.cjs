const express = require("express");
const router = express.Router();
const employeeCard = require("../WorkService/Model_EmployeeCard.cjs");


router.get("/GetSearchRequestEmployeeCard", employeeCard.GetSearchRequest);
router.get("/GetPersonForApprovalEmployeeCard", employeeCard.GetPersonForApproval);
router.get("/GetDescStaffActionEmployeeCard", employeeCard.GetDescStaffAction);
module.exports = router;