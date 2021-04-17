const RegisteredGeneralPublic = require('../models/RegisteredGeneralPublic');
const Address = require('../models/Address');
const Business = require('../models/Business');
const BusinessUser = require('../models/BusinessUser');
const HealthProfessional = require('../models/HealthProfessional');
const GeneralPublicUser = require('../models/GeneralPublic');
const VaccinationRecord = require('../models/VaccinationRecord');
const PositiveCase = require("../models/PositiveCase");
const CheckIn = require('../models/CheckIn');
const encryptPassword = require("./encryptPassword");
const { parse } = require('json2csv');
const statesMap = {"Tasmania": "TAS", "Australian Capital Territory": "ACT", "South Australia": "SA", "Western Australia": "WA", "Northern Territory": "NT", "New South Wales": "NSW", "Queensland": "QLD", "Victoria": "VIC"}

// generate fake data for seeding database
const faker = require('faker/locale/en_AU');
const db = require('../db');
const mongoose = require("mongoose");
const fs = require("fs");
const VaccinationCentre = require("../models/VaccinationCentre");
const Coordinates = require("../models/Coordinates");
faker.seed(0);

async function createMockRegisteredGeneralPublicUsers(save=false, numUsers=1){
    let users = [];
    for(let i=0; i < numUsers; i++) {
        let user = new RegisteredGeneralPublic();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName)
        let password = faker.internet.password();
        user.password = await encryptPassword(password);
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        if (save) await user.save();
        users.push(user);
    }
    return users;
}

async function createMockAddresses(save=false, numAddresses=1, addCoordinates=false, coordinates=false){
    let addresses = [];
    for(let i=0; i < numAddresses; i++) {
        let address = new Address();
        address.addressLine1 = faker.address.streetAddress();
        // need to update this
        address.suburb = faker.address.city();
        address.city = faker.address.city();
        address.state = statesMap[faker.address.state()];
        address.postcode = faker.address.zipCode();
        if(addCoordinates){
            if(coordinates){
                address.coordinates = coordinates;
            } else {
                address.coordinates = (await createMockCoordinates(save))[0];
            }
        }

        if (save) await address.save();
        addresses.push(address);
    }
    return addresses;
}

async function createMockBusinesses(save=false, numBusinesses=1, address=null){
    let businesses = [];
    for(let i=0; i < numBusinesses; i++) {
        let business = new Business();
        business.ABN = faker.phone.phoneNumber("###########");
        // need to update this
        business.name = faker.company.companyName();
        if(address) {
            business.address = address;
        } else {
            business.address = (await createMockAddresses(save))[0];
        }
        if (save) await business.save();
        businesses.push(business);
    }
    return businesses;
}

async function createMockBusinessUsers(save=false, numUsers=1, business=null){
    let users = [];
    for(let i=0; i < numUsers; i++) {
        let user = new BusinessUser();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName)
        let password = faker.internet.password();
        user.password = await encryptPassword(password);
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        if (business) {
            user.business = business;
        } else {
            user.business = (await createMockBusinesses(save))[0];
        }
        if (save) await user.save();
        users.push(user);
    }
    return users;
}

async function createMockHealthProfessionalUsers(save=false, numUsers=1){
    let users = [];
    for(let i=0; i < numUsers; i++) {
        let user = new HealthProfessional();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName)
        let password = faker.internet.password();
        user.password = await encryptPassword(password);
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        user.healthID = faker.datatype.uuid();
        if (save) await user.save();
        users.push(user);
    }
    return users;
}

async function createMockGeneralPublicUsers(save=false, numUsers=1){
    let users = [];
    for(let i=0; i < numUsers; i++) {
        let user = new GeneralPublicUser();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName)
        user.phone = faker.phone.phoneNumber("0#########");
        if (save) await user.save();
        users.push(user);
    }
    return users;
}

async function createMockCheckIns(save=false, numCheckIns=1, user=null, business=null){
    let checkins = [];
    for(let i=0; i < numCheckIns; i++) {
        let checkin = new CheckIn();
        checkin.date = faker.date.recent(30);
        if(user){
            checkin.user = user;
            checkin.userModel = user.constructor.modelName;
        } else {
            let user = (await createMockGeneralPublicUsers(save))[0];
            checkin.user = user;
            checkin.userModel = user.constructor.modelName;
        }
        if(business){
            checkin.business = business;
        } else {
            checkin.business = (await createMockBusinesses(save))[0];
        }

        if (save) await checkin.save();
        checkins.push(checkin);
    }
    return checkins;
}

async function createMockPositiveCases(save=false, numCases=1, user=null){
    let pCases = [];
    for(let i=0; i < numCases; i++) {
        let pCase = new PositiveCase();
        pCase.testDate = faker.date.recent(30);
        if(user){
            pCase.user = user;
            pCase.userModel = user.constructor.modelName;
        } else {
            let user = (await createMockGeneralPublicUsers(save))[0];
            pCase.user = user;
            pCase.userModel = user.constructor.modelName;
        }
        if (save) await pCase.save();
        pCases.push(pCase);
    }
    return pCases;
}

function randomChoice(choices){
    return choices[Math.floor(Math.random() * choices.length)];
}

async function createMockVaccinationRecord(save=false, numRecords=1, user=null){
    let vRecords = [];
    for(let i=0; i < numRecords; i++) {
        let vRecord = new VaccinationRecord();
        vRecord.dateAdministered = faker.date.recent(360);
        vRecord.vaccinationType = randomChoice(["Novavax", "AstraZeneca", "Pfizer"]);
        vRecord.vaccinationStatus = randomChoice(["Partial", "Complete"]);
        if(user){
            vRecord.patient = user;
        } else {
            vRecord.patient = (await createMockRegisteredGeneralPublicUsers(save))[0];
        }
        if (save) await vRecord.save();
        vRecords.push(vRecord);
    }
    return vRecords;
}

async function createMockVaccinationCentres(save=false, numCentres=1, address = null){
    let vaccinationCentres = [];
    for(let i=0; i < numCentres; i++) {
        let vaccinationCentre = new VaccinationCentre();
        vaccinationCentre.clinicName =  faker.company.companyName();
        if(address){
            vaccinationCentre.address = address;
        } else {
            vaccinationCentre.address = (await createMockAddresses(save, 1, true))[0];
        }
        if (save) await vaccinationCentre.save();
        vaccinationCentres.push(vaccinationCentre);
    }
    return vaccinationCentres;
}

async function createMockCoordinates(save=false, numCoordinates=1){
    let coordinates = [];
    for(let i=0; i < numCoordinates; i++) {
        let coordinate = new Coordinates();
        coordinate.latitude =  faker.address.latitude();
        coordinate.longitude =  faker.address.longitude();
        if (save) await coordinate.save();
        coordinates.push(coordinate);
    }
    return coordinates;
}

function getRawUserData(users){
    let rawUsers = []
    for(let user of users) {
        let u = {id: user.id, password: user.rawPassword, email: user.email, userType: user.type}
        rawUsers.push(u);
    }
    return rawUsers;
}

async function createDevData(){
    await db.connect();
    await mongoose.connection.db.dropDatabase();
    let registeredGeneralPublicUsers = await createMockRegisteredGeneralPublicUsers(true, 100);
    let registeredGeneralPublicUsersRaw = getRawUserData(registeredGeneralPublicUsers);
    let businessUsers = await createMockBusinessUsers(true, 100);
    let businessUsersRaw = getRawUserData(businessUsers)
    let healthProfessionalUsers = await createMockHealthProfessionalUsers(true, 100);
    let healthProfessionalUsersRaw = getRawUserData(healthProfessionalUsers)
    await createMockCheckIns(true, 100);
    await createMockPositiveCases(true, 1);
    await createMockVaccinationRecord(true, 100);
    await createMockVaccinationCentres(true, 100);
    console.log("dev data created");

    const fields = ['userType', 'email', 'password', "id"];
    const opts = { fields };

    try {
        const csv = parse([].concat(registeredGeneralPublicUsersRaw, businessUsersRaw, healthProfessionalUsersRaw), opts);
        const path = 'users_raw.csv';
        fs.writeFile(path, csv, function(err,data) {});
    } catch(err){
        console.error(err);
    }
}

module.exports = {
    createMockRegisteredGeneralPublicUsers,
    createMockAddresses,
    createMockBusinesses,
    createMockBusinessUsers,
    createMockHealthProfessionalUsers,
    createMockGeneralPublicUsers,
    createMockCheckIns,
    createMockPositiveCases,
    createMockVaccinationRecord,
    createMockVaccinationCentres,
    createDevData
}