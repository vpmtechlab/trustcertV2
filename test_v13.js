const { generateSecret, verify, verifySync } = require('otplib');

async function testV13Root() {
  console.log('--- Testing otplib v13 Root Exports ---');

  const secret = generateSecret();
  console.log('Secret (Base32):', secret);

  const correctToken = await require('@otplib/totp').generate({
    secret,
    crypto: require('@otplib/plugin-crypto-noble').crypto,
    base32: require('@otplib/plugin-base32-scure').base32
  });
  console.log('Correct Token:', correctToken);

  const isValid = await verify({
    token: correctToken,
    secret: secret
  });
  console.log('Verification of correct token:', isValid);

  const isInvalid = await verify({
    token: '000000',
    secret: secret
  });
  console.log('Verification of 000000:', isInvalid);

  const isInvalidRandom = await verify({
    token: '123456',
    secret: secret
  });
  console.log('Verification of 123456:', isInvalidRandom);
}

testV13Root().catch(console.error);
