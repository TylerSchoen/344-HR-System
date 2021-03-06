var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    userId     : { type: 'integer',  unique: true, required: true },
    firstName : { type: 'string' },
    lastName  : { type: 'string' },
    gender  : { type: 'string' },
    dateOfBirth : { type: 'string', defaultsTo: '01-01-1990' },
    address   : { type: 'string', defaultsTo: '' },
    image     : { type: 'string' },
    position  : { type: 'string', defaultsTo: 'Adjunct Professor' },
    salary    : { type: 'integer', defaultsTo: 42000 },
    passports : { collection: 'Passport', via: 'user' },
    type    : { type: 'string', defaultsTo: 'Employee'}, // Employee or Student or admin
    isTerminated : { type: 'boolean', defaultsTo: 0 },
    isLinked : { type: 'boolean', defaultsTo: 0 },
  }
};

module.exports = User;
