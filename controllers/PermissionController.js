const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");

exports.ADD_PERMISSIONS = asynHandler(async (req, res, next) => {

  
   
    let {body,user} = req;
  
   

    body =  body.map(permission =>{

        return {
            ...permission,
            added_by: user.User_ID
        }
    } );


      

   var updateURL = process.env.DB_BASE_URL +"permission/add"; 

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
    message : "Permissions added successfully"
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.ALL_PERMISSIONS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;



  var loginUrl = process.env.DB_BASE_URL +"permission/all"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);


  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }

    

   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: newJob.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})
