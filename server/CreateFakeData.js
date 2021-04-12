// generate fake data for seeding database
const faker = require('faker/locale/en_AU');

const firstName = faker.name.firstName()
console.log(firstName);

const lastName = faker.name.lastName()
console.log(lastName);

console.log(faker.internet.email(firstName, lastName));

console.log(faker.internet.password());

console.log(faker.phone.phoneNumber("0#########"));

console.log(faker.address.city());

console.log(faker.address.streetAddress());

console.log(faker.address.state());

console.log(faker.address.zipCode());

console.log(faker.address.latitude());

console.log(faker.address.longitude());

// for business name
console.log(faker.company.companyName());

// for business ABN
console.log(faker.phone.phoneNumber("###########"));

console.log(faker.date.recent());

// can be used for confirmation codes
console.log(faker.datatype.uuid());

// need to generate random venue codes

// need to generate clinic name