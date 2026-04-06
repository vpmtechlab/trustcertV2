const { authenticator } = require('otplib');

function test2FA() {
  console.log('--- Testing 2FA Logic with authenticator ---');

  // 1. Generate Secret (similar to generate2FASecret)
  const secret = authenticator.generateSecret();
  console.log('Generated Secret:', secret);

  // 2. Generate URI (similar to generateURI in authenticator)
  const uri = authenticator.keyuri('user@example.com', 'TrustCert', secret);
  console.log('Secret URI:', uri);

  // 3. Generate a valid token
  const token = authenticator.generate(secret);
  console.log('Current Valid Token:', token);

  // 4. Verify Correct Token (similar to verifyAndEnable2FA / verify2FACode)
  const isValid = authenticator.check(token, secret);
  console.log('Verification of correct token:', isValid ? 'PASSED' : 'FAILED');

  // 5. Verify Incorrect Token
  const isInvalid = authenticator.check('000000', secret);
  console.log('Verification of incorrect token (000000):', !isInvalid ? 'PASSED' : 'FAILED');

  const isInvalidRandom = authenticator.check('123456', secret);
  console.log('Verification of incorrect token (123456):', !isInvalidRandom ? 'PASSED' : 'FAILED');

  if (isValid && !isInvalid && !isInvalidRandom) {
    console.log('\nSUCCESS: 2FA Verification logic is working correctly.');
  } else {
    console.log('\nFAILURE: 2FA Verification logic check failed.');
    process.exit(1);
  }
}

test2FA();
