require('dotenv').config();
module.exports = {
    botName:            'City_MD',
    botOwner:           'Scotty',
    ownerNumber:        process.env.OWNER_NUMBER || '263788114185',
    prefix:             '.',
    packname:           'City_MD',
    author:             '© Scotty',
    version:            '1.0.0',
    commandMode:        'public',
    storeWriteInterval: 10000,
    warnLimit:          3,
};
