const moment = require("moment");

const RegisteredGeneralPublic = require('../models/RegisteredGeneralPublic');
const Address = require('../models/Address');
const Business = require('../models/Business');
const BusinessUser = require('../models/BusinessUser');
const HealthProfessional = require('../models/HealthProfessional');
const GeneralPublicUser = require('../models/GeneralPublic');
const VaccinationRecord = require('../models/VaccinationRecord');
const PositiveCase = require("../models/PositiveCase");
const CheckIn = require('../models/CheckIn');
const {parse} = require('json2csv');
const statesMap = {
    "Tasmania": "TAS",
    "Australian Capital Territory": "ACT",
    "South Australia": "SA",
    "Western Australia": "WA",
    "Northern Territory": "NT",
    "New South Wales": "NSW",
    "Queensland": "QLD",
    "Victoria": "VIC"
}

// generate fake data for seeding database
const faker = require('faker/locale/en_AU');
const db = require('../db');
const mongoose = require("mongoose");
const fs = require("fs");
const VaccinationCentre = require("../models/VaccinationCentre");
const Coordinates = require("../models/Coordinates");
const USER_TYPE = require("../_constants/usertypes");
faker.seed(0);

async function createMockRegisteredGeneralPublicUsers(save = false, numUsers = 1) {
    let users = {};
    for (let i = 0; i < numUsers; i++) {
        let user = new RegisteredGeneralPublic();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName);
        let password = faker.internet.password();
        user.password = password;
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        user.registrationDate = faker.date.recent(150);
        if (user.email in users) continue
        users[user.email] = user;
    }
    try {
        if (save) await RegisteredGeneralPublic.collection.insertMany(Object.values(users), {ordered: false});
    } catch (e) {
        console.error(e);
    }
    return Object.values(users);
}

async function createMockAddresses(save = false, numAddresses = 1, addCoordinates = false, coordinates = false) {
    let addresses = [];
    for (let i = 0; i < numAddresses; i++) {
        let address = new Address();
        address.addressLine1 = faker.address.streetAddress();
        // need to update this
        address.suburb = faker.address.city();
        address.city = faker.address.city();
        address.state = statesMap[faker.address.state()];
        address.postcode = faker.address.zipCode();
        if (addCoordinates) {
            if (coordinates) {
                address.coordinates = coordinates;
            } else {
                address.coordinates = (await createMockCoordinates(save))[0];
            }
        }

        addresses.push(address);
    }
    if (save) await Address.collection.insertMany(addresses);

    return addresses;
}

async function createMockBusinesses(save = false, numBusinesses = 1, address = null) {
    let businesses = [];
    for (let i = 0; i < numBusinesses; i++) {
        let business = new Business();
        business.abn = faker.phone.phoneNumber("###########");
        // need to update this
        business.name = faker.company.companyName();
        if (address) {
            business.address = address;
        } else {
            business.address = (await createMockAddresses(save))[0];
        }
        businesses.push(business);
    }
    if (save) await Business.collection.insertMany(businesses);

    return businesses;
}

async function createMockBusinessUsers(save = false, numUsers = 1, business = null) {
    let users = {};
    for (let i = 0; i < numUsers; i++) {
        let user = new BusinessUser();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName);
        let password = faker.internet.password();
        user.password = password;
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        if (business) {
            user.business = business;
        } else {
            user.business = (await createMockBusinesses(save))[0];
        }
        if (user.email in users) continue
        users[user.email] = user;
        user.registrationDate = faker.date.recent(150);
    }
    try {
        if (save) await BusinessUser.collection.insertMany(Object.values(users), {ordered: false});
    } catch (e) {
        console.error(e);
    }
    return Object.values(users);
}

async function createMockHealthProfessionalUsers(save = false, numUsers = 1) {
    let users = {};
    for (let i = 0; i < numUsers; i++) {
        let user = new HealthProfessional();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName);
        let password = faker.internet.password();
        user.password = password;
        user.rawPassword = password;
        user.phone = faker.phone.phoneNumber("0#########");
        user.healthID = faker.phone.phoneNumber("###########");

        if (user.email in users) continue
        users[user.email] = user;
        user.registrationDate = faker.date.recent(150);
    }
    try {
        if (save) await HealthProfessional.collection.insertMany(Object.values(users), {ordered: false});
    } catch (e) {
        console.error(e);
    }
    return Object.values(users);
}

async function createMockGeneralPublicUsers(save = false, numUsers = 1) {
    let users = {};
    for (let i = 0; i < numUsers; i++) {
        let user = new GeneralPublicUser();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName);
        user.phone = faker.phone.phoneNumber("0#########");
        if (user.email in users) continue
        users[user.email] = user;
    }
    try {
        if (save) await GeneralPublicUser.collection.insertMany(Object.values(users), {ordered: false});
    } catch (e) {
        console.error(e);
    }
    return Object.values(users);
}

async function createMockCheckIns(save = false, numCheckIns = 1, user = null, business = null, userType = USER_TYPE.UNREGISTERED) {
    let checkins = [];
    for (let i = 0; i < numCheckIns; i++) {
        let checkin = new CheckIn();
        checkin.date = faker.date.recent(150);
        if (user) {
            checkin.user = user;
            checkin.userModel = user.constructor.modelName;
        } else {
            let user;
            if (userType == USER_TYPE.GENERAL) {
                user = (await createMockRegisteredGeneralPublicUsers(save))[0];
            } else {
                user = (await createMockGeneralPublicUsers(save))[0];
            }
            checkin.user = user;
            checkin.userModel = user.constructor.modelName;
        }
        if (business) {
            checkin.business = business;
        } else {
            checkin.business = (await createMockBusinesses(save))[0];
        }

        checkins.push(checkin);
    }

    if (save) await CheckIn.collection.insertMany(checkins);

    return checkins;
}

async function createMockPositiveCases(save = false, numCases = 1, user = null, userType = USER_TYPE.UNREGISTERED) {
    let pCases = [];
    for (let i = 0; i < numCases; i++) {
        let pCase = new PositiveCase();
        pCase.testDate = faker.date.recent(150);
        pCase.infectiousStartDate = moment(pCase.testDate).subtract(faker.datatype.number({
            'min': 1,
            'max': 10
        }), 'days').toDate();
        if (user) {
            pCase.user = user;
            pCase.userModel = user.constructor.modelName;
        } else {
            let user;
            if (userType === USER_TYPE.GENERAL) {
                user = (await createMockRegisteredGeneralPublicUsers(save))[0];
            } else {
                user = (await createMockGeneralPublicUsers(save))[0];
            }
            pCase.user = user;
            pCase.userModel = user.constructor.modelName;
        }

        pCases.push(pCase);
    }

    if (save) await PositiveCase.collection.insertMany(pCases);

    return pCases;
}

async function createMockVaccinationRecord(save = false, numRecords = 1, user = null) {
    let vRecords = [];
    for (let i = 0; i < numRecords; i++) {
        let vRecord = new VaccinationRecord();
        vRecord.dateAdministered = faker.date.recent(150);
        vRecord.vaccinationType = faker.random.arrayElement(VaccinationRecord.schema.path('vaccinationType').enumValues);
        vRecord.vaccinationStatus = faker.random.arrayElement(VaccinationRecord.schema.path('vaccinationStatus').enumValues);
        if (user) {
            vRecord.patient = user;
        } else {
            vRecord.patient = (await createMockRegisteredGeneralPublicUsers(save))[0];
        }

        vRecords.push(vRecord);
    }

    if (save) await VaccinationRecord.collection.insertMany(vRecords);

    return vRecords;
}

async function createMockVaccinationCentres(save = false, numCentres = 1, address = null) {
    let vaccinationCentres = [];
    for (let i = 0; i < numCentres; i++) {
        let vaccinationCentre = new VaccinationCentre();
        vaccinationCentre.clinicName = faker.company.companyName();
        vaccinationCentre.phone = faker.phone.phoneNumber("0#########");
        if (address) {
            vaccinationCentre.address = address;
        } else {
            vaccinationCentre.address = (await createMockAddresses(save, 1, true))[0];
        }

        vaccinationCentres.push(vaccinationCentre);
    }

    if (save) await VaccinationCentre.collection.insertMany(vaccinationCentres);

    return vaccinationCentres;
}

async function createMockCoordinates(save = false, numCoordinates = 1) {
    let coordinates = [];
    for (let i = 0; i < numCoordinates; i++) {
        let coordinate = new Coordinates();
        coordinate.latitude = faker.address.latitude();
        coordinate.longitude = faker.address.longitude();

        coordinates.push(coordinate);
    }

    if (save) await Coordinates.collection.insertMany(coordinates);

    return coordinates;
}

function getRawUserData(users) {
    let rawUsers = []
    for (let user of users) {
        let u = {id: user.id, password: user.rawPassword, email: user.email, userType: user.type}
        rawUsers.push(u);
    }
    return rawUsers;
}

async function createDevData() {
    await db.connect();
    await mongoose.connection.db.dropDatabase();
    let registeredGeneralPublicUsers = await createMockRegisteredGeneralPublicUsers(true, 5000);
    console.log("Registered General Public Users created");
    let registeredGeneralPublicUsersRaw = getRawUserData(registeredGeneralPublicUsers);
    let healthProfessionalUsers = await createMockHealthProfessionalUsers(true, 500);
    console.log("Health Professional Users created");
    let healthProfessionalUsersRaw = getRawUserData(healthProfessionalUsers);
    let businessUsers = await createMockBusinessUsers(true, 500);
    console.log("Business Users created");
    let businessUsersRaw = getRawUserData(businessUsers);

    const fields = ['userType', 'email', 'password', "id"];
    const opts = {fields};

    try {
        const csv = parse([].concat(registeredGeneralPublicUsersRaw, businessUsersRaw, healthProfessionalUsersRaw), opts);
        const path = 'users_raw.csv';
        fs.writeFile(path, csv, function (err, data) {
        });
    } catch (err) {
        console.error(err);
    }
    console.log("users file created");

    let generalPublicUsers = await createMockGeneralPublicUsers(true, 5000);
    console.log("general public users created")

    let positiveCases = [];
    let vaccinationRecords = [];
    let checkins = [];
    for (let i = 0; i < registeredGeneralPublicUsers.length; i++) {
        let rUser = registeredGeneralPublicUsers[i];
        for (let _ of Array(faker.datatype.number({
            'min': 0,
            'max': 25
        }))) {
            checkins = checkins.concat(await createMockCheckIns(false, faker.datatype.number({
                'min': 1,
                'max': 10
            }), rUser, businessUsers[faker.datatype.number({
                'min': 0,
                'max': businessUsers.length - 1
            })].business, USER_TYPE.GENERAL));
        }
        if (faker.datatype.number({
            'min': 0,
            'max': 100
        }) === 0) {
            positiveCases = positiveCases.concat(await createMockPositiveCases(false, 1, rUser, USER_TYPE.GENERAL));
        }
        if (faker.datatype.number({
            'min': 0,
            'max': 10
        }) === 0) {
            vaccinationRecords = vaccinationRecords.concat(await createMockVaccinationRecord(false, 1, rUser));
        }

        let gUser = generalPublicUsers[i];
        for (let _ of Array(faker.datatype.number({
            'min': 0,
            'max': 25
        }))) {
            checkins = checkins.concat(await createMockCheckIns(false, faker.datatype.number({
                'min': 1,
                'max': 10
            }), gUser, businessUsers[faker.datatype.number({
                'min': 0,
                'max': businessUsers.length - 1
            })].business));
            if (faker.datatype.number({
                'min': 0,
                'max': 100
            }) === 0) {
                positiveCases = positiveCases.concat(await createMockPositiveCases(false, 1, gUser, USER_TYPE.UNREGISTERED));
            }
        }
    }


    for (let user of generalPublicUsers) {
        for (let _ of Array(faker.datatype.number({
            'min': 0,
            'max': 25
        }))) {
            checkins = checkins.concat(await createMockCheckIns(false, faker.datatype.number({
                'min': 1,
                'max': 10
            }), user, businessUsers[faker.datatype.number({
                'min': 0,
                'max': businessUsers.length - 1
            })].business));
            if (faker.datatype.number({
                'min': 0,
                'max': 50
            }) === 0) {
                positiveCases = positiveCases.concat(await createMockPositiveCases(false, 1, user, USER_TYPE.UNREGISTERED));
            }
        }
    }

    await PositiveCase.insertMany(positiveCases);
    console.log("positive cases created")
    await CheckIn.insertMany(checkins);
    console.log("checkins created")
    await VaccinationRecord.insertMany(vaccinationRecords);
    console.log("vaccination records created")

    await createMockVaccinationCentres(true, 100);
    console.log("dev data created");
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