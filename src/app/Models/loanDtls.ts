import { transDT } from './transaction';
/* eslint-disable @typescript-eslint/naming-convention */
export class LoanDtls{
  activity: string;
  ardb_branch_cd: string;
  ardb_branch_name: string;
  ardb_cd: string;
  ardb_name: string;
  br_block: string;
  branch_address: string;
  curr_intt: number;
  curr_intt_demand: number;
  curr_prn: number;
  curr_prn_demand: number;
  cust_cd: number;
  cust_name: string;
  data_imp_dt: Date;
  disb_amt: number;
  guardian_name: string;
  last_disb_date: Date;
  last_intt_calc_dt: Date;
  lat_pos?: any;
  lf_no: string;
  loan_acc_cd: number;
  loan_acc_name: string;
  long_pos?: any;
  ovd_intt: number;
  ovd_intt_demand: number;
  ovd_prn: number;
  ovd_prn_demand: number;
  paid_flag: string;
  penal_intt: number;
  penal_intt_demand: number;
  sector: string;
  service_area: string;
  update_by?: any;
  update_dt?: any;
  village: string;
  r_amt: any;
  acc_num: number;
  trans_dt: transDT[];
}
