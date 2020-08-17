const jwksRsa = require("jwks-rsa");
const jwt = require("express-jwt");

// Set up Auth0 configuration
const authConfig = {
  domain: "nicolasvenne.auth0.com",
  audience: "https://api.nicolasvenne.ca"
};
  
const secretLink = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
})
  
// Define middleware that validates incoming bearer tokens
// using JWKS from nicolasvenne.auth0.com
const checkJwt = jwt({
  secret: secretLink,

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

module.exports = checkJwt;