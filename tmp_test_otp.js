const { generateSecret, verify } = require('otplib');

(async () => {
  const secret = generateSecret();
  const code = '123456';

  const isValid = await verify({
    token: code,
    secret: secret
  });

  console.log('Secret:', secret);
  console.log('Code:', code);
  console.log('Is Valid:', isValid);
})();
