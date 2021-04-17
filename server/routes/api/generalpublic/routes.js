const express = require('express')
const router = express.Router();
const VaccinationRecord = require('../../../models/VaccinationRecord')
const userType = require("../../../_constants/usertypes")

const asyncHandler = require('express-async-handler');
const {BadRequest} = require('../../../utils/errors');

// check vaccination code is valid and return
// endpoint /checkvaccinationisvalid
// return {success:true, vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName}

router.post('/checkvaccinationisvalid', asyncHandler(async (req, res) => {
    const { vaccinationCode } = req.body;

    // Simple validation
    if (!vaccinationCode) {
        throw new BadRequest('Please enter vaccination code');
    }

    // Check for existing record
    const vaccinationRecord = await VaccinationRecord.findOne({ vaccinationCode });
    if (!vaccinationRecord) throw new BadRequest('Vaccination record does not exist');

    // Define return fields
    const vaccinationType = vaccinationRecord.vaccinationType;
    const vaccinationStatus = vaccinationRecord.vaccinationStatus;
    const dateAdministered = vaccinationRecord.dateAdministered;
    const patientFirstName = vaccinationRecord.patient.firstName;
    const patientLastName = vaccinationRecord.patient.lastName;
    //console.log(vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName);

    res.status(200).json({
        success: true,
        vaccinationType,
        vaccinationStatus,
        dateAdministered,
        patientFirstName,
        patientLastName
    });
}));

module.exports = router;