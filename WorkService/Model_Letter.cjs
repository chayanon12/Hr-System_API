const {
  ConnectPG_DB,
  DisconnectPG_DB,
  ConnectOracleDB,
  DisconnectOracleDB,
} = require("../Conncetion/DBConn.cjs");
const oracledb = require("oracledb");
const { writeLogError } = require("../Common/LogFuction.cjs");

// Letter

module.exports.GetDataPersonByIDCode = async function (req, res) {
  var query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    let dept = "";
    let Email = "";
    const { Id_Code } = req.body;
    query = `  select  t.ename ||' '||t.esurname as name_surname,																					
                t.work_location as factory,																					
                f.factory_code as factory_code,																					
                t.cost_center as costcenter,																					
                t.pos_grade as jobgrade,																					
                to_char(t.join_date,'DD/MM/YYYY') as joindate,																					
                t.worktype as emptype,
                m.USER_LOGIN AS login
                from cusr.cu_user_humantrix t 		
                INNER JOIN cusr.cu_user_m m ON USER_EMP_ID = EMPCODE
                , cusr.cu_factory_m f															
                WHERE 1=1 
               	AND  t.work_location = f.factory_name																					
                AND t.empcode =   '${Id_Code}'`;
    const result = await Conn.execute(query);
    console.log(result.rows, "may");
    if (result.rows.length > 0) {
      dept = await GetDept(result.rows[0][3]);
      console.log(dept, "maydept");
      Email = await GeteMail(Id_Code);
      console.log(Email, "mayEmail");
    }
    const jsonData = result.rows.map((row) => ({
      name_surname: row[0],
      factory: row[1],
      factory_code: row[2],
      costcenter: row[3],
      jobgrade: row[4],
      joindate: row[5],
      emptype: row[6],
      dept: dept,
      email: Email,
      User: row[7],
    }));
    console.log(jsonData, "json");
    res.status(200).json(jsonData);
    DisconnectOracleDB(Conn);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

async function GetDept(CC) {
  console.log("GetDept", CC);
  let query = "";
  try {
    const client = await ConnectPG_DB();
    let Dept = "";
    query = ` select cc.hdcd_dept from "HR".hrdw_cc_map_dept cc where cc.hdcd_cc = '${CC}'`;
    const result = await client.query(query);
    console.log(result.rows);
    if (result.rows.length > 0) {
      Dept = result.rows[0].hdcd_dept;
    }
    await DisconnectPG_DB(client);
    return Dept;
  } catch (error) {
    writeLogError(error.message, query);
    return error.message;
  }
}

async function GeteMail(IdCode) {
  console.log("GeteMail", IdCode);
  let query = "";
  try {
    const Conn = await ConnectOracleDB("CUSR");
    let Email = "";
    query = ` select m.user_email from cusr.cu_user_m m where m.user_emp_id =  '${IdCode}'`;
    const result = await Conn.execute(query);
    console.log(result.rows);
    if (result.rows.length > 0) {
      Email = result.rows[0][0];
    }
    DisconnectOracleDB(Conn);
    return Email;
  } catch (error) {
    writeLogError(error.message, query);
    return error.message;
  }
}

module.exports.GenReqNo = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { FacDesc, FacValue } = req.body;
    // const formattype = `(${type.map((s) => `'${s}'`).join(", ")})`;
    query = `SELECT 
              'R-' || '${FacDesc}' || '-' || TO_CHAR(CURRENT_DATE, 'YYMM') || '-' ||
              TO_CHAR(COALESCE(MAX(CAST(SUBSTR(lth_req_no, 11, 3) AS INTEGER)), 0) + 1, 'FM000') AS RUNNING
               FROM "HR".HRDWLT_HEADER
                WHERE 1=1
                and lth_factory = '${FacValue}'
                and substring(lth_req_no,6,4) = TO_CHAR(CURRENT_DATE, 'YYMM')`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      ReqNo: row.running,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetSupervisorUp = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac, Dept } = req.body;
    console.log(Fac, Dept, "mmmmm");
    query = `select t.hdpm_user_login 
            from "HR".hrdw_person_master t 
            where t.hdpm_for = 'LETTER' 
            and t.hdpm_level  = 'SV' 
            and t.hdpm_person_sts  = 'A' 
            and t.hdpm_factory  = '${Fac}'
            and t.hdm_dept = '${Dept}'
            order by t.hdpm_priority ,t.hdpm_user_login`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      label: row.hdpm_user_login,
      value: row.hdpm_user_login,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.InsSendSubmit = async function (req, res) {
  let client;
  let query;
  try {
    client = await ConnectPG_DB();
    const {
      ReqNo,
      Fac_value,
      Stats_value,
      ReqBy,
      Dept,
      Tel,
      Email,
      TargetDate,
      Remark,
      Supervisor,
      User,
    } = req.body;

    query = ` insert into "HR".HRDWLT_HEADER(
                        lth_req_no,
                        lth_factory,
                        lth_req_status,
                        lth_req_by,
                        lth_req_date,
                        lth_send_date,
                        lth_req_dept,
                        lth_req_email,
                        lth_req_tel,
                        lth_target_date, 	
                        lth_remark,
                        lth_sv_by,
                        lth_create_date,
                        lth_create_by,
                        lth_update_date,
                        lth_update_by)
                      values(
                        '${ReqNo}',
                        '${Fac_value}',
                        'LT0102',
                        '${ReqBy}',
                        current_timestamp,
                        current_timestamp,
                        '${Dept}',
                        '${Email}',
                        '${Tel}',
                        TO_DATE('${TargetDate}', 'DD/MM/YYYY'),
                        '${Remark}',
                        '${Supervisor}',
                        current_timestamp,
                        '${User}',
                        current_timestamp,
                        '${User}')`;
    console.log(query);
    const result = await client.query(query);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.InsSendSubmit2 = async function (req, res) {
  let client;
  let query;
  try {
    client = await ConnectPG_DB();
    const { ReqNo, letter_type, detail, ReqBy } = req.body;

    query = `insert into "HR".HRDWLT_LETTER(
            ltl_hreq_no,
            ltl_letter_type,
            ltl_detail,
            ltl_create_date,
            ltl_create_by,
            ltl_update_date,
            ltl_update_by)
          values(
            '${ReqNo}',
            '${letter_type}',
            '${detail}',
            current_timestamp,
            '${ReqBy}',
            current_timestamp,
            '${ReqBy}' )`;
    console.log(query);
    const result = await client.query(query);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDataHeaderLetter = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    query = `select lth_req_no ,
              lth_factory,
              M.factory_name as FAC_DESC,
              lth_req_status,
              C.hdcm_desc as STS_DESC,
              lth_req_by,
              to_char(lth_req_date,'DD/MM/YYYY') as Reqdate,
              lth_req_dept,
              lth_req_email,
              lth_req_tel,
              to_char(lth_target_date,'DD/MM/YYYY') as target_date,
              lth_remark,
              lth_sv_by,
              to_char(lth_sv_date,'DD/MM/YYYY') as sv_date,
              lth_sv_flg,
              lth_sv_comment,
              lth_hrs_lastby,
              to_char(lth_hrs_lastdate,'DD/MM/YYYY') as last_hr_date,
              lth_hrs_status,
              lth_hrs_condition,
              lth_hrs_comment,
              lth_receive_by,
              lth_receive_tel,
              lth_receive_email,
              to_char(lth_receive_date,'DD/MM/YYYY') as receive_date,
               to_char(lth_hrs_confirm,'DD/MM/YYYY') as confirm_date
              from "HR".HRDWLT_HEADER H
              INNER JOIN "CUSR".cu_factory_m M ON H.lth_factory = M.factory_code
              INNER JOIN "HR".hrdw_code_master C ON H.lth_req_status = C.hdcm_code
              where lth_req_no ='${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      //step1
      ReqNo: row.lth_req_no,
      Fac_value: row.lth_factory,
      Fac_desc: row.fac_desc,
      Status_value: row.lth_req_status,
      Status_desc: row.sts_desc,
      Reqby_id: row.lth_req_by,
      ReqDate: row.reqdate,
      Dept: row.lth_req_dept,
      Email: row.lth_req_email,
      Tel: row.lth_req_tel,
      Target_Date: row.target_date,
      //step2
      Remark: row.lth_remark,
      Sv_by: row.lth_sv_by,
      Sv_flg: row.lth_sv_flg,
      Sv_date: row.sv_date,
      Sv_Comment: row.lth_sv_comment,
      //step3
      Hr_lastby: row.lth_hrs_lastby,
      Hr_lastdate: row.last_hr_date,
      Hr_Status: row.lth_hrs_status,
      Hr_Condition: row.lth_hrs_condition,
      Hr_ConfirmAcDate: row.confirm_date,
      Hr_comment: row.lth_hrs_comment,
      Hr_ResiveBy: row.lth_receive_by,
      Hr_ResiveDate: row.receive_date,
      Hr_ResiveTel: row.lth_receive_tel,
      Hr_ResiveEmail: row.lth_receive_email,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetLetterType = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { ReqNo } = req.body;
    query = `	select ltl_hreq_no,ltl_letter_type,ltl_detail from "HR".HRDWLT_LETTER where ltl_hreq_no  ='${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      ReqNo: row.ltl_hreq_no,
      LetterType: row.ltl_letter_type,
      LetterDetail: row.ltl_detail,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.UpdateSvApprove = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Sv_Radio, Sv_Comment, ReqNo, Sv_by, Status } = req.body;
    query = `update "HR".HRDWLT_HEADER set
              lth_sv_date=current_timestamp,
              lth_req_status='${Status}',
              lth_sv_flg='${Sv_Radio}',
              lth_sv_comment='${Sv_Comment}',
              lth_update_date=current_timestamp,
              lth_update_by='${Sv_by}'
             where lth_req_no ='${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);

    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

//

module.exports.GetConditionClose = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    query = `select hdcm_code,hdcm_desc from "HR".hrdw_code_master hcm where hdcm_group='LT03'`;
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

module.exports.UpdateHrStaff = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      status,
      rd_status,
      sl_condition,
      hr_by,
      date_confirm,
      hr_comment,
      receive_by,
      receive_email,
      receive_date,
      receive_tel,
      lastBy,
      last_date,
      date_submit,
      ReqNo
    } = req.body;
    query = `update
                "HR".HRDWLT_HEADER
              set
                lth_req_status = '${status}',
                lth_hrs_status ='${rd_status}',
                lth_hrs_condition ='${sl_condition}',
                lth_hrs_by  ='${hr_by}',
                lth_hrs_date  = current_timestamp,
                lth_hrs_confirm = TO_DATE(${date_confirm}, 'YYYY-MM-DD'),
                lth_hrs_comment = '${hr_comment}',
                lth_receive_by = '${receive_by}',
                lth_receive_email = '${receive_email}',
                lth_receive_date = TO_DATE(${receive_date}, 'YYYY-MM-DD'),
                lth_receive_tel  = '${receive_tel}',
                lth_hrs_lastby ='${lastBy}', --เก็บเมื่อ สถานะ onpocessขึ้นไป
                lth_hrs_lastdate = TO_DATE(${last_date}, 'YYYY-MM-DD'), --เก็บเมื่อ สถานะ onpocessขึ้นไป
                lth_hrs_submit =  TO_DATE(${date_submit}, 'YYYY-MM-DD'),--เก็บเมื่อ กดclose
                lth_update_date = current_timestamp, 
                lth_update_by  ='${hr_by}'
              where
                lth_req_no = '${ReqNo}'`;
    console.log(query);
    const result = await client.query(query);

    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetDepartmentApprove = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { User_login } = req.body;
    query = `	select distinct pmm.hdm_dept 
              from "HR".hrdw_person_master pmm 
              where pmm.hdpm_for = 'LETTER' 
	              and pmm.hdpm_person_sts  = 'A' 
	              and pmm.hdpm_level='SV'
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

module.exports.GetDeptallFac = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { Fac } = req.body;
    query = `select
              t.hddm_dept
            from
              "HR".hrdw_dept_master t
            where
              t.hddm_status = 'A'
              and t.hddm_factory = '${Fac}'
            order by
              t.hddm_sort,
              t.hddm_dept`;
    const result = await client.query(query);
    console.log(result.rows, "GetDepartment");
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

module.exports.GetStatusSearch = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const { type } = req.body;
    const formattype = `(${type.map((s) => `'${s}'`).join(", ")})`;
    query = `select cm.hdcm_code,cm.hdcm_desc																																											
            from "HR".hrdw_code_master cm																																											
            where cm.hdcm_group = 'LT01'																																											
            and cm.hdcm_status  = 'A'
            and cm.hdcm_cmmt1 in ${formattype}
            order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc `;
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

module.exports.GetLetterTypeSearch = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    query = `select
              cm.hdcm_code,
              cm.hdcm_desc
            from
              "HR".hrdw_code_master cm
            where
              cm.hdcm_group = 'LT02'
              and cm.hdcm_status = 'A'
            order by
              cm.hdcm_group,
              cm.hdcm_sort,
              cm.hdcm_desc`;
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

module.exports.SearchLetter = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      Fac,
      dept,
      reqfrom,
      reqto,
      datefrom,
      dateto,
      reqby,
      approveby,
      type,
      status
    } = req.body;
    console.log(req.body,'mmmmmmm')
    const formattedStatus = status && status.length > 0
    ? `(${status.map((s) => `'${s}'`).join(', ')})`
    :[];
    query = `select
                f.factory_name as FAC,
                h.lth_req_dept as dept,
                h.lth_req_no as req_no,
            string_agg(cm.hdcm_desc, ' , ' order by cm.hdcm_desc) as letter_types,
                h.lth_req_by || ' : ' || m.user_fname || ' ' ||  m.user_surname as req_by,
            to_char(h.lth_req_date,'DD/MM/YY') as req_date,
                c.hdcm_desc as status,
                h.lth_update_by as last_by,
            to_char(h.lth_update_date,'DD/MM/YY') as last_date,
            h.lth_req_status as status_value
            from "HR".HRDWLT_HEADER H
            inner join "CUSR".cu_factory_m F  on h.lth_factory = f.factory_code
            inner join "CUSR".cu_user_m M on h.lth_req_by =  m.user_emp_id
            inner join "HR".hrdw_code_master C  on h.lth_req_status = c.hdcm_code
            inner join "HR".HRDWLT_LETTER L on h.lth_req_no = l.ltl_hreq_no
            inner join "HR".hrdw_code_master cm on l.ltl_letter_type = cm.hdcm_code
            where 1=1
            and (h.lth_factory = ${Fac} OR ${Fac} IS null)
            AND (${dept} IS NULL OR h.lth_req_dept = ANY (${dept}))
            AND (h.lth_req_no >= ${reqfrom} OR ${reqfrom}  IS NULL)
            AND (h.lth_req_no <= ${reqto} OR ${reqto}  IS NULL)
            AND (TO_CHAR(h.lth_req_date , 'YYYY-MM-DD') >= ${datefrom} OR ${datefrom} IS NULL)
            AND (TO_CHAR(h.lth_req_date , 'YYYY-MM-DD') <= ${dateto} OR ${dateto} IS NULL)
            and (h.lth_req_by = ${reqby} OR ${reqby} IS null)
            and (h.lth_sv_by= ${approveby} OR ${approveby} IS null)
            AND (${type} IS NULL OR l.ltl_letter_type = ANY (${type}))
            AND (${formattedStatus} IS NULL OR C.hdcm_code in ${formattedStatus})
            group by
                f.factory_name,
                h.lth_req_dept,
                h.lth_req_no,
                h.lth_req_by,
                m.user_fname,
                m.user_surname,
                h.lth_req_date,
                c.hdcm_desc,
                h.lth_update_by,
                h.lth_update_date`;
                console.log(query)
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      Factory: row.fac,
      Dept: row.dept,
      ReqNo: row.req_no,
      LetterType: row.letter_types,
      ReqBy: row.req_by,
      ReqDate: row.req_date,
      Status: row.status,
      LastBy: row.last_by,
      LastDate: row.last_date,
      Status_value: row.status_value,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};


module.exports.GetFactoryLetter = async function (req, res) {
  var query = "";
  try {
    const { Roll,User_login } = req.body;
    const client = await ConnectPG_DB();
    console.log(Roll,'nnnn')
    if(Roll==''){
      query = `select f.factory_code as fac_code,
                f.factory_name as fac_desc
                from "CUSR".CU_USER_M  m
                inner join "CUSR".cu_factory_m f
                on m.user_site = f.factory_code
                where m.USER_LOGIN = '${User_login}'`;
    }
    else{
      query = `select distinct f.factory_name as fac_desc,pmm.hdpm_factory  as fac_code
               from "HR".hrdw_person_master pmm ,"CUSR".cu_factory_m f																																																
               where pmm.hdpm_factory = f.factory_code  
               and pmm.hdpm_person_sts = 'A' 
               and pmm.hdpm_user_login = '${User_login}'`;
    }
 console.log(query,'tttttttttttttt')
    const result = await client.query(query);
    console.log(result.rows);
    const jsonData = result.rows.map((row) => ({
      label: row.fac_desc,
      value: row.fac_code,
    }));
    res.status(200).json(jsonData);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};

module.exports.GetHrStarffLetter = async function (req, res) {
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