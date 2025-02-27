const express = require("express");
const upload = require("../middleware/fileMiddleware")
const router = express.Router();

//TEST CONTROLLER
const {
    TestController
 } = require("../controllers/test");


 const {
    LOGIN,
    REGISTER,
    ACTIVATE,
    CHANGE_PASSWORD,
    FORGOT_PASSWORD,
    VALIDATE_FORGOT_PASSWORD,
    REFRESH_USER_TOKEN,
    USER_BY_PHONE_NUMBER
 } = require("../controllers/UserController");
 


 const {
   ADD_APPLICATION,
   UPDATE_APPLICATION,
   ADD_APPLICATION_MENUS,
   ALL_APPLICATION
} = require("../controllers/ApplicationController");




const {
   ADD_NEW_GROUPS,
   GROUP_APPLICATIONS,
   ADD_APPLICATION_MENU_GROUP,
   GROUP_MNUS,
   ALL_GROUPS,
   ADD_USERS_GROUPS
} = require("../controllers/GroupController");



const {
   ADD_NEW_ROLE,
   ADD_ROLE_PERMISSIONS,
   ALL_ROLE
} = require("../controllers/RoleController");


 


const {
   ADD_PERMISSIONS,
   ALL_PERMISSIONS
} = require("../controllers/PermissionController");




const {
   ADD_IDENTIFICATION,
   USER_IDENTIFICATION,
   MY_IDENTIFICATION
} = require("../controllers/IdentificationController");




const {
   ADD_GOPA
} = require("../controllers/GopaController");





const {
   ADD_SELLER,
   UPLOAD_REG_DOC
} = require("../controllers/SellerController");





const {
   ADD_MEPA
} = require("../controllers/MepaController");




const {
   ADD_DELIVER,
   UPLOAD_IMAGE,
   ADD_VEHICLE,
   DELIVER_VEHICLES,
   UPLOAD_VEHICLE_IMAGE
} = require("../controllers/DeliverController");




 
 const { NoneUserCheck} = require("../middleware/NoneUserMiddleware")
 const { VALIDATE_TOKEN} = require("../middleware/UserMiddleware")
 const { REFRESH_TOKEN} = require("../middleware/TokenRefreshMiddleware")
 





 

//test routes link
router.route("/testapi").get(TestController);




//user details
router.route("/user/login").post(NoneUserCheck,LOGIN);
router.route("/user/login_by_phone").post(NoneUserCheck,USER_BY_PHONE_NUMBER);

router.route("/user/register").post(NoneUserCheck,REGISTER);
router.route("/user/activate").post(NoneUserCheck,ACTIVATE);
router.route("/user/forgot-password").post(NoneUserCheck,FORGOT_PASSWORD);
router.route("/user/validate-forgot-password").post(NoneUserCheck,VALIDATE_FORGOT_PASSWORD);
router.route("/user/change-password").post(NoneUserCheck,VALIDATE_TOKEN,CHANGE_PASSWORD);
router.route("/user/refresh-token").get(NoneUserCheck,REFRESH_TOKEN,REFRESH_USER_TOKEN);



//application
router.route("/application/create").post(NoneUserCheck,VALIDATE_TOKEN,ADD_APPLICATION);
router.route("/application/update").post(NoneUserCheck,VALIDATE_TOKEN,UPDATE_APPLICATION);
router.route("/application/add-menus").post(NoneUserCheck,VALIDATE_TOKEN,ADD_APPLICATION_MENUS);
router.route("/application/all").get(NoneUserCheck,VALIDATE_TOKEN,ALL_APPLICATION);


//groups


router.route("/group/create").post(NoneUserCheck,VALIDATE_TOKEN,ADD_NEW_GROUPS);
router.route("/group/applications/:group_id").get(NoneUserCheck,VALIDATE_TOKEN,GROUP_APPLICATIONS);
router.route("/group/add-groupApplication-menus").post(NoneUserCheck,VALIDATE_TOKEN,ADD_APPLICATION_MENU_GROUP);
router.route("/group/menus/:group_id").get(NoneUserCheck,VALIDATE_TOKEN,GROUP_MNUS);
router.route("/group/all").get(NoneUserCheck,VALIDATE_TOKEN,ALL_GROUPS);
router.route("/group/add-users-groups").post(NoneUserCheck,VALIDATE_TOKEN,ADD_USERS_GROUPS);



//permissions
router.route("/permission/add").post(NoneUserCheck,VALIDATE_TOKEN,ADD_PERMISSIONS);
router.route("/permission/all").post(NoneUserCheck,VALIDATE_TOKEN,ALL_PERMISSIONS);




//role

router.route("/role/add").post(NoneUserCheck,VALIDATE_TOKEN,ADD_NEW_ROLE);
router.route("/role/add-role-permissions").post(NoneUserCheck,VALIDATE_TOKEN,ADD_ROLE_PERMISSIONS);
router.route("/role/all").get(NoneUserCheck,VALIDATE_TOKEN,ALL_ROLE);




router.route("/identification/add").post(NoneUserCheck,VALIDATE_TOKEN,ADD_IDENTIFICATION);
router.route("/identification/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_IDENTIFICATION);
router.route("/identification/by-user/:user_id").get(NoneUserCheck,VALIDATE_TOKEN,USER_IDENTIFICATION);
router.route("/identification/my-identification").get(NoneUserCheck,VALIDATE_TOKEN,MY_IDENTIFICATION);



//Gopa
router.route("/gopa/register").post(NoneUserCheck,VALIDATE_TOKEN,ADD_GOPA);
router.route("/gopa/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_GOPA);




//Seller
router.route("/seller/register").post(NoneUserCheck,VALIDATE_TOKEN,ADD_SELLER);
router.route("/seller/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_SELLER);
router.route("/seller/upload-doc").post(NoneUserCheck,VALIDATE_TOKEN,upload.single('file'),UPLOAD_REG_DOC);




//Mepa
router.route("/mepa/register").post(NoneUserCheck,VALIDATE_TOKEN,ADD_MEPA);
router.route("/mepa/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_MEPA);



//Deliver
router.route("/deliver/register").post(NoneUserCheck,VALIDATE_TOKEN,ADD_DELIVER);
router.route("/deliver/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_DELIVER);
router.route("/deliver/upload-image").post(NoneUserCheck,VALIDATE_TOKEN,upload.single('file'),UPLOAD_IMAGE);

router.route("/deliver/register-vehicle").post(NoneUserCheck,VALIDATE_TOKEN,ADD_VEHICLE);
router.route("/deliver/profile-vehicle").post(NoneUserCheck,VALIDATE_TOKEN,ADD_VEHICLE);
router.route("/deliver/vehicles/:deliver_id").get(NoneUserCheck,VALIDATE_TOKEN,DELIVER_VEHICLES);
router.route("/deliver/upload-vehicle-image").post(NoneUserCheck,VALIDATE_TOKEN,upload.single('file'),UPLOAD_VEHICLE_IMAGE);




module.exports = router;