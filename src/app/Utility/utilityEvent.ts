export class UtilityM{
 static preventNonNumeric(e){
  const pattern = /^([0-9])$/;
  const inputChar = String.fromCharCode(e.charCode);
  if (!pattern.test(inputChar)) {
    e.preventDefault();
  }
  }
}
