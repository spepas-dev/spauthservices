
const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const jwt = require('jsonwebtoken');


exports.LOGIN = asynHandler(async (req, res, next) => {

  
    
    let {email, password} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/login"; 
  
      var requestData = {
        email,
        password
      }
 
    
 
    console.log("================coming to make a request================")
    let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,requestData);
    console.log("================after request================")
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }



         //JWT_TOKEN

         if(newJob.data.verificationStatus != RESPONSE_CODES.SUCCESS){
            //user is not verified generate OTP verification 
            //TO - DO 
            //1. Call the OTPManager to generate otp and send to user
            let phoneNumber = newJob.data.phoneNumber;
            let email =  newJob.data.email;


            var otpUrl = process.env.OTP_SERVICES_URL +"create"; 
            var otpReqObj = {
                counterType: "MINUTE",
                sendSms: 1,
                phoneNumber: phoneNumber,
                sendEmail: 1,
                emailMessage: "",
                smsMessage:"",
                expiryCounter: 10,
                User_ID: newJob.data.User_ID
            }
           
            let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);

            if(!otpReqResp)
                {
                    var resp = {
                        status : RESPONSE_CODES.FAILED,
                        message : "Failed to connect to otp services"
                    };
                    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
                }

                    
         if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
         }



            var resetID = otpReqResp.data;

            var resp = {
                status : RESPONSE_CODES.PENDING_REVIEW,
                message : "User verification is pending. An OTP has been sent to the user for authentication",
                data : resetID
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }



         var tokenDetails = {
            User_ID : newJob.data.User_ID
         }

         const token = jwt.sign(tokenDetails, process.env.JWT_TOKEN, { expiresIn: '10h' });
         const refresh_token = jwt.sign(tokenDetails, process.env.JWT_TOKEN_REFRESH, { expiresIn: '20h' });

         

         delete newJob.data.id;
         delete newJob.data.User_ID;
         delete newJob.data.password;

         var resData =  {
            token : token,
            user: newJob.data,
            refresh_token:refresh_token
         };

    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : resData
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })
 
 


 exports.ADMIN_LOGIN = asynHandler(async (req, res, next) => {

  
    
    let {email, password} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/login"; 
  
      var requestData = {
        email,
        password
      }
 
    
 
  
    let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,requestData);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }


          if(newJob.data.user_type != "ADMIN")
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Invalid access"
                };
                return UtilityHelper.sendResponse(res, 200, resp.message, resp);
            }
     


         var tokenDetails = {
            User_ID : newJob.data.User_ID
         }

         const token = jwt.sign(tokenDetails, process.env.JWT_TOKEN, { expiresIn: '10h' });
         const refresh_token = jwt.sign(tokenDetails, process.env.JWT_TOKEN_REFRESH, { expiresIn: '20h' });

         

         delete newJob.data.id;
         delete newJob.data.User_ID;
         delete newJob.data.password;

         var resData =  {
            token : token,
            user: newJob.data,
            refresh_token:refresh_token
         };

    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : resData
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })
 



 exports.REGISTER = asynHandler(async (req, res, next) => {

  
    console.log("XXXXXXXXXXXXXXXXXXXXX");
   let user = req.body;



  var registerUrl = process.env.DB_BASE_URL +"user/register"; 
 
  
   


   let newJob = await UtilityHelper.makeHttpRequest("POST",registerUrl,user);



       if(!newJob)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }

          
        if(newJob.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
        }



        //JWT_TOKEN
         //user is not verified generate OTP verification 
           //TO - DO 
           //1. Call the OTPManager to generate otp and send to user





           
           let phoneNumber = newJob.data.phoneNumber;
           let email =  newJob.data.email;


           

            var otpUrl = process.env.OTP_SERVICES_URL +"create"; 
            var otpReqObj = {
                counterType: "MINUTE",
                sendSms: 1,
                phoneNumber: phoneNumber,
                sendEmail: 1,
                emailMessage: "",
                smsMessage:"",
                expiryCounter: 10,
                User_ID: newJob.data.User_ID,
                email: email
            }
           
            let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);

            if(!otpReqResp)
                {
                    var resp = {
                        status : RESPONSE_CODES.FAILED,
                        message : "Failed to connect to otp services"
                    };
                    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
                }

                    
         if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
         }



            var resetID = otpReqResp.data;


           var resp = {
               status : RESPONSE_CODES.SUCCESS,
               message : "User registered, a verification code has been sent to your phone number or email to complete the process",
               data : resetID
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})









exports.ACTIVATE = asynHandler(async (req, res, next) => {

  
   
   let {otp, otpID} = req.body;




 

   var otpUrl = process.env.OTP_SERVICES_URL +"validate"; 
   var otpReqObj = {
    otp,
    otpID
   }
  
   let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);

   if(!otpReqResp)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to otp services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }

       console.log("XXXXXXXXXXXXXXXXXXXXX After validation");
           
if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
   return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
}

console.log(otpReqResp);
var user_ID = otpReqResp.data.User_ID;



  var loginUrl = process.env.DB_BASE_URL +"user/by-id/"+user_ID; 
 
    


   let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);



       if(!newJob)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to user services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }

          
        if(newJob.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
        }

       

        let userToUpdate = newJob.data;
        userToUpdate.status = RESPONSE_CODES.SUCCESS;
        userToUpdate.verificationStatus = RESPONSE_CODES.SUCCESS;


        var updateURL = process.env.DB_BASE_URL +"user/update"; 

        let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, userToUpdate);



        if(!newUserUpdate)
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Failed to connect to user update services"
                };
                return UtilityHelper.sendResponse(res, 200, resp.message, resp);
            }


   
            if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
                return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
             }
     





        var tokenDetails = {
           User_ID : newUserUpdate.data.User_ID
        }

        const token = jwt.sign(tokenDetails, process.env.JWT_TOKEN, { expiresIn: '10h' });
        const refresh_token = jwt.sign(tokenDetails, process.env.JWT_TOKEN_REFRESH, { expiresIn: '20h' });

        delete newUserUpdate.data.id;
        delete newUserUpdate.data.User_ID;
        delete newUserUpdate.data.password;

        var resData =  {
           token : token,
           user: newUserUpdate.data,
           refresh_token: refresh_token
        };

   var resp = {
       status : RESPONSE_CODES.SUCCESS,
       message : "Success",
       data : resData
   };

   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})






exports.CHANGE_PASSWORD = asynHandler(async (req, res, next) => {

  
    console.log("XXXXXXXXXXXXXXXXXXXXX");
    let {body,user} = req;
   let {newPassword, oldPassword} = body;


   oldPassword = UtilityHelper.sha256Encrypt(oldPassword);


   if(user.password != oldPassword){
    var resp = {
        status : RESPONSE_CODES.FAILED,
        message : "Invalid password"
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
   }
   

   user.password = UtilityHelper.sha256Encrypt(newPassword);



      

   var updateURL = process.env.DB_BASE_URL +"user/update"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, user);



   if(!newUserUpdate)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to user update services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }



       if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
        }



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Password changed successfully"
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.FORGOT_PASSWORD = asynHandler(async (req, res, next) => {

  
    console.log("XXXXXXXXXXXXXXXXXXXXX");
    let {body} = req;
   let {email} = body;




   var loginUrl = process.env.DB_BASE_URL +"user/by-email/"+email; 
 
    


   let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);



       if(!newJob)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to user services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }

          
        if(newJob.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
        }
        let user = newJob.data;






        let phoneNumber = user.phoneNumber;
         var otpUrl = process.env.OTP_SERVICES_URL +"create"; 
         var otpReqObj = {
             counterType: "MINUTE",
             sendSms: 1,
             phoneNumber: phoneNumber,
             sendEmail: 1,
             emailMessage: "",
             smsMessage:"",
             expiryCounter: 10,
             User_ID: newJob.data.User_ID,
             email: email
         }
        
         let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);

         if(!otpReqResp)
             {
                 var resp = {
                     status : RESPONSE_CODES.FAILED,
                     message : "Failed to connect to otp services"
                 };
                 return UtilityHelper.sendResponse(res, 200, resp.message, resp);
             }

                 
      if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
         return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
      }



         var resetID = otpReqResp.data;


        var resp = {
            status : RESPONSE_CODES.SUCCESS,
            message : "A verification code has been sent to your phone number or email to complete the process",
            data : resetID
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})






exports.VALIDATE_FORGOT_PASSWORD = asynHandler(async (req, res, next) => {

  
   
    let {otp, otpID, newPassword} = req.body;
 
 
 
 
  
 
    var otpUrl = process.env.OTP_SERVICES_URL +"validate"; 
    var otpReqObj = {
     otp,
     otpID
    }
   
    let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);
 
    if(!otpReqResp)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to otp services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }
 
      
            
 if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
    return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
 }
 

 var user_ID = otpReqResp.data.User_ID;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/by-id/"+user_ID; 
  
     
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to user services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }
 

         let userToUpdate = newJob.data;




         //userToUpdate.status = RESPONSE_CODES.SUCCESS;
         //userToUpdate.verificationStatus = RESPONSE_CODES.SUCCESS;

         userToUpdate.password = UtilityHelper.sha256Encrypt(newPassword);
 
 
         var updateURL = process.env.DB_BASE_URL +"user/update"; 
 
         let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, userToUpdate);
 
 
 
         if(!newUserUpdate)
             {
                 var resp = {
                     status : RESPONSE_CODES.FAILED,
                     message : "Failed to connect to user update services",
                 };
                 return UtilityHelper.sendResponse(res, 200, resp.message, resp);
             }
 
 
    
             if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
                 return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
              }
      
 
 
 
 
    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Password updated successfully"
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })
 












exports.REFRESH_USER_TOKEN = asynHandler(async (req, res, next) => {

  let user = req.user;

    var tokenDetails = {
        User_ID : user.User_ID
     }

     const token = jwt.sign(tokenDetails, process.env.JWT_TOKEN, { expiresIn: '10h' });
     const refresh_token = jwt.sign(tokenDetails, process.env.JWT_TOKEN_REFRESH, { expiresIn: '20h' });

     

     var resData =  {
        token : token,
        refresh_token:refresh_token
     };

var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Success",
    data : resData
};

return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})











exports.USER_BY_PHONE_NUMBER = asynHandler(async (req, res, next) => {

  
    
    let {phoneNumber} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/by-phone/"+phoneNumber; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }



         //JWT_TOKEN

         /*
         if(newJob.data.verificationStatus != RESPONSE_CODES.SUCCESS){
            //user is not verified generate OTP verification 
            //TO - DO 
            //1. Call the OTPManager to generate otp and send to user
            let phoneNumber = newJob.data.phoneNumber;
            let email =  newJob.data.email;


            var otpUrl = process.env.OTP_SERVICES_URL +"create"; 
            var otpReqObj = {
                counterType: "MINUTE",
                sendSms: 1,
                phoneNumber: phoneNumber,
                sendEmail: 1,
                emailMessage: "",
                smsMessage:"",
                expiryCounter: 10,
                User_ID: newJob.data.User_ID
            }
           
            let otpReqResp = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpReqObj);

            if(!otpReqResp)
                {
                    var resp = {
                        status : RESPONSE_CODES.FAILED,
                        message : "Failed to connect to otp services"
                    };
                    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
                }

                    
         if(otpReqResp.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, otpReqResp.message, otpReqResp);
         }



            var resetID = otpReqResp.data;

            var resp = {
                status : RESPONSE_CODES.PENDING_REVIEW,
                message : "User verification is pending. An OTP has been sent to the user for authentication",
                data : resetID
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }

         */



         var tokenDetails = {
            User_ID : newJob.data.User_ID
         }

         const token = jwt.sign(tokenDetails, process.env.JWT_TOKEN, { expiresIn: '10h' });
         const refresh_token = jwt.sign(tokenDetails, process.env.JWT_TOKEN_REFRESH, { expiresIn: '20h' });

         

         delete newJob.data.id;
         delete newJob.data.User_ID;
         delete newJob.data.password;

         var resData =  {
            token : token,
            refresh_token:refresh_token,
            user: newJob.data,
           
         };

    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : resData
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })
 



 exports.USER_BY_USER_ID = asynHandler(async (req, res, next) => {

  
    
    let {user_id} = req.params;
 
 
    console.log(`=================${user_id}`)
   var loginUrl = process.env.DB_BASE_URL +"user/by-id-full/"+user_id; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }



        
    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })


 exports.ALL_ADMIN_USERS = asynHandler(async (req, res, next) => {

  
    
    //let {phoneNumber} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/all-admin-users"; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }






    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })



 exports.ALL_GOPAS = asynHandler(async (req, res, next) => {

  
    
    //let {phoneNumber} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/all-gopas"; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }






    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })




 exports.ALL_MEPAS = asynHandler(async (req, res, next) => {

  
    
    //let {phoneNumber} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/all-mepas"; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }






    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })




 exports.ALL_BUYERS = asynHandler(async (req, res, next) => {

  
    
    //let {phoneNumber} = req.body;
 
 
 
   var loginUrl = process.env.DB_BASE_URL +"user/all-buyers"; 
  

    
 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);
 
 
 
        if(!newJob)
         {
             var resp = {
                 status : RESPONSE_CODES.FAILED,
                 message : "Failed to connect to services"
             };
             return UtilityHelper.sendResponse(res, 200, resp.message, resp);
         }
 
           
         if(newJob.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
         }






    var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })





exports.REGISTER_USER_BY_ADMIN = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;
  
   // body.added_by = user.User_ID;
   body.registeredBy = user.User_ID;
   body.verificationStatus = 1;



   console.log("================coming to make a registration request================")
   var updateURL = process.env.DB_BASE_URL +"user/register"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, body);

   console.log("================after registration request================")

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
    message : "User details added successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})
