const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");



exports.ADD_IDENTIFICATION = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;
  
    body.added_by = user.User_ID;
    if(!body.User_ID )
        {
            body.User_ID = user.User_ID;
        }else{
            //TODO: Validate if the user has the permission to profile identification details
        }
   


   var updateURL = process.env.DB_BASE_URL +"identification/add"; 

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
    message : "Identification details added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.USER_IDENTIFICATION = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"identification/user-identifications/"+user_id; 
 
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



exports.MY_IDENTIFICATION = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    //let {user_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"identification/user-identifications/"+user.User_ID; 
 
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

