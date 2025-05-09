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
    // console.log(User_login,'GetFactory');
    query = `select distinct f.factory_name as REQ_FACTORY,pmm.hdpm_factory from "HR".hrdw_person_master pmm ,"CUSR".cu_factory_m f																																																
              where pmm.hdpm_factory = f.factory_code and pmm.hdpm_for = 'MAN POWER'																																																
              and pmm.hdpm_person_sts = 'A' and pmm.hdpm_user_login = '${User_login}'`;
    const result = await client.query(query);
    console.log(result.rows, "GetFactory");
    const jsonData = result.rows.map((row) => ({
      value: row.hdpm_factory,
      label: row.req_factory,
    }));
    console.log(jsonData, "GetFactory");
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetFactoryIssue = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    // console.log(User_login,'GetFactory');
    query = `select distinct f.factory_name as REQ_FACTORY,pmm.hdpm_factory from "HR".hrdw_person_master pmm ,"CUSR".cu_factory_m f																																																
              where pmm.hdpm_factory = f.factory_code and pmm.hdpm_for = 'MAN POWER'																																																
              and pmm.hdpm_level = 'ISSUE' and pmm.hdpm_person_sts = 'A' and pmm.hdpm_user_login = '${User_login}'`;
    const result = await client.query(query);
    console.log(result.rows, "GetFactory",query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdpm_factory,
      label: row.req_factory,
    }));
    console.log(jsonData, "GetFactory");
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetFactoryMasterlist = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    // console.log(User_login,'GetFactory');
    query = `select factory_code,factory_name from  "CUSR".cu_factory_m`;
    const result = await client.query(query);
    console.log(result.rows, "GetFactory",query);
    const jsonData = result.rows.map((row) => ({
      value: row.factory_code,
      label: row.factory_name,
    }));
    console.log(jsonData, "GetFactory");
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
    query = `select distinct pjj.hdpj_position_group 
              from "HR".hrdw_position_map_job pjj 
              where pjj.hdpj_factory ='${DDLFactory}'					
              order by pjj.hdpj_position_group`;
    const result = await client.query(query);
    console.log(result.rows, "GetPosition");
    const jsonData = result.rows.map((row) => ({
      value: row.hdpj_position_group,
      label: row.hdpj_position_group,
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
    query = `select distinct pmm.hdm_dept 
              from "HR".hrdw_person_master pmm 
              where pmm.hdpm_for = 'MAN POWER' 
              and pmm.hdpm_person_sts  = 'A' 
              and pmm.hdm_dept <> 'ALL'
              and pmm.hdpm_user_login =  '${User_login}'
              order by pmm.hdm_dept`;
    const result = await client.query(query);
    console.log(result.rows, "GetDepartment");
    const jsonData = result.rows.map((row) => ({
      value: row.hdm_dept,
      label: row.hdm_dept,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDepartmentIssue = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    query = `select distinct pmm.hdm_dept 
              from "HR".hrdw_person_master pmm 
              where pmm.hdpm_for = 'MAN POWER' 
              and pmm.hdpm_level = 'ISSUE' 
              and pmm.hdpm_person_sts  = 'A' 
              and pmm.hdpm_user_login =  '${User_login}'
              order by pmm.hdm_dept`;
    const result = await client.query(query);
    console.log(result.rows, "GetDepartment");
    const jsonData = result.rows.map((row) => ({
      value: row.hdm_dept,
      label: row.hdm_dept,
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
    const { DDLFactory, DDLPosition } = req.body;
    console.log(DDLFactory, DDLPosition, "getgob000");
    query = `select distinct jgg.hdpj_job 
              from "HR".hrdw_position_map_job jgg 
              where jgg.hdpj_factory  = '${DDLFactory}' 
              and jgg.hdpj_position_group in (${DDLPosition})
              order by jgg.hdpj_job`;
    console.log(query, "getgob");
    const result = await client.query(query);
    console.log(result.rows, "GetJobGrade");
    const jsonData = result.rows.map((row) => ({
      value: row.hdpj_job,
      label: row.hdpj_job,
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
    query = `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR03' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetForDept = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Factory } = req.body;
    query = `select d.hddm_dept 
              from "HR".hrdw_dept_master d 
              where d.hddm_status = 'A' 
              and d.hddm_factory  = '${Factory}'																					
              order by d.hddm_sort,d.hddm_dept_name`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hddm_dept,
      label: row.hddm_dept,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetEducation = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const {Factory} = req.body;
    query = `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR04' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetCourse = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const {Factory} = req.body;
    query = `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR05' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetRequestJobGrade = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { DDLPosition, DDLFacrtory } = req.body;
    query = `select j.hdpj_job 
              from "HR".hrdw_position_map_job j 
              where j.hdpj_position_group = '${DDLPosition}'
              and j.hdpj_factory ='${DDLFacrtory}'
              order by j.hdpj_job`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdpj_job,
      label: row.hdpj_job,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetField = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const {DDLPosition,DDLFacrtory} = req.body;
    query = `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR06' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetEnglish = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const {DDLPosition,DDLFacrtory} = req.body;
    query = `select cm.hdcm_code,cm.hdcm_desc 
              from "HR".hrdw_code_master cm 
              where cm.hdcm_group = 'MR07' 
              and cm.hdcm_status  = 'A' 
              order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDeptByCC = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Cost_Center } = req.body;
    query = `select cc.hdcd_dept from "HR".hrdw_cc_map_dept cc where cc.hdcd_cc =  '${Cost_Center}'`;
    const result = await client.query(query);
    const jsonData = result.rows.map((row) => ({
      Dept: row.hdcd_dept,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDataPersonByIDCode = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    const { Id_Code } = req.body;
    query = `select h.ename||' '||h.esurname as EMP_NAME,h.pos_grade as JOB_GRADE,h.cost_center 
              from cusr.cu_user_humantrix h 
              where h.status = 'Active' 
              and h.empcode = '${Id_Code}'`;
    const result = await Conn.execute(query);
    const jsonData = result.rows.map((row) => ({
      EMP_NAME: row[0],
      JOB_GRADE: row[1],
      Cost_Center: row[2],
    }));
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GenRunNo = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac_code, Fac_Desc } = req.body;
    console.log(Fac_Desc, Fac_code, "-------");
    query = `SELECT 'M-' || '${Fac_Desc}' || '-' || TO_CHAR(CURRENT_DATE, 'YYMM') || '-' ||
              TO_CHAR(COALESCE(MAX(CAST(SUBSTR(mrh_req_no, 11, 3) AS INTEGER)), 0) + 1, 'FM000') AS RUNNING
              FROM "HR".HRDWMR_HEADER
              WHERE mrh_factory = '${Fac_code}'
              and substring(mrh_req_no,6,4) = TO_CHAR(CURRENT_DATE, 'YYMM')`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      RUNNING: row.running,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.FindStatusCodebyDesc = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Status_Desc } = req.body;
    query = `select cm.hdcm_code,cm.hdcm_desc																																											
            from "HR".hrdw_code_master cm																																											
            where cm.hdcm_group = 'MR01'																																											
            and cm.hdcm_status  = 'A'
            and hdcm_desc = '${Status_Desc}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      StatusCode: row.hdcm_code,
      StatusDesc: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetStatusSearch = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { type } = req.body;
    const formattype= `(${type.map((s) => `'${s}'`).join(', ')})`;
    query = `select cm.hdcm_code,cm.hdcm_desc																																											
            from "HR".hrdw_code_master cm																																											
            where cm.hdcm_group = 'MR01'																																											
            and cm.hdcm_status  = 'A'
            and cm.hdcm_cmmt1 in ${formattype}
            `;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      label: row.hdcm_desc,
      value: row.hdcm_code,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.InsGenNoRequest = async function (req, res) {
  let client;
  let query;
  try {
    client = await ConnectPG_DB();
    const {
      ReqNo,
      Fac_Desc,
      Stats_Code,
      ReqBy,
      ReqDate,
      ReqDept,
      Email,
      ReqTel,
      Position,
      TargetDate,
      totalAmount,
      Remark,
      Create_by,
    } = req.body;
    console.log(req.body, "InsGenNoRequest");
    const query1 = `
    insert into "HR".hrdwmr_header(
      mrh_req_no,
      mrh_factory,
      mrh_req_status,
      mrh_req_by,
      mrh_req_date,
      mrh_req_dept,
      mrh_req_email,
      mrh_req_tel,
      mrh_req_position,
      mrh_target_date,
      mrh_total_amount,
      mrh_req_remark,
      mrh_create_date,
      mrh_create_by
      )values(
      '${ReqNo}',
      '${Fac_Desc}',
      '${Stats_Code}',
      '${ReqBy}',
      TO_DATE('${ReqDate}', 'YYYY-MM-DD'),
      '${ReqDept}',
      '${Email}',
      '${ReqTel}',
      '${Position}',
      TO_DATE('${TargetDate}', 'YYYY-MM-DD'),
      ${totalAmount},
      '${Remark}',
      current_timestamp,
      '${Create_by}'
      )`;

    const result = await client.query(query1);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.InsGenNoRequest2 = async function (req, res) {
  let client;
  let query;
  try {
    client = await ConnectPG_DB();
    const { ReqNo, EmpType, txt_Other, Create_by, Emp_Req } = req.body;
    console.log(req.body, "InsGenNoRequest");

    const query1 = `
        MERGE INTO "HR".hrdwmr_person_det AS target
        USING (SELECT 
                        '${ReqNo}' AS mrpd_hreq_no,
                        'ALL' AS mrpd_record_id,
                        'REQUIREMENT' AS mrpd_category,
                        '${Emp_Req}' as mrpd_value
              ) AS source
        ON target.mrpd_hreq_no = source.mrpd_hreq_no
          AND target.mrpd_record_id = source.mrpd_record_id
          AND target.mrpd_category = source.mrpd_category
          AND target.mrpd_value = source.mrpd_value
        WHEN MATCHED THEN
          	 UPDATE SET
					mrpd_value_other = '${txt_Other}||""',
                    mrpd_update_date = current_timestamp,
                    mrpd_update_by = '${Create_by || ""}',
                    mrpd_value_add ='${EmpType || ""}'
        WHEN NOT MATCHED THEN
          INSERT (  mrpd_hreq_no,
                    mrpd_record_id,
                    mrpd_category,
                    mrpd_value,
                    mrpd_value_other,
                    mrpd_value_add,
                    mrpd_create_date,
                    mrpd_create_by)
          VALUES (  '${ReqNo || ""}',
                    'ALL',
                    'REQUIREMENT',
                    '${Emp_Req || ""}',
                    '${txt_Other || ""}',
                    '${EmpType || ""}',
                    current_timestamp,
                    '${Create_by || ""}')`;
    console.log(query1);
    const result = await client.query(query1);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDepartmentManager = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac_code, Sl_Department } = req.body;
    query = `select t.hdpm_user_login 
              from "HR".hrdw_person_master t 
              where t.hdpm_for = 'MAN POWER' 
              and t.hdpm_level  = 'DEPT' 
              and t.hdpm_person_sts  = 'A' 
              and t.hdpm_factory  = '${Fac_code}'
              and t.hdm_dept = '${Sl_Department}'															
              order by t.hdpm_priority ,t.hdpm_user_login`;
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      value: row.hdpm_user_login,
      label: row.hdpm_user_login,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetFMDM = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac_code, Sl_Department } = req.body;
    query = ` select t.hdpm_user_login 
              from "HR".hrdw_person_master t 
              where t.hdpm_for = 'MAN POWER' 
              and t.hdpm_level  = 'FMGM' 
              and t.hdpm_person_sts  = 'A' 
              and t.hdpm_factory  = '${Fac_code}' 
              --and t.hdm_dept = '${Sl_Department}'										
              order by t.hdpm_priority ,t.hdpm_user_login	`;
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      value: row.hdpm_user_login,
      label: row.hdpm_user_login,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetHrManager = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac_code, Sl_Department } = req.body;
    query = `select t.hdpm_user_login 
            from "HR".hrdw_person_master t 
            where t.hdpm_for = 'MAN POWER' 
            and t.hdpm_level  = 'HR MGR' 
            and t.hdpm_person_sts  = 'A' 
            and t.hdpm_factory  = '${Fac_code}'
            --and t.hdm_dept = '${Sl_Department}'
            order by t.hdpm_priority ,t.hdpm_user_login	`;
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      value: row.hdpm_user_login,
      label: row.hdpm_user_login,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.SaveDraft = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      ReqNo,
      Email,
      Tel,
      DateTarget,
      TotalReq,
      Remark,
      Cb_Sub,
      Total_Sub,
      CB_SubAttach,
      Sub_Filename,
      Sub_FilenameServer,
      Cb_Add,
      Add_Target1,
      Add_Target2,
      Total_Add,
      CB_AddAttach,
      Add_Filename,
      Add_FilenameServer,
      DeptBy,
      FMGMBy,
      HRMBy,
      UpdateBy,
      Status,
    } = req.body;
    console.log(req.body, "SaveDraft");
    query = `
            update "HR".hrdwmr_header set
              ----step1
              mrh_req_status = '${Status}',
              mrh_req_email = '${Email}',
              mrh_req_tel = '${Tel}',
              mrh_target_date = TO_DATE('${DateTarget}',  'YYYY-MM-DD'),
              mrh_total_amount = ${TotalReq},
              mrh_req_remark = '${Remark}',
              ------ 
              --sub
              mrh_subs_flg = '${Cb_Sub}',
              mrh_subs_amount = ${Total_Sub},
              mrh_subs_attach = '${CB_SubAttach}',
              mrh_subs_file = '${Sub_Filename}',
              -- mrh_subs_fileserver = '${Sub_FilenameServer}',
              --add
              mrh_add_flg = '${Cb_Add}',
              mrh_add_target1 = '${Add_Target1}',
              mrh_add_target2 = '${Add_Target2}',
              mrh_add_amount = ${Total_Add},
              mrh_add_attach = '${CB_AddAttach}',
              mrh_add_file = '${Add_Filename}',
              --mrh_add_fileserver = '${Add_FilenameServer}',
              --step3
              mrh_dept_by = '${DeptBy}',
              mrh_fm_by = '${FMGMBy}',
              mrh_hrm_by = '${HRMBy}',
              mrh_update_date = current_timestamp,
              mrh_update_by = '${UpdateBy}',
              mrh_send_date = case
                when '${Status}' = 'MR0102' then current_timestamp
                else mrh_send_date
              end
            where
              mrh_req_no = '${ReqNo}'`;
    console.log(query, "QuerySaveDraft");
    const result = await client.query(query);
    console.log(result.rows, "SaveDraft2");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

module.exports.InsPerson = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      ReqNo,
      RecId,
      Req_flg,
      Emp_id,
      Emp_name,
      Emp_Surname,
      Emp_dept,
      Emp_Jobgrade,
      For_Dept,
      Special,
      Expereince,
      Lang_skill,
      Lang_other,
      Filename,
      FilenameServer,
      Create_by,
    } = req.body;
    console.log(req.body, "InsPerson");
    query = `
            MERGE INTO "HR".hrdwmr_person AS target
            USING (SELECT 
                        '${ReqNo}' AS mrp_hreq_no,
                        '${RecId}' AS mrp_record_id
                  ) AS source
            ON target.mrp_hreq_no = source.mrp_hreq_no AND target.mrp_record_id = source.mrp_record_id
            WHEN MATCHED THEN
                UPDATE SET
                    mrp_req_flg = '${Req_flg}',
                    mrp_emp_id = '${Emp_id}',
                    mrp_emp_name = '${Emp_name}',
                    mrp_emp_sname = '${Emp_Surname}',
                    mrp_emp_dept = '${Emp_dept}',
                    mrp_emp_jgrade = '${Emp_Jobgrade}',
                    mrp_for_dept = '${For_Dept}',
                    mrp_special = '${Special}',
                    mrp_experience = '${Expereince}',
                    mrp_lang_skill = '${Lang_skill}',
                    mrp_lang_other = '${Lang_other}',
                    mrp_att_file = '${Filename}',
                    mrp_update_date = current_timestamp,
                    mrp_update_by = '${Create_by}'
            WHEN NOT MATCHED THEN
                INSERT (
                    mrp_hreq_no,
                    mrp_record_id,
                    mrp_req_flg,
                    mrp_emp_id,
                    mrp_emp_name,
                    mrp_emp_sname,
                    mrp_emp_dept,
                    mrp_emp_jgrade,
                    mrp_for_dept,
                    mrp_special,
                    mrp_experience,
                    mrp_lang_skill,
                    mrp_lang_other,
                    mrp_att_file,
                    mrp_create_date,
                    mrp_create_by
                ) VALUES (
                    '${ReqNo}',
                    '${RecId}',
                    '${Req_flg}',
                    '${Emp_id}',
                    '${Emp_name}',
                    '${Emp_Surname}',
                    '${Emp_dept}',
                    '${Emp_Jobgrade}',
                    '${For_Dept}',
                    '${Special}',
                    '${Expereince}',
                    '${Lang_skill}',
                    '${Lang_other}',
                    '${Filename}',
                    current_timestamp,
                    '${Create_by}'
                )`;
    console.log(query, "QueryInsPerson");
    const result = await client.query(query);
    console.log(result.rows, "SaveDraft2");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

module.exports.InsPersonDetail = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      ReqNo,
      Recid,
      category,
      Sl_value,
      txt_Other,
      value_add,
      Create_by,
    } = req.body;
    console.log(req.body, "InsPersonDetail");
    query = `
            MERGE INTO "HR".hrdwmr_person_det AS target
            USING (SELECT
                        '${ReqNo}' AS mrpd_hreq_no,
                        '${Recid}' AS mrpd_record_id,
                        '${category}' AS mrpd_category,
                        '${Sl_value}' as mrpd_value
                  ) AS source
            ON target.mrpd_hreq_no = source.mrpd_hreq_no
              AND target.mrpd_record_id = source.mrpd_record_id
              AND target.mrpd_category = source.mrpd_category
              AND target.mrpd_value = source.mrpd_value
            WHEN MATCHED THEN
                UPDATE SET
                    mrpd_value_other = '${txt_Other || ""}',
                    mrpd_update_date = current_timestamp,
                    mrpd_update_by = '${Create_by || ""}',
                    mrpd_value_add ='${value_add || ""}'
            WHEN NOT MATCHED THEN
                INSERT (
                    mrpd_hreq_no,
                    mrpd_record_id,
                    mrpd_category,
                    mrpd_value,
                    mrpd_value_other,
                    mrpd_value_add,
                    mrpd_create_date,
                    mrpd_create_by
                ) VALUES (
                    '${ReqNo || ""}',
                    '${Recid || ""}',
                    '${category || ""}',
                    '${Sl_value || ""}',
                    '${txt_Other || ""}',
                    '${value_add || ""}',
                    current_timestamp,
                    '${Create_by || ""}'
                )`;
    console.log(query, "QueryInsPersonDetail");
    const result = await client.query(query);
    console.log(result.rows, "Detail");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

module.exports.SearchManPower = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      Factory,
      Department,
      Position,
      ReqNoFrom,
      ReqNoTo,
      DateFrom,
      DateTo,
      ReqBy,
      JobGrade,
      Status
    } = req.body;
    const formattedStatus = Status && Status.length > 0
  ? `(${Status.map((s) => `'${s}'`).join(', ')})`
  :[];
    console.log(formattedStatus, "SearchManPower");
    query = `
          SELECT
              M.factory_name AS FAC,
              H.mrh_req_dept AS DEPT,
              H.mrh_req_no AS REQ_NO,
              H.mrh_req_position AS POSITION,
              (SELECT STRING_AGG(DISTINCT mrpd_value, ', ' ORDER BY mrpd_value)
                FROM "HR".hrdwmr_person_det
                  WHERE mrpd_category = 'JOB GRADE' AND mrpd_hreq_no = H.mrh_req_no) AS JOB_GARDE,
              H.mrh_create_by AS CREATE_BY,
              TO_CHAR(H.mrh_create_date, 'DD/MM/YY') AS CREATE_DATE,
              C.hdcm_desc AS STATUS,
              H.mrh_update_by AS LAST_BY,
              TO_CHAR(H.mrh_update_date, 'DD/MM/YY') AS LAST_DATE,
              H.mrh_req_status AS STATUS_VALUE
          FROM "HR".HRDWMR_HEADER H
          JOIN "CUSR".cu_factory_m M ON H.mrh_factory = M.factory_code
          JOIN "HR".hrdw_code_master C ON H.mrh_req_status = C.hdcm_code
          join "HR".hrdwmr_person_det D ON H.mrh_req_no = D.mrpd_hreq_no
          WHERE 1=1
              AND (${Factory} IS NULL OR H.mrh_factory = '${Factory}')
              --AND D.mrpd_category = 'JOB GRADE'
              AND (${Department} IS NULL OR H.mrh_req_dept = ANY (${Department}))
              AND (${Position} IS NULL OR H.mrh_req_position = ANY (${Position})) 
              AND (${JobGrade} IS NULL OR D.mrpd_value = ANY (${JobGrade}))
              AND ('${ReqNoFrom}' = '' OR H.mrh_req_no >= '${ReqNoFrom}')
              AND ('${ReqNoTo}' = '' OR H.mrh_req_no <= '${ReqNoTo}')
              AND (TO_CHAR(H.mrh_req_date, 'YYYY-MM-DD') >= '${DateFrom}' OR '${DateFrom}' = '')
              AND (TO_CHAR(H.mrh_req_date, 'YYYY-MM-DD') <= '${DateTo}' OR  '${DateTo}' = '')
              -- AND H.mrh_req_by = '${ReqBy}'
              AND ('${ReqBy}' = '' OR H.mrh_req_by = '${ReqBy}')
              AND (${formattedStatus} IS NULL OR C.hdcm_code in ${formattedStatus})
         	GROUP BY 
                H.mrh_req_no,
                M.factory_name,
                H.mrh_req_dept,
                H.mrh_req_position,
                H.mrh_create_by,
                H.mrh_create_date,
                C.hdcm_desc,
                H.mrh_update_by,
                H.mrh_update_date,
                H.mrh_req_status
          ORDER BY H.mrh_req_no desc`;

    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "SearchManPower");
    const jsonData = result.rows.map((row) => ({
      Factory: row.fac,
      Department: row.dept,
      ReqNo: row.req_no,
      Position: row.position,
      Job_Grade: row.job_garde,
      CreateBy: row.create_by,
      CreateDate: row.create_date,
      Status: row.status,
      LastBy: row.last_by,
      Lastdate: row.last_date,
      Status_value: row.status_value,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.SearchManPowerApprove = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      Factory,
      Department,
      Position,
      ReqNoFrom,
      ReqNoTo,
      DateFrom,
      DateTo,
      ReqBy,
      JobGrade,
      Status,
      UserApprove
    } = req.body;
    const formattedStatus = Status && Status.length > 0
  ? `(${Status.map((s) => `'${s}'`).join(', ')})`
  :[];
    const formattedFactory = Factory && Factory.length > 0
    ? `(${Factory.map((s) => `'${s}'`).join(', ')})`
    :[];
    console.log(formattedFactory, "formattedFactory");
    query = `
    SELECT
        M.factory_name AS FAC,
        H.mrh_req_dept AS DEPT,
        H.mrh_req_no AS REQ_NO,
        H.mrh_req_position AS POSITION,
        (SELECT STRING_AGG(DISTINCT mrpd_value, ', ' ORDER BY mrpd_value)
          FROM "HR".hrdwmr_person_det
            WHERE mrpd_category = 'JOB GRADE' AND mrpd_hreq_no = H.mrh_req_no) AS JOB_GARDE,
        H.mrh_create_by AS CREATE_BY,
        TO_CHAR(H.mrh_create_date, 'DD/MM/YY') AS CREATE_DATE,
        C.hdcm_desc AS STATUS,
        H.mrh_update_by AS LAST_BY,
        TO_CHAR(H.mrh_update_date, 'DD/MM/YY') AS LAST_DATE,
        H.mrh_req_status AS STATUS_VALUE
    FROM "HR".HRDWMR_HEADER H
    JOIN "CUSR".cu_factory_m M ON H.mrh_factory = M.factory_code
    JOIN "HR".hrdw_code_master C ON H.mrh_req_status = C.hdcm_code
    JOIN "HR".hrdwmr_person_det D ON H.mrh_req_no = D.mrpd_hreq_no
    WHERE 1=1
        AND (${formattedFactory} IS NULL OR H.mrh_factory in ${formattedFactory})
        --AND (${Factory} IS NULL OR H.mrh_factory = '${Factory}')
        AND (${Department} IS NULL OR H.mrh_req_dept = ANY (${Department}))
        AND (${Position} IS NULL OR H.mrh_req_position = ANY (${Position})) 
        AND (${JobGrade} IS NULL OR D.mrpd_value = ANY (${JobGrade}))
        AND ('${ReqNoFrom}' = '' OR H.mrh_req_no >= '${ReqNoFrom}')
        AND ('${ReqNoTo}' = '' OR H.mrh_req_no <= '${ReqNoTo}')
        AND (TO_CHAR(H.mrh_req_date, 'YYYY-MM-DD') >= '${DateFrom}' OR '${DateFrom}' = '')
        AND (TO_CHAR(H.mrh_req_date, 'YYYY-MM-DD') <= '${DateTo}' OR  '${DateTo}' = '')
        AND ('${ReqBy}' = '' OR H.mrh_req_by = '${ReqBy}')
        AND (${formattedStatus} IS NULL OR C.hdcm_code in ${formattedStatus})
        AND(H.mrh_dept_by = '${UserApprove}' AND H.mrh_req_status IN ('MR0102'))
        or(H.mrh_fm_by = '${UserApprove}' AND H.mrh_req_status IN ('MR0103'))
        or(H.mrh_hrm_by= '${UserApprove}' AND H.mrh_req_status IN ('MR0104'))
     GROUP BY 
          H.mrh_req_no,
          M.factory_name,
          H.mrh_req_dept,
          H.mrh_req_position,
          H.mrh_create_by,
          H.mrh_create_date,
          C.hdcm_desc,
          H.mrh_update_by,
          H.mrh_update_date,
          H.mrh_req_status
    ORDER BY H.mrh_req_no desc`;
    

    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "SearchManPower");
    const jsonData = result.rows.map((row) => ({
      Factory: row.fac,
      Department: row.dept,
      ReqNo: row.req_no,
      Position: row.position,
      Job_Grade: row.job_garde,
      CreateBy: row.create_by,
      CreateDate: row.create_date,
      Status: row.status,
      LastBy: row.last_by,
      Lastdate: row.last_date,
      Status_value: row.status_value,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetDataEdit = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    console.log(ReqNo, "GetDataEdit");
    query = `
        select H.*,
          C.hdcm_desc as STS_DESC,
          C.hdcm_cmmt1 as StatusType,
          TO_CHAR(H.mrh_req_date,'DD/MM/YYYY') as REQ_DATE, 
          TO_CHAR(H.mrh_target_date,'DD/MM/YYYY') as TARGET_DATE,
          TO_CHAR(H.mrh_send_date,'DD/MM/YYYY') as SendDate,
          TO_CHAR(H.mrh_dept_date, 'DD/MM/YYYY HH24:MI:SS') AS dept_date,
          TO_CHAR(H.mrh_fm_date, 'DD/MM/YYYY HH24:MI:SS') AS fm_date,
          TO_CHAR(H.mrh_hrm_date, 'DD/MM/YYYY HH24:MI:SS') AS hr_date,
          TO_CHAR(H.mrh_hrs_lastdate, 'DD/MM/YYYY') AS hr_lastdate,
          M.factory_name as FAC_DESC
        FROM "HR".HRDWMR_HEADER H
        INNER JOIN "CUSR".cu_factory_m M ON H.mrh_factory = M.factory_code
        INNER JOIN "HR".hrdw_code_master C ON H.mrh_req_status = C.hdcm_code
        WHERE 1=1
        and H.mrh_req_no ='${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);

    const jsonData = result.rows.map((row) => ({
      //Step1
      Fac_Desc: row.fac_desc,
      Fac_code: row.mrh_factory,
      Status_Desc: row.sts_desc,
      Status_code: row.mrh_req_status,
      Status_Type: row.statustype,
      Req_date: row.req_date,
      Req_No: row.mrh_req_no,
      Req_By: row.mrh_req_by,
      Dept: row.mrh_req_dept,
      Email: row.mrh_req_email,
      Tel: row.mrh_req_tel,
      Position: row.mrh_req_position,
      Target_date: row.target_date,
      Req_Total: row.mrh_total_amount,
      Remark: row.mrh_req_remark,
      SendDate: row.senddate,
      //Step2
      Cb_Sub: row.mrh_subs_flg,
      Sub_Total: Number(row.mrh_subs_amount),
      Cb_SubFile: row.mrh_subs_attach,
      Sub_FileName: row.mrh_subs_file,
      Sub_FileNameServer: row.mrh_subs_fileserver,
      Cb_Add: row.mrh_add_flg,
      Add_Target1: row.mrh_add_target1,
      Add_Target2: row.mrh_add_target2,
      Add_Total: Number(row.mrh_add_amount),
      Cb_AddFile: row.mrh_add_attach,
      Add_FileName: row.mrh_add_file,
      Add_FileNameServer: row.mrh_add_fileserver,
      //Step3
      //Dept
      Dept_by: row.mrh_dept_by,
      Dept_date: row.dept_date,
      Dept_Radio: row.mrh_dept_flg,
      Dept_Comment: row.mrh_dept_comment,
      //FMGM
      FMGM_By: row.mrh_fm_by,
      FMGM_Date: row.fm_date,
      FMGM_Radio: row.mrh_fm_flg,
      FMGM_Comment: row.mrh_fm_comment,
      //Hr
      Hr_By: row.mrh_hrm_by,
      Hr_Date: row.hr_date,
      Hr_Radio: row.mrh_hrm_flg,
      Hr_Comment: row.mrh_hrm_comment,
      //Step4 Waiting
      HR_lastDate: row.hr_lastdate,
      Hr_lastBy: row.mrh_hrs_lastby,
      HrStaff_Status: row.mrh_hrs_status,
      HrStaff_Condition: row.mrh_hrs_condition,
      HrStaff_Complete: row.mrh_hrs_completed,
      HrStaff_Comment: row.mrh_hrs_comment,
      HrStaff_CBFile: row.mrh_hrs_attach,
      HrStaff_Filename: row.mrh_hrs_file,
      HrStaff_FileNameServer: row.mrh_hrs_fileserver,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetDataDetailStep1 = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    console.log(ReqNo, "GetDataDetailStep1");
    query = `select * from "HR".hrdwmr_person_det where mrpd_category = 'REQUIREMENT' AND mrpd_hreq_no='${ReqNo}'  `;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetDataDetailStep1>>>>");
    const jsonData = result.rows.map((row) => ({
      //Step1
      CB_EmpRequirment: row.mrpd_value,
      SL_EmployeeType: row.mrpd_value_add,
      txt_other: row.mrpd_value_other,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetDataPerson = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    console.log(ReqNo, "GetDataPerson1");
    query = `select *,TO_CHAR(mrp_join_date,'DD/MM/YYYY') as join_date from  "HR".HRDWMR_PERSON where mrp_hreq_no='${ReqNo}' `;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetDataPerson33>>>>");
    const jsonData = result.rows.map((row) => ({
      //Step1
      ReqNo: row.mrp_hreq_no,
      Rec_Id: row.mrp_record_id,
      Req_flg: row.mrp_req_flg,
      Emp_id: row.mrp_emp_id,
      Emp_name: row.mrp_emp_name,
      Emp_sername: row.mrp_emp_sname,
      Emp_Dept: row.mrp_emp_dept,
      Emp_Jobgrade: row.mrp_emp_jgrade,
      ForDept: row.mrp_for_dept,
      Spacial: row.mrp_special,
      experience: row.mrp_experience,
      lang_skill: row.mrp_lang_skill,
      lang_other: row.mrp_lang_other,
      FileName: row.mrp_att_file,
      FileNameServer: row.mrp_att_fileserver,
      //step4
      Flg_Complte: row.mrp_complete_flg,
      Hr_EmpId: row.mrp_new_empid,
      Hr_EmpName: row.mrp_new_name,
      Hr_EmpSername: row.mrp_new_sname,
      Hr_JoinDate: row.join_date,
    }));
    console.log(jsonData.join_date, "jsonData");
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetDataPersonDetail = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    // console.log(ReqNo, "GetDataPerson1");
    query = `select * from "HR".hrdwmr_person_det where mrpd_hreq_no='${ReqNo}' order by mrpd_hreq_no,mrpd_record_id`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetDataPerson>>>>");
    const jsonData = result.rows.map((row) => ({
      ReqNo: row.mrpd_hreq_no,
      Rec_Id: row.mrpd_record_id,
      Category: row.mrpd_category,
      Sl_value: row.mrpd_value,
      txt_Other: row.mrpd_value_other,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.DelDataPersonDetail = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    query = ` delete from  "HR".hrdwmr_person_det
              where mrpd_hreq_no = '${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "DelDataPersonDetail>>>>");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetEmail = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { user } = req.body;
    query = ` select distinct
                hdpm_user_login,
                hdpm_email
              from
                "HR".hrdw_person_master
              where
                hdpm_user_login ='${user}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetEmail>>>>");
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

module.exports.UpdateApprove = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      DeptFlg,
      DeptComment,
      FMGMFlg,
      FMGMComment,
      HrFlg,
      HrComment,
      status,
      ReqNo,
      statusNext,
      UpdateBy,
    } = req.body;
    console.log(req.body, "UpdateApprove");
    query = `update  "HR".HRDWMR_HEADER set
 			        mrh_dept_date = case
                when '${status}' = 'MR0102' then current_timestamp
                else mrh_dept_date
              end,
              mrh_dept_flg = '${DeptFlg}',
              mrh_dept_comment = '${DeptComment}',
              mrh_fm_date = case
                when '${status}' = 'MR0103' then current_timestamp
                else mrh_fm_date
              end,
              mrh_fm_flg = '${FMGMFlg}',
              mrh_fm_comment = '${FMGMComment}',
              mrh_hrm_date = case
                when '${status}' = 'MR0104' then current_timestamp
                else mrh_hrm_date
              end,
              mrh_hrm_flg = '${HrFlg}',
              mrh_hrm_comment = '${HrComment}',
              mrh_update_date=current_timestamp,
              mrh_update_by='${UpdateBy}',
              mrh_req_status='${statusNext}'
              where mrh_req_no ='${ReqNo}'
              `;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetEmail>>>>");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.UpdateReject = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo, statusNext, UpdateBy } = req.body;

    query = `update "HR".HRDWMR_HEADER set
 			        mrh_dept_date = null,
              mrh_dept_flg = '',
              mrh_dept_comment = '',

              mrh_fm_date = null,
              mrh_fm_flg = '',
              mrh_fm_comment = '',

              mrh_hrm_date = null,
              mrh_hrm_flg = '',
              mrh_hrm_comment = '',

              mrh_update_date=current_timestamp,
              mrh_update_by='${UpdateBy}',
              mrh_req_status='${statusNext}'
              where mrh_req_no ='${ReqNo}' `;

    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "GetEmail>>>>");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetConditionForClose = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    // const { Fac_code, Sl_Department } = req.body;
    query = `select hdcm_code,hdcm_desc 
            from "HR".hrdw_code_master hcm 
            where hdcm_group='MR08'	`;
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      value: row.hdcm_code,
      label: row.hdcm_desc,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.SaveDarftHr = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      ReqNo,
      UpdateBy,
      Radio_Status,
      Sl_Condition,
      txt_Comment,
      Cb_AttFile,
      FileName,
      FileNameServer,
      txt_TotalComplete,
      Req_Status,
      UpdateByLast,
    } = req.body;
    console.log(req.body, "SaveDarftHr");
    query = `update  "HR".HRDWMR_HEADER set 
                mrh_req_status='${Req_Status}',
                mrh_hrs_status='${Radio_Status}',
                mrh_hrs_condition='${Sl_Condition}',
                mrh_hrs_lastby='${UpdateByLast}',
                mrh_hrs_by = case
                  when '${UpdateBy}' <> '' then '${UpdateBy}'
                  else mrh_hrs_by
                end,
                mrh_hrs_date = case
                  when '${UpdateBy}' <> '' then current_timestamp
                  else mrh_hrs_date
                end,
                mrh_hrs_lastdate=current_timestamp,
                mrh_hrs_submit=current_timestamp,
                mrh_hrs_comment='${txt_Comment}',
                mrh_hrs_attach='${Cb_AttFile}',
                mrh_hrs_completed =${txt_TotalComplete},
                mrh_hrs_file='${FileName}',
                mrh_update_by='${UpdateByLast}',
                mrh_update_date=current_timestamp
              where mrh_req_no ='${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);

    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error, "error");
  }
};

module.exports.UpdateUserJoin = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      FlgComplete,
      EmpID,
      EmpName,
      EmpSurName,
      EmpJoinDate,
      UpdateBy,
      ReqNo,
      RecId,
    } = req.body;

    query = `update  "HR".HRDWMR_PERSON set
              mrp_complete_flg='${FlgComplete}',
              mrp_new_empid='${EmpID}',
              mrp_new_name='${EmpName}',
              mrp_new_sname='${EmpSurName}',
              mrp_join_date = CASE 
                WHEN '${EmpJoinDate}' IS NULL OR '${EmpJoinDate}' = 'null' THEN NULL
                ELSE TO_DATE('${EmpJoinDate}', 'DD/MM/YYYY')
                end ,
              mrp_update_date=current_timestamp,
              mrp_update_by='${UpdateBy}'
            where 1=1
            and mrp_hreq_no='${ReqNo}'
            and mrp_record_id ='${RecId}'`;

    console.log(query);
    const result = await client.query(query);
    console.log(result.rows, "UpdateUserJoin>>>>");
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports.GetHrStarff = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User } = req.body;
    query = `select *  from "HR".hrdw_person_master t
            where t.hdpm_for = 'MAN POWER' and 
            hdpm_level ='HR STAFF' and 
            hdpm_user_login ='${User}'`;
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      User: row.hdpm_user_login,
      Roll: row.hdpm_level,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.UploadSub = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { fileData, ReqNo } = req.body;
    console.log(fileData,'HA')
    const buffer = Buffer.from(fileData, 'base64'); 
    query = `
      UPDATE "HR".HRDWMR_HEADER SET 
      mrh_subs_fileserver = $1
      WHERE mrh_req_no = $2`;
    const result = await client.query(query, [buffer, ReqNo]);
    console.log('HAHAHAHA :', result);
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

module.exports.HomeStatusCountManPower = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { UserLogin, Roll } = req.body;
    query = `
      SELECT COUNT(*) AS total, 'Create' AS status
      FROM "HR".HRDWMR_HEADER
      WHERE mrh_req_status = 'MR0101'
        AND mrh_req_by = '${UserLogin}'

      UNION ALL

      SELECT COUNT(*) AS total, 'WaitDeptApprove' AS status
      FROM "HR".HRDWMR_HEADER
      WHERE mrh_req_status = 'MR0102'
        AND mrh_dept_by = '${UserLogin}'

      UNION ALL

      SELECT COUNT(*) AS total, 'WaitFMGMApprove' AS status
      FROM "HR".HRDWMR_HEADER
      WHERE mrh_req_status = 'MR0103'
        AND mrh_fm_by = '${UserLogin}'

      UNION ALL

      SELECT COUNT(*) AS total, 'WaitHRManagerApprove' AS status
      FROM "HR".HRDWMR_HEADER
      WHERE mrh_req_status = 'MR0104'
        AND mrh_hrm_by = '${UserLogin}'

      UNION ALL

      SELECT 
          CASE 
              WHEN '244' = ${Roll} THEN
                  (SELECT COUNT(*) 
                  FROM "HR".HRDWMR_HEADER
                  WHERE mrh_req_status IN ('MR0105', 'MR0106'))
              ELSE 0
          END AS total,
          'WaitHRStaff' AS status`;
console.log(query, "HomeStatusCountManPower");
    const result = await client.query(query);

    const separatedData = result.rows.map(row => ({ [row.status]: row.total }));

    // คำนวณ total รวมของทุก object
    const totalSum = result.rows.reduce((sum, row) => sum + parseInt(row.total, 10), 0);
    
    // เพิ่ม total รวมเข้าไปใน array
    separatedData.push({ Total: totalSum });
    
    res.status(200).json(separatedData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
    console.log(error.message,'UploadFileDetail');
  }
};

