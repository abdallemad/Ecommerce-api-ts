import CustomErrors from "../errors/index";

const checkPermission = (requestUser:{id:string,role:string},resourceUserId:string) =>{
  if(requestUser.role == 'admin') return 
  if(requestUser.id == resourceUserId) return 
  throw new CustomErrors.UnauthorizedError('Access Forbidden')
}

export default checkPermission;