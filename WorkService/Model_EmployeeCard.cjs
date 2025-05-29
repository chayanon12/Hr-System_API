const {
  ConnectPG_DB,
  DisconnectPG_DB,
  ConnectOracleDB,
  DisconnectOracleDB,
} = require("../Conncetion/DBConn.cjs");
const oracledb = require("oracledb");
const { writeLogError } = require("../Common/LogFuction.cjs");

module.exports.GetSearchRequest = async function (req, res) {
  var query = "";
  try {
    const client = await ConnectPG_DB();
    const {
      factory,
      req_no_from,
      req_no_to,
      req_date_from,
      req_date_to,
      req_by,
      reason,
      dept,
    } = req.body;
    query = `select 
                cfm.factory_name as factory,
                hrdh.cdh_req_dept as dept,
                hrdh.cdh_req_no as req_no,
                hcm_reason.hdcm_desc as reason,
                hrdh.cdh_req_by || ' : ' || INITCAP(cuh.ename) || ' ' || INITCAP(cuh.esurname) as request_by,
                to_char(hrdh.cdh_req_date ,'DD/MM/YY') as request_date,
                hcm_status.hdcm_desc as request_status,
                hrdh.cdh_update_by as last_action_by,
                to_char(hrdh.cdh_update_date,'DD/MM/YY') as last_action_date
            from "HR".hrdwcd_header hrdh
            left join "CUSR".cu_factory_m cfm on hrdh.cdh_factory = cfm.factory_code 
            left join "CUSR".cu_user_humantrix cuh on hrdh.cdh_create_by = cuh.empcode
            left join "HR".hrdw_code_master hcm_reason on hcm_reason.hdcm_code = hrdh.cdh_reason
            left join "HR".hrdw_code_master hcm_status on hcm_status.hdcm_code = hrdh.cdh_req_status
            where ( '${factory}' IS NULL OR '${factory}' = '' OR cfm.factory_name = '${factory}' )
            AND
            (
                ('${req_no_from}' IS NULL OR '${req_no_from}' = '' OR hrdh.cdh_req_no >= '${req_no_from}') AND
                ('${req_no_to}' IS NULL OR '${req_no_to}' = '' OR hrdh.cdh_req_no <='${req_no_to}')
            )
            AND 
            (
                ('${req_date_from}' IS NULL OR '${req_date_from}' = '' OR hrdh.cdh_req_date::date >= TO_DATE('${req_date_from}', 'DD/MM/YYYY')) AND
             ('${req_date_to}' IS NULL OR'${req_date_to}' = '' OR hrdh.cdh_req_date::date <= TO_DATE('${req_date_to}', 'DD/MM/YYYY'))
            )
            and ( '${req_by}' IS NULL OR '${req_by}' = '' OR hrdh.cdh_req_by = '${req_by}')
            and ( '${reason}'IS NULL OR '${reason}' = '' OR hrdh.cdh_reason = '${reason}')
            and ( '${dept}' IS NULL OR '${dept}' = '' OR hrdh.cdh_req_dept = '${dept}')
                    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
};
module.exports.GetPersonForApproval = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    const { factory,dept } = req.body;
    query = `
            select t.hdpm_user_login as user_login
            from "HR".hrdw_person_master t 
            where t.hdpm_for = 'CARD' 
              and t.hdpm_level  = 'SV' 
              and t.hdpm_person_sts  = 'A' 
              and t.hdpm_factory  = '${factory}'
              and t.hdm_dept = '${dept}' --t.hdpm_factory  = '2000' and t.hdm_dept = 'FIN'	
            order by t.hdpm_priority ,t.hdpm_user_login	
    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
}
module.exports.GetDescStaffAction = async function (req, res) {
  let query = "";
  try {
    const client = await ConnectPG_DB();
    query = `
           select cm.hdcm_code,cm.hdcm_desc 
            from "HR".hrdw_code_master cm
            where cm.hdcm_group = 'CD03' 
            and cm.hdcm_status  = 'A' 
            order by cm.hdcm_group,cm.hdcm_sort,cm.hdcm_desc;

    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
    await DisconnectPG_DB(client);
  } catch (error) {
    writeLogError(error.message, query);
    res.status(500).json({ message: error.message });
  }
}
// module.exports.GetDescStaffAction = async function (req, res) {