
const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const jwt = require('jsonwebtoken');




exports.ADD_APPLICATION = asynHandler(async (req, res, next) => {

  
    console.log("XXXXXXXXXXXXXXXXXXXXX");
    let {body,user} = req;
  
    body.added_by = user.User_ID;




      

   var updateURL = process.env.DB_BASE_URL +"application/add"; 

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
    message : "Application added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.UPDATE_APPLICATION = asynHandler(async (req, res, next) => {

  
   
    let {body,user} = req;
  
    let {application_id, name} = body;


  var loginUrl = process.env.DB_BASE_URL +"application/by-id/"+application_id; 
 
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

     newJob.data.name = name;
     newJob.data.added_by = user.User_ID;



      

   var updateURL = process.env.DB_BASE_URL +"application/update"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, newJob.data);



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
    message : "Application updated successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.ADD_APPLICATION_MENUS = asynHandler(async (req, res, next) => {

  
   
    let {body,user} = req;
  
    let {application_id, menus} = body;


    menus =  menus.map(menu => {
        
        return {
          ...menu, 
          added_by: user.User_ID,
          application_id: application_id
        };
      
    });


  

      

   var updateURL = process.env.DB_BASE_URL +"application/add-menus"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, menus);



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
    message : "Application menus addedd successfully"
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.ALL_APPLICATION = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
  



  var loginUrl = process.env.DB_BASE_URL +"application/all"; 
 
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

