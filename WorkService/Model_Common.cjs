const {
  ConnectPG_DB,
  DisconnectPG_DB,
  ConnectOracleDB,
  DisconnectOracleDB,
} = require("../Conncetion/DBConn.cjs");
const oracledb = require("oracledb");
const { writeLogError } = require("../Common/LogFuction.cjs");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

module.exports.GetMenu = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    query += `
         SELECT
              MENU_NAME,
              MENU_CODE,
              MENU_ID,
              MENU_PARENT_ID,
              MENU_SORT
          FROM
              CU_MENU_M
          WHERE
              SYSTEM_ID = '73'
          ORDER BY
              CASE WHEN MENU_NAME = 'Home' THEN 0 ELSE 1 END,
              MENU_ID,
              MENU_SORT`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      MENU_NAME: row[0],
      MENU_CODE: row[1],
      MENU_ID: row[2],
      MENU_PARENT_ID: row[3],
      MENU_SORT: row[4],
    }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetFactory = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    query += `select t.factory_code,t.factory_name from cusr.cu_factory_m t where t.factory_status = 'A' order by t.factory_code`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      value: row[0],
      label: row[1],
    }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.Login = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    const { loginID, Password } = req.body;
    query += `
              SELECT M.USER_EMP_ID AS EMP,
              M.USER_LOGIN AS LOGIN,
              M.USER_PASSWORD  AS PASSWORD,
              M.USER_EMAIL  AS EMAIL,
              M.USER_FACTORY AS FAC_CODE,
              M.USER_COSTCENTER AS COSTCENTER
              FROM  cu_user_m M
              INNER JOIN CU_USER_HUMANTRIX H ON USER_EMP_ID =  EMPCODE
              WHERE UPPER(M.USER_LOGIN)  =UPPER('${loginID}') 
              AND UPPER(M.USER_PASSWORD) =UPPER('${Password}')`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      EMP: row[0],
      LOGIN: row[1],
      PASSWORD: row[2],
      EMAIL: row[3],
      FAC_CODE: row[4],
      COSTCENTER: row[5],
    }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDataUser = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    const { loginID } = req.body;
    query += `
              SELECT M.USER_EMP_ID AS EMP,
              M.USER_LOGIN AS LOGIN,
              M.USER_PASSWORD  AS PASSWORD,
              M.USER_EMAIL  AS EMAIL,
              M.USER_FACTORY AS FAC_CODE,
              M.USER_COSTCENTER AS COSTCENTER
              FROM  cu_user_m M
              INNER JOIN CU_USER_HUMANTRIX H ON USER_EMP_ID =  EMPCODE
              WHERE UPPER(M.USER_LOGIN)  =UPPER('${loginID}')`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      EMP: row[0],
      LOGIN: row[1],
      PASSWORD: row[2],
      EMAIL: row[3],
      FAC_CODE: row[4],
      COSTCENTER: row[5],
    }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/Project React/Hr-System_UI/src/FileUpload"); //เปลี่ยนPath
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});





// สร้าง middleware สำหรับอัปโหลด
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // จำกัดขนาดไฟล์ 5MB
});

module.exports.UploadFile = async function (req, res) {
  try {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      // สำเร็จ
      res.status(200).json({
        message: "File uploaded successfully!",
        file: req.file,
      });
    });
  } catch (error) {
    writeLogError(error.message, "");
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetFile = async function (req, res) {
  try {
    const { fileName } = req.body; // รับชื่อไฟล์จาก req.body

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    const filePath = path.join(
      "D:/Project React/Hr-System_UI/src/FileUpload",
      fileName
    );

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(404).json({ message: "File not found" });
      }
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res
      .status(500)
      .json({ message: "Error retrieving file", error: error.message });
  }
};

const smtpConfig = {
  host: "10.17.220.200",
  port: 25,
  secure: false,
  auth: {
    user: "SEInventorySystem@th.fujikura.com",
    pass: "",
  },
};
const transporter = nodemailer.createTransport(smtpConfig);

module.exports.EmailSend = async function (req, res) {
  let query;
  const {
    strSubject,
    UserApprove,
    Req_By,
    FixSystem,
    Req_No,
    Fac_Desc,
    Dept,
    Position,
    Target_Date,
    Req_Date,
    Send_Date,
    Remark,
    Req_Status,
  } = req.body;
  try {
    const formattedRemark = Remark.replace(/(.{60})/g, '$1<br>');
    const client = await ConnectPG_DB();
    let strEmailFormat = `
   <!DOCTYPE html>
        <html lang="en">
        
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f9;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
        <!-- Header -->
        <tr>
        <td align="center" bgcolor="#4caf50" style="padding: 20px; color: #ffffff; font-size: 24px; font-weight: bold;">
                                HR Online System Notification
        </td>
        </tr>
        <!-- Content -->
        <tr>
        <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
        <p>Dear Khun ${UserApprove} ,</p>
        <p>
                                  This Request creates as follow ${Req_By}
        </p>
        <!-- Details -->
        <table width="100%" border="0" cellpadding="10" cellspacing="0" style="background-color: #f9f9f9; border: 1px solid #dddddd; margin: 20px 0;">
        <tr>
        <td  style="font-size: 20px; color: #555555; font-weight: bold;width:120px " colspan="2" >
        <p><strong>รายละเอียด :</strong></p>
        </td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;width:120px ">System :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${FixSystem}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">RequestNo.:</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Req_No}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Factory :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Fac_Desc}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Department :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Dept}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Request Position :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Position}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Target Date :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Target_Date}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Request By :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Req_By}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Request Date :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Req_Date}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Send By :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Req_By}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Send Date :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Send_Date}</td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Remark :</td>
        <td style="font-size: 14px; color: #333333; text-align: left; ">
            ${formattedRemark}
        </td>
        </tr>
        <tr>
        <td style="font-size: 14px; color: #555555; text-align: right; font-weight: bold;">Request Status :</td>
        <td style="font-size: 14px; color: #333333; text-align: left;">${Req_Status}</td>
        </tr>
        </table>
        <p>
                                    กรุณาตรวจสอบข้อมูลผ่านระบบของคุณ และดำเนินการต่อให้เรียบร้อย
        </p>
        <!-- Button -->
        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
        <tr>
        <td align="center" bgcolor="#4caf50" style="padding: 12px 25px; border-radius: 5px;">
        <a href="http://10.17.70.216:4004/HrSystem" style="text-decoration: none; color: #ffffff; font-size: 16px; font-weight: bold; display: inline-block;">
                                ตรวจสอบรายการ
        </a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- Footer -->
        <tr>
        <td align="center" bgcolor="#e4e4e7" style="padding: 15px; font-size: 12px; color: #777777;">
                                                    Best Regards,<br/>
                                © 2025 Fujikura Electronics (Thailand) Ltd. All rights reserved.
        </td>
        </tr>
        </table>
        </body>
        </html>`;
    let query2 = `SELECT unnest(string_to_array('Sasithon.T@th.fujikura.com', ',')) AS user_email;`;
    const result = await client.query(query2);
    if (result.rows.length > 0) {
      const emailList = result.rows.map((row) => row.user_email);
      const mailOptions = {
        from: "HROnlineSystem@th.fujikura.com",
        to: emailList,
        subject: strSubject,
        html: strEmailFormat,
      };
      if (await transporter.sendMail(mailOptions)) {
        console.log({ message: "Success", email: emailList });
        res.status(200).json({ message: "Success", email: emailList });
      } else {
        res.status(204).json({ message: "Can not send email" });
      }
    } else {
      res.status(204).json({ message: "Not found" });
    }
    DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};
