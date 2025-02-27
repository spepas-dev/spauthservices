const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");


exports.ADD_MEPA = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;
  
   // body.added_by = user.User_ID;
    if(!body.User_ID )
        {
            body.User_ID = user.User_ID;
        }else{
            //TODO: Validate if the user has the permission to profile mepa details
        }
   


        var locObj = {
            type: "Point",
            coordinates: [body.longitude, body.latitude]
    }

 let reqBody = {
    User_ID: body.User_ID,
    address: body.address,
    shop_name: body.shop_name,
    location: locObj
 }




   var updateURL = process.env.DB_BASE_URL +"mepa/add"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, reqBody);



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
    message : "Mepa details added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})