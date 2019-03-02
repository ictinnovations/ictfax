## Scenarios

### Send Fax

In order to send the fax, following steps must be followed:

1. Firstly authenticate yourself using the [POST authentication](/fax-rest-api-guide.html#authenticate) API.

2. Add the Document you want to send using the PUT method with [PUT documents/{document_id}/media](/fax-rest-api-guide.html#message-add-document-file-add-update-document-file) API.

3. Next Call the Send Fax Program [POST programs/sendfax](/fax-rest-api-guide.html#send-fax-program). It will return the `program_id` of the newly created Program.

4. POST the transmission using the [POST transmissions](/fax-rest-api-guide.html#transmission-the-actual-call-or-action-collection-of-transmission-create-new-transmission) and get the `transmission_id`.

5. Next Send the Transmission using the [POST transmissions/{transmission_id}/send](/fax-rest-api-guide.html#transmission-the-actual-call-or-action-transmition-send-send-transmition) and the fax will be sent.

        
### Create DID

In order to create new DID, following steps must be followed: 

1. Firstly authenticate yourself using the [POST authentication](/fax-rest-api-guide.html#authenticate) API.

2. Call the [POST acccounts](/fax-rest-api-guide.html/user-account-email-did-extension-users-acounts-create-account) method and pass the required parameters and set the account type to did. It will create the new DID and will return the `account_id` of newly created DID.


### Create Extension

In order to create new DID, following steps must be followed:

1. Firstly authenticate yourself using the [POST authentication](/fax-rest-api-guide.html#authenticate) API.

2. Call the [POST acccounts](/fax-rest-api-guide.html/user-account-email-did-extension-users-acounts-create-account) method and pass the required parameters and set the account type to extension. It will create the new DID and will return the `account_id` of newly created Extension.
