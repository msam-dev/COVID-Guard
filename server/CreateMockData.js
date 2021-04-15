const RegisteredGeneralPublic = require('./models/RegisteredGeneralPublic');
const Address = require('./models/Address');
const Business = require('./models/Business');
const BusinessUser = require('./models/BusinessUser');
const HealthProfessional = require('./models/HealthProfessional');
const GeneralPublicUser = require('./models/GeneralPublic');
const VaccinationRecord = require('./models/VaccinationRecord');
const PositiveCase = require("./models/PositiveCase");
const CheckIn = require('./models/CheckIn');
const encryptPassword = require("./utils/encryptPassword");

// generate fake data for seeding database
const faker = require('faker/locale/en_AU');
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

async function createMockAddresses(save=false, numAddresses=1){
    let addresses = [];
    for(let i=0; i < numAddresses; i++) {
        let address = new Address();
        address.addressLine1 = faker.address.streetAddress();
        // need to update this
        address.suburb = faker.address.city();
        address.city = faker.address.city();
        address.state = faker.address.state();
        address.postcode = faker.address.zipCode();
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
        // need to implement this
        business.code = "CODE1234";
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

async function createMockCheckIns(save=false, numCheckIns=1, user=null){
    let checkins = [];
    for(let i=0; i < numCheckIns; i++) {
        let checkin = new CheckIn();
        checkin.date = faker.date.recent();
        if(user){
            checkin.user = user;
        } else {
            // implement this
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
        pCase.date = faker.date.recent();
        if(user){
            pCase.user = user;
        } else {
            // implement this
        }
        if (save) await pCase.save();
        pCases.push(pCase);
    }
    return pCases;
}

async function createMockVaccinationRecord(save=false, numRecords=1, user=null){
    let vRecords = [];
    for(let i=0; i < numRecords; i++) {
        let vRecord = new VaccinationRecord();
        vRecord.date = faker.date.recent();
        if(user){
            vRecord.user = user;
        } else {
            // implement this
        }
        if (save) await vRecord.save();
        vRecords.push(vRecord);
    }
    return vRecords;
}

//console.log(faker.address.latitude());

//console.log(faker.address.longitude());

// can be used for confirmation codes
//console.log(faker.datatype.uuid());

// need to generate random venue codes

// need to generate clinic name

module.exports = {
    createMockRegisteredGeneralPublicUsers,
    createMockAddresses,
    createMockBusinesses,
    createMockBusinessUsers,
    createMockHealthProfessionalUsers,
    createMockGeneralPublicUsers,
    createMockCheckIns,
    createMockPositiveCases,
    createMockVaccinationRecord
}