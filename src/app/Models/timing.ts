/* eslint-disable @typescript-eslint/naming-convention */
export default class Atttiming{
  public ardb_id: any;
  public check_in: string;
  public check_out: string;
  public created_by: string;
  public created_dt: string;
  public  emp_code: string;
  public lat_pos: string;
  public long_pos: string;
  public modified_by: string;
  public modified_dt: string;
  constructor(){
    this.ardb_id = '';
    this.check_in = null;
    this.check_out = null;
    this.lat_pos = '';
    this.long_pos = '';
  }
}
