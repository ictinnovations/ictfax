ICTCore REST APIs Guide
=======================

Authentication
--------------
* POST authenticate

System Statistics
-----------------
* GET statistics

Contact / pre defined destination number
----------------------------------------
* POST contacts
* GET contacts
* GET contacts/{contact_id}
* PUT contacts/{contact_id}
* DELETE contacts/{contact_id}

Message / pre defined information to be send
--------------------------------------------

### Fax Documents
* POST messages/documents
* GET messages/documents
* GET messages/documents/{document_id}
* PUT messages/documents/{document_id}
* DELETE messages/documents/{document_id}
* POST messages/documents/{document_id}/media
* GET messages/documents/{document_id}/media


Programs
--------

### General program related function
* POST programs (dummy, instead use a relevant program)

### Fax to Email program
* POST programs/faxtoemail

### Send FAX program
* POST programs/sendfax

### Custom Forward program
* POST programs/forward

Transmission - the actual call or action
----------------------------------------

### create call request / dial / send message
* POST transmissions (dummy, instead use programs/{program_id}/transmissions)
* GET transmissions?service_flag=2&direction=inbound
* GET transmissions?service_flag=2&direction=outbound
* GET transmissions/{transmission_id}
* POST transmissions/{transmission_id}/send


### Reports
* GET transmissions/{transmission_id}/result?name=document

Account / Email / DID / Extension
---------------------------------

### Accounts
* POST accounts
* GET accounts
* GET accounts?type=extension
* GET accounts/{account_id}
* PUT accounts/{account_id}
* DELETE accounts/{account_id}
* PUT /accounts/{account_id}/programs/{program\_name}
* DELETE /accounts/{account_id}/programs
* DELETE /accounts/{account_id}/programs/{program\_name}
* PUT /accounts/{account_id}/users/{user\_id}
* DELETE /accounts/{account_id}/users

### DIDs
* POST dids
* GET dids

### Extension
* POST extensions
* GET extensions

User Management
---------------
* POST users
* GET users
* GET users/{user_id}
* PUT users/{user_id}
* DELETE users/{user_id}
* GET /users/{user_id}/accounts
* GET users/user_id/accounts?type=did

Trunk / Termination Providers APIs
----------------------------------
* POST providers
* GET providers
* GET providers/{provider_id}
* PUT providers/{provider_id}
* DELETE providers/{provider_id}
