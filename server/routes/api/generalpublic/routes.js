const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {BadRequest} = require('../../../utils/errors');

// check vaccination code is valid and return
// endpoint /checkvaccinationisvalid
// return {success:true, vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName}

module.exports = router;