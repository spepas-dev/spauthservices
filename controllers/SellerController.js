const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.ADD_SELLER = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  let { body, user } = req;

  var userToReg = user;
  if (!body.User_ID) {
    body.User_ID = user.User_ID;
  } else {
    // profiling retrieve user details from the database and bind it to userToReg

    var loginUrl = process.env.DB_BASE_URL + "user/by-id/" + body.User_ID;
    let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

    if (!newJob) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Failed to retrieve user details from database services",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if (newJob.status != RESPONSE_CODES.SUCCESS) {
      return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
    }
    userToReg = newJob.data;
  }

  if (userToReg.Seller_ID) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "User already attached to existing seller",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  var locObj = {
    type: "Point",
    coordinates: [body.longitude, body.latitude],
  };

  let reqBody = {
    storeName: body.storeName,
    Gopa_ID: body.Gopa_ID,
    Location: locObj,
  };

  var updateURL = process.env.DB_BASE_URL + "seller/add";

  let sellerRespObj = await UtilityHelper.makeHttpRequest(
    "POST",
    updateURL,
    reqBody
  );

  if (!sellerRespObj) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (sellerRespObj.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(
      res,
      200,
      sellerRespObj.message,
      sellerRespObj
    );
  }

  userToReg.Seller_ID = sellerRespObj.data.Seller_ID;

  var updateURL = process.env.DB_BASE_URL + "user/update";

  let newUserUpdate = await UtilityHelper.makeHttpRequest(
    "POST",
    updateURL,
    userToReg
  );

  if (!newUserUpdate) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to user update services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newUserUpdate.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(
      res,
      200,
      newUserUpdate.message,
      newUserUpdate
    );
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "seller details added successfully",
    data: sellerRespObj.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.UPLOAD_REG_DOC = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  //TODO Validate file to only accept PDF

  let { user, body } = req;
  let Seller_ID = body.Seller_ID;

  console.log("Cloudinary Config:", cloudinary.config());

  try {
    var loginUrl = process.env.DB_BASE_URL + "seller/details/" + Seller_ID;
    let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

    if (!newJob) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Failed to retrieve seller details from database services",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if (newJob.status != RESPONSE_CODES.SUCCESS) {
      return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
    }

    let sellerDetails = newJob.data;

    sellerDetails.business_reg_url = body.result.secure_url;
    sellerDetails.business_reg_obj = body.result;

    var updateURL = process.env.DB_BASE_URL + "seller/update";

    let sellerRespObj = await UtilityHelper.makeHttpRequest(
      "POST",
      updateURL,
      sellerDetails
    );

    if (!sellerRespObj) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Failed to connect to database services",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if (sellerRespObj.status != RESPONSE_CODES.SUCCESS) {
      return UtilityHelper.sendResponse(
        res,
        200,
        sellerRespObj.message,
        sellerRespObj
      );
    }

    var resp = {
      status: RESPONSE_CODES.SUCCESS,
      message: "document uploaded",
      data: sellerRespObj.data,
    };

    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  } catch (error) {
    console.error(error);
    console.log(error);
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Unkown error",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }
});
