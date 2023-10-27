import { readFileSync } from "fs";

export default {
    provider: {
        microsoft: {
            entryPoint: "https://login.microsoftonline.com/werw43243-2a66-2343-2344-c086d4946e58/saml2", //'[LOGIN_URL]'
            issuer: "openid-connect", //'[YOUR-APP_ENTITY_ID]'
            cert: readFileSync('saml-certificate/microsoft.cer'), //'[SAML_CERT.CER]' base-64
            callbackUrl: "https://localhost/authenticate", //'/[CALL_BACK_URL_FOR_SML_RESPONSE]'
            entryPointContext: "/openid-connect/sso", //'/[ENTERPRISE_APP_NAME]/sso'
        },
        auth0: {
            entryPoint: "https://dev-x1cyohbl8kvvt1io.us.auth0.com/samlp/qGTkMfuNmT4oyFc0FXtc6aQNKQgT11Uw", //'[LOGIN_URL]'
            issuer: "openid-connect", //'[YOUR-APP_ENTITY_ID]'
            cert: readFileSync('saml-certificate/auth0.cer'), //'[SAML_CERT.CER]' base-64
            callbackUrl: "https://localhost/authenticate", //'/[CALL_BACK_URL_FOR_SML_RESPONSE]'
            entryPointContext: "/openid-connect/sso", //'/[ENTERPRISE_APP_NAME]/sso'
        },
        default: 'microsoft'
    }
}