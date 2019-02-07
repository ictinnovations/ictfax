## Scenarios

### Send Fax

In order to send the fax, following steps must be followed:

#### Authentication

        POST http://ictcore.example.com/api/authenticate

Create and return authentication token / session key.

+ Request (application/json)

    + Attributes

        + username: admin (string) - api username for authentication
        + passowrd: mysecret (string) - api password for authentication

+ Response 200 (application/json)
    
    + Attributes 
        
        + token : token (string)
        
#### Send FAX program

Prepare given fax document for provided account, and make it ready to be sent

##### Create New Send FAX program

        POST http://ictcore.example.com/apiprograms/sendfax

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (ProgramSendfax)

+ Response 200 (application/json)

    + Attributes

        + program_id : 1 (number) - program id  of recently created program
        
#### Send Transmition

        POST http://ictcore.example.com/api/transmissions

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes
        
        + transmission_id: 1 (number) - Transmission ID of resulted attempt
                        
#### Transmition Send

        POST http://ictcore.example.com/api/transmissions/{transmission_id}/send

+ Parameters

        + spool_id (number) - Spool ID of the resulted attempt
        
### Create DID

In order to create new DID, following steps must be followed: 

#### Authentication

        POST http://ictcore.example.com/api/authenticate

Create and return authentication token / session key.

+ Request (application/json)

    + Attributes

        + username: admin (string) - api username for authentication
        + passowrd: mysecret (string) - api password for authentication

+ Response 200 (application/json)
    
    + Attributes 
        
        + token : token (string)
        
#### POST DID

        POST http://ictcore.example.com/api/dids

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (DID)

+ Response 200 (application/json)

    + Attributes
         
         + account_id: 1 (number) - account id of recently created did

### Create Extension

In order to create new DID, following steps must be followed:

#### Authentication

        POST http://ictcore.example.com/api/authenticate

Create and return authentication token / session key.

+ Request (application/json)

    + Attributes

        + username: admin (string) - api username for authentication
        + passowrd: mysecret (string) - api password for authentication

+ Response 200 (application/json)
    
    + Attributes 
        
        + token : token (string)
        
#### POST Extension

        POST http://ictcore.example.com/api/accounts

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Extension)

+ Response 200 (application/json)

    + Attributes
         
         + account_id: 1 (number) - account id of recently created extension
         
## ProgramSendfax (Program)
+ document_id: 1 (number) - document id of fax document for which this program is being created

## TransmissionPost (object)
+ title: title (string)
+ origin:  origin (string) -  reference to function / program which is responsible creation of this transmission
+ contact_id:  1 (number, required) - contact id to contact where to transmit message
+ account_id:  1 (number) -  account id of associated account
+ service_flag:  1 (number) - Type of transmission service i.e Email::SERVICE_FLAG or Voice::SERVICE_FLAG
+ program_id:  1 (number, required) - program id of program which will be used with this transmission
+ direction:  direction (string) - either can be outbound or inbound

## DID (object)
+ username: username (string)
+ passwd: password (string)
+ passwd_pin: password pin (string)
+ first_name: first name (string)
+ last_name: last name (string)
+ phone: 03001234567 (number)
+ email: email (string)
+ address: address (string)
+ active: 1 (number) - 1 for active, 0 for disabled

## Extension (object)
+ username: username (string)
+ passwd: password (string)
+ passwd_pin: password pin (string)
+ first_name: first name (string)
+ last_name: last name (string)
+ phone: 03001234567 (number)
+ email: email (string)
+ address: address (string)
+ active: 1 (number) - 1 for active, 0 for disabled
+ type: extension(string)
