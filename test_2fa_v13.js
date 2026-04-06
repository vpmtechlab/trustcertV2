const { TOTP, NobleCryptoPlugin, ScureBase32Plugin } = require('otplib');

async function testTOTPV13() {
  console.log('--- Testing TOTP v13 (Standard Config) ---');

  const totp = new TOTP({
    crypto: new NobleCryptoPlugin(),
    base32: new ScureBase32Plugin(),
    issuer: 'TrustCert',
    label: 'user@example.com'
  });

  // 1. Generate Secret
  const secret = totp.generateSecret();
  console.log('Secret (Base32):', secret);

  // 2. Generate URI
  const uri = totp.toURI({ secret });
  console.log('URI:', uri);

  // 3. Generate a token
  const token = await totp.generate({ secret });
  console.log('Generated Token:', token);

  // 4. Verify Correct Token
  const resultCorrect = await totp.verify(token, { secret });
  console.log('Verification of correct token (result.valid):', resultCorrect.valid);
  console.log('Verification of correct token (raw result):', JSON.stringify(resultCorrect));

  // 5. Verify Incorrect Token
  const resultInvalid = await totp.verify('000000', { secret });
  console.log('Verification of incorrect token (result.valid):', resultInvalid.valid);
  console.log('Verification of incorrect token (raw result):', JSON.stringify(resultInvalid));

  if (resultCorrect.valid === true && resultInvalid.valid === false) {
    console.log('\nSUCCESS: Logic is now strictly verifying codes.');
  } else {
    console.log('\nFAILURE: Verification logic is still incorrect.');
    process.exit(1);
  }
}

testTOTPV13().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
