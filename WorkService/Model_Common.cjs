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
    const { Roll} = req.body;
    console
    query += `
         SELECT DISTINCT 
          M.MENU_NAME,
          M.MENU_CODE,
          M.MENU_ID,
          M.MENU_PARENT_ID,
          M.MENU_SORT,
          M.MENU_URL
        FROM
          CU_ROLE_MENU R
        INNER JOIN CU_MENU_M M ON
          M.MENU_ID = R.MENU_ID
        WHERE
          1 = 1
          AND SYSTEM_ID = '73'
          AND ROLE_ID IN (${Roll})
        ORDER BY
          CASE
            WHEN MENU_NAME = 'Home' THEN 0
            ELSE 1
          END,
          MENU_ID,
          MENU_SORT`;
              console.log(query)
    const result = await Conn.execute(query);
    
    const jsonData = result.rows.map((row) => ({
      MENU_NAME: row[0],
      MENU_CODE: row[1],
      MENU_ID: row[2],
      MENU_PARENT_ID: row[3],
      MENU_SORT: row[4],
      MENU_URL: row[5],
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
    query += `SELECT
                  T.USER_EMP_ID,
                  T.USER_LOGIN,
                  T.USER_PASSWORD,
                  T.USER_EMAIL,
                  T.USER_FACTORY,
                  T.USER_COSTCENTER,
                  (
                      SELECT LISTAGG(
                          '''' || UPPER(R.ROLE_ID) || '''',
                          ', '
                      ) WITHIN GROUP (ORDER BY R.ROLE_ID)
                      FROM CU_ROLE_USER RU2
                      INNER JOIN CU_ROLE_M R ON R.ROLE_ID = RU2.ROLE_ID
                      WHERE RU2.USER_LOGIN = T.USER_LOGIN
                        AND R.SYSTEM_ID = '73'
                  ) AS ROLE_LIST
              FROM CU_USER_M T
              WHERE
                  UPPER(T.USER_LOGIN) = UPPER('${loginID}')
                  AND UPPER(T.USER_PASSWORD) = UPPER('${Password}')`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      EMP: row[0],
      LOGIN: row[1],
      PASSWORD: row[2],
      EMAIL: row[3],
      FAC_CODE: row[4],
      COSTCENTER: row[5],
      ROLL_ID: row[6]
        }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.Login2 = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    const { loginID } = req.body;
    query += `SELECT
                  T.USER_EMP_ID,
                  T.USER_LOGIN,
                  T.USER_PASSWORD,
                  T.USER_EMAIL,
                  T.USER_FACTORY,
                  T.USER_COSTCENTER,
                  (
                      SELECT LISTAGG(
                          '''' || UPPER(R.ROLE_ID) || '''',
                          ', '
                      ) WITHIN GROUP (ORDER BY R.ROLE_ID)
                      FROM CU_ROLE_USER RU2
                      INNER JOIN CU_ROLE_M R ON R.ROLE_ID = RU2.ROLE_ID
                      WHERE RU2.USER_LOGIN = T.USER_LOGIN
                        AND R.SYSTEM_ID = '73'
                  ) AS ROLE_LIST
              FROM CU_USER_M T
              WHERE
                  UPPER(T.USER_LOGIN) = UPPER('${loginID}')`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      EMP: row[0],
      LOGIN: row[1],
      PASSWORD: row[2],
      EMAIL: row[3],
      FAC_CODE: row[4],
      COSTCENTER: row[5],
      ROLL_ID: row[6]
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

module.exports.GetFileServer = async function (req, res) {
  try {
    const fileName = "FileManPower.xlsx"; // กำหนดชื่อไฟล์
    const filePath = path.join(
      __dirname,
      "fetl/data/App_API/HR_api/FileFomat",
      fileName
    );

    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // ส่งไฟล์ไปยัง client
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error sending file" });
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
    strEmailFormat,
    strEmail
  } = req.body;
  try {
    // const formattedRemark = Remark.replace(/(.{60})/g, '$1<br>');
    const client = await ConnectPG_DB();
    let query2 = `SELECT unnest(string_to_array('${strEmail}', ',')) AS user_email;`;
    const result = await client.query(query2);
    if (result.rows.length > 0) {
      const emailList = result.rows.map((row) => row.user_email);
      const mailOptions = {
        from: "HROnlineSystem@th.fujikura.com",
        to: strEmail,
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

module.exports.UploadFileDetail = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { fileData, ReqNo,RecID } = req.body;
    console.log(fileData,'may')
    const buffer = Buffer.from(fileData, 'base64'); 
    query = `
        UPDATE "HR".HRDWMR_PERSON SET
          mrp_att_fileserver = $1
        WHERE
          mrp_hreq_no = $2
          and mrp_record_id = '${RecID}'`;
    const result = await client.query(query, [buffer, ReqNo]);
    console.log('File uploaded successfully:', result);
    res.status(200).send({
      message: 'File uploaded successfully',
    });
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error.message,'UploadFileDetail');
  }
};

module.exports.UploadSub = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { fileData, ReqNo ,ColumnName} = req.body;
    const buffer = Buffer.from(fileData, 'base64'); 
    console.log("Upload start",buffer, "Upload end");
    query = `
      UPDATE "HR".HRDWMR_HEADER SET 
      mrh_subs_fileserver = $1
      WHERE mrh_req_no =  $2`;
      const result = await client.query(query, [buffer, ReqNo]);
    console.log(query,'eeeeeeeee',ReqNo)
    console.log('File uploaded successfully:', result.rows);
    res.status(200).send({
      message: 'File uploaded successfully',
    });

    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.UploadAdd = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { fileData, ReqNo ,ColumnName} = req.body;
    const buffer = Buffer.from(fileData, 'base64'); 
    console.log("Upload start",buffer, "Upload end");
    query = `
      UPDATE "HR".HRDWMR_HEADER SET 
      mrh_add_fileserver = $1
      WHERE mrh_req_no =  $2`;
      const result = await client.query(query, [buffer, ReqNo]);
    console.log(query,'eeeeeeeee',ReqNo)
    console.log('File uploaded successfully:', result.rows);
    res.status(200).send({
      message: 'File uploaded successfully',
    });

    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetFile = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body; 
    query = `
      SELECT
        mrh_subs_file,
        mrh_subs_fileserver,
        mrh_add_file,
        mrh_add_fileserver,
        mrh_hrs_file,
        mrh_hrs_fileserver
      FROM
        "HR".HRDWMR_HEADER
      WHERE
        mrh_req_no = '${ReqNo}'
    `;

    // รันคำสั่ง SQL
    const result = await client.query(query);
    console.log(result.rows)
    const jsonData = result.rows.map((row) => ({
      SubName: row.mrh_subs_file,
      SubName_File: row.mrh_subs_fileserver,
      AddName: row.mrh_add_file,
      AddName_File: row.mrh_add_fileserver,
      HrAcName: row.mrh_hrs_file,
      HrAcName_File: row.mrh_hrs_fileserver,
        }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetFileDetail = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body; 
    query = `
      select mrp_att_file,mrp_att_fileserver ,mrp_record_id
      from  "HR".HRDWMR_PERSON 
      where mrp_hreq_no = '${ReqNo}'`;
    const result = await client.query(query);
    console.log(result.rows)
    const jsonData = result.rows.map((row) => ({
      RecID: row.mrp_record_id,
      FileName: row.mrp_att_file,
      File: row.mrp_att_fileserver,
        }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetEmailUser = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { user } = req.body; 
        const userCondition = Array.isArray(user)
      ? `hdpm_user_login IN (${user.map((u) => `'${u}'`).join(",")})`
      : `hdpm_user_login = '${user}'`;

    query = `
      select distinct 
        hdpm_user_login,
        hdpm_email
      from
        "HR".hrdw_person_master
      where
         hdpm_for ='MAN POWER'
      and ${userCondition}`;

    // รันคำสั่ง SQL
    const result = await client.query(query);
    console.log(query)
    const jsonData = result.rows.map((row) => ({
      User: row.hdpm_user_login,
      Email: row.hdpm_email,
        }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetEmailHrStaff = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac } = req.body; 
    query = `
        select distinct 
        hdpm_user_login,
        hdpm_email
        from
          "HR".hrdw_person_master
        where
          hdpm_level ='HR STAFF'
          and hdpm_for ='MAN POWER'
        and hdpm_factory = '${Fac}'`;

    // รันคำสั่ง SQL
    const result = await client.query(query);
    console.log(query)
    const jsonData = result.rows.map((row) => ({
      User: row.hdpm_user_login,
      Email: row.hdpm_email,
        }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};


