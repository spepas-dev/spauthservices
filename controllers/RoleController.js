const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");


exports.ADD_NEW_ROLE = asynHandler(async (req, res, next) => {

  
   
    let {body,user} = req;
  
    body.added_by = user.User_ID;

    body.rolePermissions =  body.rolePermissions.map(permissiom =>{

        return {
            ...permissiom,
            added_by: user.User_ID
        }
    } );


      

   var updateURL = process.env.DB_BASE_URL +"role/add"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, body);



   if(!newUserUpdate)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to database services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }



       if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
        }



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Role added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.ADD_ROLE_PERMISSIONS = asynHandler(async (req, res, next) => {

  
   
    let {body,user} = req;
  

    body =  body.map(permissiom =>{

        return {
            ...permissiom,
            added_by: user.User_ID
        }
    } );


      

   var updateURL = process.env.DB_BASE_URL +"role/add-role-permissions"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, body);



   if(!newUserUpdate)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to database services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }



       if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
        }



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Permissions added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})




exports.ALL_ROLE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
  


      

   var updateURL = process.env.DB_BASE_URL +"role/all"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("GET",updateURL);



   if(!newUserUpdate)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to database services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }



       if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
        }



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Sucessful",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})
