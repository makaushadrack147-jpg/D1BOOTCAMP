const faker = require("faker");

const users = [];

function addFakeUser() {
  const user = {
    name: faker.name.findName(),
    address: {
      street: faker.address.streetAddress(),
      country: faker.address.country(),
    },
  };
  users.push(user);
  return user;
}

module.exports = { users, addFakeUser };
