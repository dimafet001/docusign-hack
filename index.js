/**
 * This is a quick start example of embedding the signing ceremony within your website.
 * Language: Node.js
 *
 * See the Readme and Setup files for more information.
 *
 * Copyright (c) DocuSign, Inc.
 * License: MIT Licence. See the LICENSE file.
 *
 * This example does not include authentication. Instead, an access token
 * must be supplied from the Token Generator tool on the DevCenter or from
 * elsewhere.
 *
 * This example also does not look up the DocuSign account id to be used.
 * Instead, the account id must be set.
 *
 * For a more production oriented example, see the
 * Authorization code grant authentication example. It includes an express web app:
 *      https://github.com/docusign/eg-03-node-auth-code-grant
 * @file index.js
 * @author DocuSign
 * @see <a href="https://developers.docusign.com">DocuSign Developer Center</a>
 */
const docusign = require('docusign-esign')
    , path = require('path')
    , fs = require('fs')
    , process = require('process')
    , basePath = 'https://demo.docusign.net/restapi'
    , express = require('express')
    , envir = process.env
    ;

// baseUrl is the url of the application's web server. Eg http://localhost:3000
// In some cases, this example can determine the baseUrl automatically.
// See the baseUrl statements at the end of this example.
let baseUrl = envir.BASE_URL || '{BASE_URL}'

async function openSigningCeremonyController (req, res) {
  const qp =req.query;
  // Fill in these constants or use query parameters of ACCESS_TOKEN, ACCOUNT_ID, USER_FULLNAME, USER_EMAIL
  // or environment variables.

  // Obtain an OAuth token from https://developers.hqtest.tst/oauth-token-generator
  const accessToken = envir.ACCESS_TOKEN || qp.ACCESS_TOKEN || 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCA9m-ZWezWSAgAgDaTp5zs1kgCABJnHl5pkMRIoIaH26RD6dYVAAEAAAAYAAkAAAAFAAAAKwAAAC0AAAAvAAAAMQAAADIAAAA4AAAAMwAAADUAAAANACQAAABmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgSAAEAAAALAAAAaW50ZXJhY3RpdmUwAIDJPphZ7NZINwAWptNjs8mWRYwS-5INkh3S.0f78VFHprusWUcExAjeoQkMMpVRKJJBINiEX2bJZnocSMac4uZasPASxW28eBoOxpQx5LOkztScJLQjRnzBkV2waxJwO4YKGrD4rGHc6b4dM45PY2G4PqW31KIX9VYRgeqT0VCmbHVMQdgJuH-ZbYa85Srd3PwEo2D3GxLdtaQFvMOjohBCLquAB5mXnXSzaH1ott4UdakDIF_LJAYkmXuf5zmKr14Jq63CCtG2C4csN-0bxIXmV_AdEToVMo-TalX-YYJ5Hhqe_uUKVaSJKtbcWvGFfXLV4m6RQp42fwsAZ4-uEXorzhXccVkRv4vNtze45VCO9geIBb0b1RjczJg';

  // Obtain your accountId from demo.docusign.com -- the account id is shown in the drop down on the
  // upper right corner of the screen by your picture or the default picture. 
  const accountId = envir.ACCOUNT_ID || qp.ACCOUNT_ID || '8502928'; 

  // Recipient Information:
  const signerName = envir.USER_FULLNAME || qp.USER_FULLNAME || 'Nick Fury';
  const signerEmail = envir.USER_EMAIL || qp.USER_EMAIL || 'nickfury@marvel.com';

  const clientUserId = '123' // Used to indicate that the signer will use an embedded
                             // Signing Ceremony. Represents the signer's userId within
                             // your application.
      , authenticationMethod = 'None' // How is this application authenticating
                                      // the signer? See the `authenticationMethod' definition
                                      // https://developers.docusign.com/esign-rest-api/reference/Envelopes/EnvelopeViews/createRecipient

  // The document to be signed. Path is relative to the root directory of this repo.
  

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // fs.writeFileSync("/contracts/test.txt", "synchronous write!")

  // TODOHACK: Create parsing data function
  fs.writeFile(__dirname + "/contracts/test.txt", "WORKS", (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
  // const fileName = 'demo_documents/World_Wide_Corp_lorem.pdf';
  const fileName = 'contracts/test.txt';



  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /**
   *  Step 1. The envelope definition is created.
   *          One signHere tab is added.
   *          The document path supplied is relative to the working directory
   */
  const envDef = new docusign.EnvelopeDefinition();
  //Set the Email Subject line and email message
  envDef.emailSubject = 'Please sign this document sent from the Node example';
  envDef.emailBlurb = 'Please sign this document sent from the Node example.'

  // Read the file from the document and convert it to a Base64String
  const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName))
      , pdfBase64 = pdfBytes.toString('base64');

  // Create the document request object
  const doc = docusign.Document.constructFromObject({documentBase64: pdfBase64,
        fileExtension: 'TXT',  // You can send other types of documents too.
        name: 'Sample document', documentId: '1'});

  // Create a documents object array for the envelope definition and add the doc object
  envDef.documents = [doc];

  // Create the signer object with the previously provided name / email address
  const signer = docusign.Signer.constructFromObject({name: signerName, email: signerEmail,
          routingOrder: '1', recipientId: '1', clientUserId: clientUserId});

  // Create the signHere tab to be placed on the envelope
  const signHere = docusign.SignHere.constructFromObject({documentId: '1',
          pageNumber: '1', recipientId: '1', tabLabel: 'SignHereTab',
          xPosition: '195', yPosition: '147'});

  // Create the overall tabs object for the signer and add the signHere tabs array
  // Note that tabs are relative to receipients/signers.
  signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});

  // Add the recipients object to the envelope definition.
  // It includes an array of the signer objects.
  envDef.recipients = docusign.Recipients.constructFromObject({signers: [signer]});
  // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
  envDef.status = 'sent';

  /**
   *  Step 2. Create/send the envelope.
   *          We're using a promise version of the SDK's createEnvelope method.
   */
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(basePath);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  // Set the DocuSign SDK components to use the apiClient object
  docusign.Configuration.default.setDefaultApiClient(apiClient);
  let envelopesApi = new docusign.EnvelopesApi()
    , results;

  try {
    results = await envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envDef})
    /**
     * Step 3. The envelope has been created.
     *         Request a Recipient View URL (the Signing Ceremony URL)
     */
    const envelopeId = results.envelopeId
        , recipientViewRequest = docusign.RecipientViewRequest.constructFromObject({
            authenticationMethod: authenticationMethod, clientUserId: clientUserId,
            recipientId: '1', returnUrl: baseUrl + '/dsreturn',
            userName: signerName, email: signerEmail
          })
        ;

    results = await envelopesApi.createRecipientView(accountId, envelopeId,
                      {recipientViewRequest: recipientViewRequest});
    /**
     * Step 4. The Recipient View URL (the Signing Ceremony URL) has been received.
     *         Redirect the user's browser to it.
     */
    res.redirect (results.url)
  } catch  (e) {
    // Handle exceptions
    let body = e.response && e.response.body;
    if (body) {
      // DocuSign API exception
      res.send (`<html lang="en"><body>
                  <h3>API problem</h3><p>Status code ${e.response.status}</p>
                  <p>Error message:</p><p><pre><code>${JSON.stringify(body, null, 4)}</code></pre></p>`);
    } else {
      // Not a DocuSign exception
      throw e;
    }
  }
}

// The mainline
const port = process.env.PORT || 3000
    , host = process.env.HOST || 'localhost'
    , app = express()
       .post('/', openSigningCeremonyController)
       .get('/', (req, res) => {
         res.send(`<html lang="en"><body><form action="${req.url}" method="post">
          <input type="submit" value="Sign the document!"
           style="width:13em;height:2em;background:#1f32bb;color:white;font:bold 1.5em arial;margin: 3em;"/>
          </form></body>`)
       })
       .get('/dsreturn', (req, res) => {
        res.send(`<html lang="en"><body><p>The signing ceremony was completed with
          status ${req.query.event}</p><p>This page can also implement post-signing processing.</p></body>`)
      })
       .listen(port);

// If baseUrl was not set then try to figure it out.
if (baseUrl == '{BASE_URL}') {
  baseUrl = `http://${host}:${port}`;
  if (process.env.PROJECT_DOMAIN) {
    // Running on glitch.com!
    baseUrl = `https://${process.env.PROJECT_DOMAIN}.glitch.me`
  }
}

console.log(`Your server is running on ${host}:${port}`);
console.log(`baseUrl set to ${baseUrl}`);
