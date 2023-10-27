import express from "express";
import https from "https";
import http from "http";
import { readFileSync } from "fs";
import cookieParser from "cookie-parser";
import { JSDOM as DOMParser } from 'jsdom';
import helper from "./helper.js";
import passport from "passport";
import { Strategy } from "passport-saml";
import config from "./config.js";

const app = express();

//adding cookie parser
app.use(cookieParser());

app.use(express.json()); //for parsing body
app.use(express.urlencoded({ extended: true })); //for parsing x-www-form-urlencoded

app.get("/sso/:provider?", (res, req) => {

    const provider = res?.params?.provider ?? config?.provider?.default;
    const configuration = config?.provider?.[provider];

    //saml configuration
    passport.use(
        new Strategy(configuration, function(profile, done) {
            // Validate the SAML assertion.
            done(null, profile);
        })
    );

    return passport.authenticate('saml')(res, req);
});

app.post("/authenticate", (req, res, next) => {
    const SAMLResponse = req?.body?.SAMLResponse;

    // Decode the SAMLResponse.
    const decodedResponse = Buffer.from(SAMLResponse, 'base64').toString('utf8');

    // Parse the SAMLResponse.
    const parser = new DOMParser(decodedResponse, { contentType: 'text/xml' });
    const xmlDoc = parser.window.document;

    const response = helper.mapNode(xmlDoc, 'Name');
    return res.json(response);

    // res.contentType('text/xml');
    // return res.send(decodedResponse);

});

// serve the API with signed certificate on 443 (SSL/HTTPS) port
// Listen both http & https ports
const httpServer = http.createServer(app);

const httpsServer = https.createServer(
    {
        key: readFileSync("key.pem"),
        cert: readFileSync("cert.pem"),
    },
    app
);

httpServer.listen(80, () => {
    console.log(`app listening on port http://localhost`);
});

httpsServer.listen(443, () => {
    console.log(`app listening on port https://localhost`);
    Object.keys(config.provider).map(provider => {
        if(provider !== 'default'){
          console.log(provider, `https://localhost/sso/${provider}`);
        }
    });
});
