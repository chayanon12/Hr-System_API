const {
  ConnectPG_DB,
  DisconnectPG_DB,
  ConnectOracleDB,
  DisconnectOracleDB,
} = require("../Conncetion/DBConn.cjs");
const oracledb = require("oracledb");
const { writeLogError } = require("../Common/LogFuction.cjs");

module.exports.GetMenu = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    console.log("ConnectOracleDB");
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
    console.log("ConnectOracleDB");
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
