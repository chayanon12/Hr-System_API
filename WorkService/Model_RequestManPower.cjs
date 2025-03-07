const {
  ConnectPG_DB,
  DisconnectPG_DB,
  ConnectOracleDB,
  DisconnectOracleDB,
} = require("../Conncetion/DBConn.cjs");
const oracledb = require("oracledb");
const { writeLogError } = require("../Common/LogFuction.cjs");

// RequestManPower
module.exports.GetFactory = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    query += `select distinct f.factory_name as REQ_FACTORY,pmm.hdpm_factory from "HR".hrdw_person_master pmm ,"CUSR".cu_factory_m f																																																
              where pmm.hdpm_factory = f.factory_code and pmm.hdpm_for = 'MAN POWER'																																																
              and pmm.hdpm_level = 'ISSUE' and pmm.hdpm_person_sts = 'A' and pmm.hdpm_user_login = '${User_login}'`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row[1],
      label: row[0],
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};


module.exports.GetPosition = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { DDLFactory } = req.body;
    query += `select distinct pjj.hdpj_position_group 
              from "HR".hrdw_position_map_job pjj 
              where pjj.hdpj_factory ='${DDLFactory}'					
              order by pjj.hdpj_position_group`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row[0],
      label: row[0],
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDepartment = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    query += `select distinct pmm.hdm_dept 
              from "HR".hrdw_person_master pmm 
              where pmm.hdpm_for = 'MAN POWER' 
              and pmm.hdpm_level = 'ISSUE' 
              and pmm.hdpm_person_sts  = 'A' 
              and pmm.hdpm_user_login =  '${User_login}'
              order by pmm.hdm_dept`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row[0],
      label: row[0],
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetJobGrade = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {DDLFactory,DDLPosition} = req.body;
    query += `select distinct jgg.hdpj_job 
              from "HR".hrdw_position_map_job jgg 
              where jgg.hdpj_factory  = '${DDLFactory}' 
              and jgg.hdpj_position_group = '${DDLPosition}' 
              order by jgg.hdpj_job`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row[0],
      label: row[0],
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetEmployeeType = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const {DDLFactory,DDLPosition} = req.body;
    query += `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR03' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row[0],
      label: row[1],
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};
