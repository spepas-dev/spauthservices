const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.ADD_DELIVER = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  let { body, user } = req;

  body.added_by = user.User_ID;
  if (!body.User_ID) {
    body.User_ID = user.User_ID;
  } else {
    //TODO confirm if user has the right to profile deliver
  }

  var locObj = {
    type: "Point",
    coordinates: [body.longitude, body.latitude],
  };

  let reqBody = {
    added_by: body.added_by,
    User_ID: body.User_ID,
    licenseNumber: body.licenseNumber,
    location: locObj,
  };

  var updateURL = process.env.DB_BASE_URL + "deliver/add";

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

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "deller details added successfully",
    data: sellerRespObj.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.UPLOAD_IMAGE = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  //TODO Validate file to only accept PDF

  let { user, body } = req;
  let Deliver_ID = body.Deliver_ID;
  let Image_Type = body.Image_Type;

  try {
    var loginUrl = process.env.DB_BASE_URL + "deliver/details/" + Deliver_ID;
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

    let deliverDetails = newJob.data;

    if (Image_Type == "FRONT") {
      //front image upload
      deliverDetails.front_license_url = body.result.secure_url;
      deliverDetails.front_license_obj = body.result;
    } else {
      //back image upload
      deliverDetails.back_license_url = body.result.secure_url;
      deliverDetails.back_license_obj = body.result;
    }

    var updateURL = process.env.DB_BASE_URL + "deliver/update";

    let sellerRespObj = await UtilityHelper.makeHttpRequest(
      "POST",
      updateURL,
      deliverDetails
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

exports.ADD_VEHICLE = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  let { body, user } = req;

  body.added_by = user.User_ID;
  if (!body.User_ID) {
    body.User_ID = user.User_ID;
  } else {
    //TODO confirm if user has the right to profile deliver vehicle
  }

  var updateURL = process.env.DB_BASE_URL + "deliver/add-vehicle";

  let sellerRespObj = await UtilityHelper.makeHttpRequest(
    "POST",
    updateURL,
    body
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
    message: "deller vehicle details added successfully",
    data: sellerRespObj.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.DELIVER_VEHICLES = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { deliver_id } = req.params;

  var loginUrl = process.env.DB_BASE_URL + "deliver/vehicles/" + deliver_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.UPLOAD_VEHICLE_IMAGE = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  //TODO Validate file to only accept PDF

  let { user, body } = req;
  let Vehicle_ID = body.Vehicle_ID;
  let Image_Type = body.Image_Type;

  try {
    var loginUrl =
      process.env.DB_BASE_URL + "deliver/vehicle-details/" + Vehicle_ID;
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

    let deliverDetails = newJob.data;

    if (Image_Type == "FRONT") {
      //front image upload
      deliverDetails.front_image_url = body.result.secure_url;
      deliverDetails.front_image_obj = body.result;
    } else {
      //back image upload
      deliverDetails.back_image_url = body.result.secure_url;
      deliverDetails.back_image_obj = body.result;
    }

    var updateURL = process.env.DB_BASE_URL + "deliver/update-vehicle";

    let sellerRespObj = await UtilityHelper.makeHttpRequest(
      "POST",
      updateURL,
      deliverDetails
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
      message: "image uploaded",
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
