<?php
    // VERSION: 0.1

    // Plivo REST Helpers
    // ========================================================================

    // ensure Curl is installed
    if(!extension_loaded("curl"))
        throw(new Exception(
            "Curl extension is required for PlivoRestClient to work"));

    /*
     * PlivoRestResponse holds all the REST response data
     * Before using the reponse, check IsError to see if an exception
     * occurred with the data sent to Plivo
     * ResponseJson contains the raw json response
     * Url and QueryString are from the request
     * HttpStatus is the response code of the request
     */
    class PlivoRestResponse {

        public $ResponseJson;
        public $Response;
        public $HttpStatus;
        public $Url;
        public $QueryString;
        public $IsError;
        public $ErrorMessage;

        public function __construct($url, $text, $status) {
            preg_match('/([^?]+)\??(.*)/', $url, $matches);
            $this->Url = $matches[1];
            $this->QueryString = $matches[2];
            $this->ResponseJson = $text;
            $this->HttpStatus = $status;
            if($this->HttpStatus != 204)
                $this->Response = @json_decode($text);

            if($this->IsError = ($status >= 400)) {
              if($status == 401) {
                $this->ErrorMessage = "Authentication required";
              } else {
                $this->ErrorMessage =
                    (string)$this->Response->Message;
              }
            }
        }

    }

    /* PlivoRestClient throws PlivoException on error
     * Useful to catch this exception separately from general PHP
     * exceptions, if you want
     */
    class PlivoException extends Exception {}

    /*
     * PlivoRestBaseClient: the core Rest client, talks to the Plivo REST
     * API. Returns a PlivoRestResponse object for all responses if Plivo's
     * API was reachable Throws a PlivoException if Plivo's REST API was
     * unreachable
     */

    class PlivoRestClient {

        protected $Endpoint;
        protected $AccountSid;
        protected $AuthToken;
        protected $ApiVersion;

        /*
         * __construct
         *   $username : Plivo Sid
         *   $password : Plivo AuthToken
         *   $endpoint : The Plivo REST URL
         *   $ApiVersion : The API version
         */
        public function __construct($endpoint, $accountSid, $authToken, $ApiVersion = 'v0.1') {
            $this->AccountSid = $accountSid;
            $this->AuthToken = $authToken;
            $this->Endpoint = $endpoint;
            $this->ApiVersion = $ApiVersion;
        }

        /*
         * sendRequst
         *   Sends a REST Request to the Plivo REST API
         *   $path : the URL (relative to the endpoint URL, after the /v1)
         *   $method : the HTTP method to use, defaults to GET
         *   $vars : for POST or PUT, a key/value associative array of data to
         * send, for GET will be appended to the URL as query params
         */
        public function request($path, $method = "GET", $vars = array()) {
            $fp = null;
            $tmpfile = "";
            $encoded = "";
            foreach($vars AS $key=>$value)
                $encoded .= "$key=".urlencode($value)."&";
            $encoded = substr($encoded, 0, -1);

            // construct full url
            $url = "{$this->Endpoint}/$path";

            // if GET and vars, append them
            if($method == "GET")
                $url .= (FALSE === strpos($path, '?')?"?":"&").$encoded;

            // initialize a new curl object
            $curl = curl_init($url);

            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);

            curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
            switch(strtoupper($method)) {
                case "GET":
                    curl_setopt($curl, CURLOPT_HTTPGET, TRUE);
                    break;
                case "POST":
                    curl_setopt($curl, CURLOPT_POST, TRUE);
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $encoded);
                    break;
                case "PUT":
                    // curl_setopt($curl, CURLOPT_PUT, TRUE);
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $encoded);
                    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
                    file_put_contents($tmpfile = tempnam("/tmp", "put_"),
                        $encoded);
                    curl_setopt($curl, CURLOPT_INFILE, $fp = fopen($tmpfile,
                        'r'));
                    curl_setopt($curl, CURLOPT_INFILESIZE,
                        filesize($tmpfile));
                    break;
                case "DELETE":
                    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
                    break;
                default:
                    throw(new PlivoException("Unknown method $method"));
                    break;
            }

            // send credentials
            curl_setopt($curl, CURLOPT_USERPWD,
                $pwd = "{$this->AccountSid}:{$this->AuthToken}");

            // do the request. If FALSE, then an exception occurred
            if(FALSE === ($result = curl_exec($curl)))
                throw(new PlivoException(
                    "Curl failed with error " . curl_error($curl)));

            // get result code
            $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            // unlink tmpfiles
            if($fp)
                fclose($fp);
            if(strlen($tmpfile))
                unlink($tmpfile);

            return new PlivoRestResponse($url, $result, $responseCode);
        }

        // REST Reload Plivo Config Helper
        public function reload_config($vars = array()) {
            $path = "$this->ApiVersion/ReloadConfig/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Reload Plivo Cache Config Helper
        public function reload_cache_config($vars = array()) {
            $path = "$this->ApiVersion/ReloadCacheConfig/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Call Helper
        public function call($vars = array()) {
            $path = "$this->ApiVersion/Call/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Bulk Call Helper
        public function bulk_call($vars = array()) {
            $path = "$this->ApiVersion/BulkCall/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Group Call Helper
        public function group_call($vars = array()) {
            $path = "$this->ApiVersion/GroupCall/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Transfer Live Call Helper
        public function transfer_call($vars = array()) {
            $path = "$this->ApiVersion/TransferCall/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Hangup All Live Calls Helper
        public function hangup_all_calls() {
            $path = "$this->ApiVersion/HangupAllCalls/";
            $method = "POST";
            return $this->request($path, $method);
        }

        // REST Hangup Live Call Helper
        public function hangup_call($vars = array()) {
            $path = "$this->ApiVersion/HangupCall/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Schedule Hangup Helper
        public function schedule_hangup($vars = array()) {
            $path = "$this->ApiVersion/ScheduleHangup/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Cancel a Scheduled Hangup Helper
        public function cancel_scheduled_hangup($vars = array()) {
            $path = "$this->ApiVersion/CancelScheduledHangup/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST RecordStart helper
	public function record_start($vars = array()) {
           $path = "$this->ApiVersion/RecordStart/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST RecordStop
	public function record_stop($vars = array()) {
           $path = "$this->ApiVersion/RecordStop/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Play something on a Call Helper
        public function play($vars = array()) {
            $path = "$this->ApiVersion/Play/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST PlayStop something on a Call Helper
        public function play_stop($vars = array()) {
            $path = "$this->ApiVersion/PlayStop/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Schedule Play Helper
        public function schedule_play($vars = array()) {
            $path = "$this->ApiVersion/SchedulePlay/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Cancel a Scheduled Play Helper
        public function cancel_scheduled_play($vars = array()) {
            $path = "$this->ApiVersion/CancelScheduledPlay/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Add soundtouch audio effects to a Call Helper
        public function sound_touch($vars = array()) {
            $path = "$this->ApiVersion/SoundTouch/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Remove soundtouch audio effects on a Call Helper
        public function sound_touch_stop($vars = array()) {
            $path = "$this->ApiVersion/SoundTouchStop/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Send digits to a Call Helper
        public function send_digits($vars = array()) {
            $path = "$this->ApiVersion/SendDigits/";
            $method = "POST";
            return $this->request($path, $method, $vars);
        }

        // REST Conference Mute helper
    	public function conference_mute($vars = array()) {
           $path = "$this->ApiVersion/ConferenceMute/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Unmute helper
	public function conference_unmute($vars = array()) {
	   $path = "$this->ApiVersion/ConferenceUnmute/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Kick helper
	public function conference_kick($vars = array()) {
           $path = "$this->ApiVersion/ConferenceKick/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Hangup helper
	public function conference_hangup($vars = array()) {
           $path = "$this->ApiVersion/ConferenceHangup/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Deaf helper
	public function conference_deaf($vars = array()) {
           $path = "$this->ApiVersion/ConferenceDeaf/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Undeaf helper
	public function conference_undeaf($vars = array()) {
           $path = "$this->ApiVersion/ConferenceUndeaf/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference RecordStart helper
	public function conference_record_start($vars = array()) {
           $path = "$this->ApiVersion/ConferenceRecordStart/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference RecordStop
	public function conference_record_stop($vars = array()) {
           $path = "$this->ApiVersion/ConferenceRecordStop/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Play helper
	public function conference_play($vars = array()) {
           $path = "$this->ApiVersion/ConferencePlay/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference Speak helper
	public function conference_speak($vars = array()) {
           $path = "$this->ApiVersion/ConferenceSpeak/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference List Helper
	public function conference_list($vars = array()) {
           $path = "$this->ApiVersion/ConferenceList/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}

        // REST Conference List Members Helper
	public function conference_list_members($vars = array()) {
           $path = "$this->ApiVersion/ConferenceListMembers/";
           $method = "POST";
           return $this->request($path, $method, $vars);
	}
    }

    // RESTXML Response Helpers
    // ========================================================================

    /*
     * Element: Base class for all RESTXML element elements used in creating Responses
     * Throws a PlivoException if an non-supported attribute or
     * attribute value is added to the element. All methods in Element are protected
     * or private
     */

    class Element {
        private $tag;
        private $body;
        private $attr;
        private $children;

        /*
         * __construct
         *   $body : Element contents
         *   $body : Element attributes
         */
        function __construct($body=NULL, $attr = array()) {
            if (is_array($body)) {
                $attr = $body;
                $body = NULL;
            }
            $this->tag = get_class($this);
            $this->body = $body;
            $this->attr = array();
            $this->children = array();
            self::addAttributes($attr);
        }

        /*
         * addAttributes
         *     $attr  : A key/value array of attributes to be added
         *     $valid : A key/value array containging the accepted attributes
         *     for this element
         *     Throws an exception if an invlaid attribute is found
         */
        private function addAttributes($attr) {
            foreach ($attr as $key => $value) {
                if(in_array($key, $this->valid))
                    $this->attr[$key] = $value;
                else
                    throw new PlivoException($key . ', ' . $value .
                       " is not a supported attribute pair");
            }
        }

        /*
         * append
         *     Nests other element elements inside self.
         */
        function append($element) {
            if (!isset($this->nesting) or is_null($this->nesting))
                throw new PlivoException($this->tag ." doesn't support nesting");
            else if(!is_object($element))
                throw new PlivoException($element->tag . " is not an object");
            else if(!in_array(get_class($element), $this->nesting))
                throw new PlivoException($element->tag . " is not an allowed element here");
            else {
                $this->children[] = $element;
                return $element;
            }
        }

        /*
         * set
         *     $attr  : An attribute to be added
         *    $valid : The attrbute value for this element
         *     No error checking here
         */
        function set($key, $value){
            $this->attr[$key] = $value;
        }

        /* Convenience Methods */
        function addSpeak($body=NULL, $attr = array()){
            return self::append(new Speak($body, $attr));
        }

        function addPlay($body=NULL, $attr = array()){
            return self::append(new Play($body, $attr));
        }

        function addDial($body=NULL, $attr = array()){
            return self::append(new Dial($body, $attr));
        }

        function addNumber($body=NULL, $attr = array()){
            return self::append(new Number($body, $attr));
        }

        function addGetDigits($attr = array()){
            return self::append(new GetDigits($attr));
        }

        function addGetSpeech($attr = array()){
            return self::append(new GetSpeech($attr));
        }

        function addRecord($attr = array()){
            return self::append(new Record($attr));
        }

        function addHangup($attr = array()){
            return self::append(new Hangup($attr));
        }

        function addRedirect($body=NULL, $attr = array()){
            return self::append(new Redirect($body, $attr));
        }

        function addSIPTransfer($body=NULL, $attr = array()){
            return self::append(new SIPTransfer($body, $attr));
        }

        function addWait($attr = array()){
            return self::append(new Wait($attr));
        }

        function addConference($body=NULL, $attr = array()){
            return self::append(new Conference($body, $attr));
        }

        function addPreAnswer($attr = array()){
            return self::append(new PreAnswer(NULL, $attr));
        }

        /*
         * write
         * Output the XML for this element and all it's children
         *    $parent: This element's parent element
         *    $writeself : If FALSE, Element will not output itself,
         *    only its children
         */
        protected function write($parent, $writeself=TRUE){
            if($writeself) {
                $elem = $parent->addChild($this->tag, htmlspecialchars($this->body));
                foreach($this->attr as $key => $value)
                    $elem->addAttribute($key, $value);
                foreach($this->children as $child)
                    $child->write($elem);
            } else {
                foreach($this->children as $child)
                    $child->write($parent);
            }

        }

    }

    class Response extends Element {

        private $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";

        protected $nesting = array('Speak', 'Play', 'GetDigits', 'Record',
            'Dial', 'Redirect', 'Wait', 'Hangup', 'PreAnswer', 'Conference', 'GetSpeech', 'SIPTransfer');

        function __construct(){
            parent::__construct(NULL);
        }

        function Respond($sendHeader = true) {
            // try to force the xml data type
            // this is generally unneeded by Plivo, but nice to have
            if($sendHeader)
            {
                if(!headers_sent())
                {
                    header("Content-type: text/xml");
                }
            }
            $simplexml = new SimpleXMLElement($this->xml);
            $this->write($simplexml, FALSE);
            print $simplexml->asXML();
        }

        function asURL($encode = TRUE){
            $simplexml = new SimpleXMLElement($this->xml);
            $this->write($simplexml, FALSE);
            if($encode)
                return urlencode($simplexml->asXML());
            else
                return $simplexml->asXML();
        }

    }
    /**
    * The <Speak> element converts text to speech that is read back to the caller.
    * <Speak> is useful for development or saying dynamic text that is difficult to pre-record.
    */
    class Speak extends Element {

        protected $valid = array('voice','language','loop', 'engine', 'method', 'type');
        /**
        * Speak Constructor
        *
        * Instatiates a new Speak object with text and optional attributes.
        * Possible attributes are:
        *   "voice" => 'man'|'woman',
        *   "language" => 'en'|'es'|'fr'|'de',
        *   "loop"  => integer >= 0
        *
        * @param string $text
        * @param array $attr Optional attributes
        * @return Speak
        */
        function __construct($text='', $attr = array()) {
            parent::__construct($text, $attr);
        }
    }
    /**
    * The <Play> element plays an audio file back to the caller.
    * Plivo retrieves the file from a URL that you provide.
    */
    class Play extends Element {

        protected $valid = array('loop');

        /**
        * Play Constructor
        *
        * Instatiates a new Play object with a URL and optional attributes.
        * Possible attributes are:
        *   "loop" =>  integer >= 0
        *
        * @param string $url The URL of an audio file that Plivo will retrieve and play to the caller.
        * @param array $attr Optional attributes
        * @return Play
        */
        function __construct($url='', $attr = array()) {
            parent::__construct($url, $attr);
        }
    }

    /**
    * The <Record> element records the caller's voice and returns to you the URL
    * of a file containing the audio recording. You can optionally generate
    * text transcriptions of recorded calls by setting the 'transcribe'
    * attribute of the <Record> element to 'true'.
    */
    class Record extends Element {

        protected $valid = array('action', 'method', 'timeout','finishOnKey',
                                 'maxLength', 'bothLegs', 'playBeep',
                                 'fileFormat', 'filePath', 'fileName', 'redirect');

        /**
        * Record Constructor
        *
        * Instatiates a new Record object with optional attributes.
        * Possible attributes are:
        *   "action" =>  absolute url, 
        *   "method" => 'GET'|'POST', (default: POST)
        *   "timeout" => positive integer, (default: 5)
        *   "finishOnKey"   => any digit, #, * (default: 1234567890*#)
        *   "maxLength" => integer >= 1, (default: 3600, 1hr)
        *   "playBeep" => true|false, (default: true)
        *
        * @param array $attr Optional attributes
        * @return Record
        */
        function __construct($attr = array()) {
            parent::__construct($attr);
        }
    }

    /**
    * The <Dial> element connects the current caller to an another phone.
    * If the called party picks up, the two parties are connected and can
    * communicate until one hangs up. If the called party does not pick up,
    *  if a busy signal is received, or if the number doesn't exist,
    * the dial element will finish.
    *
    * When the dialed call ends, Plivo makes a GET or POST request to
    * the 'action' URL if provided. Call flow will continue using
    * the RESTXML received in response to that request.
    */
    class Dial extends Element {

        protected $valid = array('action','method','timeout','hangupOnStar',
    'timeLimit', 'callerId', 'callerName', 'confirmSound', 'dialMusic', 'confirmKey', 'redirect',
    'callbackUrl', 'callbackMethod', 'digitsMatch');

        protected $nesting = array('Number');

        /**
        * Dial Constructor
        *
        * Instatiates a new Dial object with a number and optional attributes.
        * Possible attributes are:
        *   "action" =>  absolute url
        *   "method" => 'GET'|'POST', (default: POST)
        *   "timeout" => positive integer, (default: 30)
        *   "hangupOnStar"  => true|false, (default: false)
        *   "timeLimit" => integer >= 0, (default: 14400, 4hrs)
        *   "callerId" => valid phone #, (default: Caller's callerid)
	*   "redirect" => true|false, if 'false', don't redirect to 'action', only request url 
        *	and continue to next element. (default 'true')
        *
        * @param string|Number|Conference $number The number or conference you wish to call
        * @param array $attr Optional attributes
        * @return Dial
        */
        function __construct($number='', $attr = array()) {
            parent::__construct($number, $attr);
        }

    }
    /**
    * The <Redirect> element transfers control of a call to the RESTXML at a
    * different URL. All element elements after <Redirect> are unreachable and ignored.
    */
    class Redirect extends Element {

        protected $valid = array('method');

        /**
        * Redirect Constructor
        *
        * Instatiates a new Redirect object with text and optional attributes.
        * Possible attributes are:
        *   "method" => 'GET'|'POST', (default: POST)
        *
        * @param string $url An absolute or relative URL for a different RESTXML document.
        * @param array $attr Optional attributes
        * @return Redirect
        */
        function __construct($url='', $attr = array()) {
            parent::__construct($url, $attr);
        }

    }
    /**
    * The <SIPTransfer> element transfers a sip call.
    */
    class SIPTransfer extends Element {

        protected $valid = array();

        /**
        * SIPTransfer Constructor
        *
        * Instatiates a new SIPTransfer object with text and optional attributes.
        * @param string $url An absolute or relative URL for a different RESTXML document.
        * @return SIPTransfer
        */
        function __construct($url='', $attr = array()) {
            parent::__construct($url, $attr);
        }

    }
    /**
    * The <Wait> element waits silently for a specific number of seconds.
    * If <Wait> is the first element in a RESTXML document, Plivo will wait
    * the specified number of seconds before picking up the call.
    */
    class Wait extends Element {

        protected $valid = array('length');

        /**
        * Wait Constructor
        *
        * Instatiates a new Wait object with text and optional attributes.
        * Possible attributes are:
        *   "length" => integer > 0, (default: 1)
        *
        * @param array $attr Optional attributes
        * @return Wait
        */
        function __construct($attr = array()) {
            parent::__construct(NULL, $attr);
        }

    }
    /**
    * The <Hangup> element ends a call. If used as the first element in a RESTXML
    * response it does not prevent Plivo from answering the call and billing
    * your account. The only way to not answer a call and prevent billing
    * is to use the <Reject> element.
    */
    class Hangup extends Element {

        protected $valid = array('reason', 'schedule');

        /**
        * Hangup Constructor
        *
        * Instatiates a new Hangup object object with optional attributes.
        * Possible attributes are:
        *   "reason" => 'rejected'|'busy'
        *   "schedule" => '25'
        *
        * @return Hangup
        */
        function __construct($attr = array()) {
            parent::__construct(NULL, $attr);
        }

    }

    /**
    * The <GetDigits> element collects digits that a caller enters into his or her
    * telephone keypad. When the caller is done entering data, Plivo submits
    * that data to the provided 'action' URL in an HTTP GET or POST request,
    * just like a web browser submits data from an HTML form.
    * If no input is received before timeout, <GetDigits> falls through to the
    * next element in the RESTXML document.
    *
    * You may optionally nest <Speak> and <Play> within a <GetDigits> element while
    * waiting for input. This allows you to read menu options to the caller
    * while letting her enter a menu selection at any time. After the first
    * digit is received the audio will stop playing.
    */
    class GetDigits extends Element {

        protected $valid = array('action','method','timeout','finishOnKey',
            'numDigits', 'retries', 'invalidDigitsSound', 'validDigits', 'playBeep');

        protected $nesting = array('Speak', 'Play', 'Wait');
        /**
        * GetDigits Constructor
        *
        * Instatiates a new GetDigits object with optional attributes.
        * Possible attributes are:
        *   "action" =>  absolute url 
        *   "method" => 'GET'|'POST', (default: POST)
        *   "timeout" => positive integer, (default: 5)
        *   "finishOnKey"   => any digit, #, *, (default: #)
        *   "numDigits" => integer >= 1 (default: unlimited)
        *
        * @param array $attr Optional attributes
        * @return GetDigits
        */
        function __construct($attr = array()){
            parent::__construct(NULL, $attr);
        }

    }
    /**
    * The <Dial> element's <Number> noun specifies a phone number to dial.
    * Using the noun's attributes you can specify particular behaviors
    * that Plivo should apply when dialing the number.
    *
    * You can use multiple <Number> nouns within a <Dial> element to simultaneously
    *  call all of them at once. The first call to pick up is connected
    * to the current call and the rest are hung up.
    */
    class Number extends Element {

        protected $valid = array('sendDigits', 'sendOnPreanswer', 'gateways', 'gatewayCodecs',
                                'gatewayTimeouts', 'gatewayRetries', 'extraDialString');

         /**
        * Number Constructor
        *
        * Instatiates a new Number object with optional attributes.
        * Possible attributes are:
        *   "sendDigits"    => any digits
        *
        * @param string $number Number you wish to dial
        * @param array $attr Optional attributes
        * @return Number
        */
         function __construct($number = '', $attr = array()){
            parent::__construct($number, $attr);
         }

    }
    /**
    * The <Dial> element's <Conference> noun allows you to connect to a conference
    * room. Much like how the <Number> noun allows you to connect to another
    * phone number, the <Conference> noun allows you to connect to a named
    * conference room and talk with the other callers who have also connected
    * to that room.
    *
    * The name of the room is up to you and is namespaced to your account.
    * This means that any caller who joins 'room1234' via your account will
    * end up in the same conference room, but callers connecting through
    * different accounts would not. The maximum number of participants in a
    * single Plivo conference room is 40.
    */
    class Conference extends Element {

        protected $valid = array('muted','beep','startConferenceOnEnter',
            'endConferenceOnExit','waitSound','enterSound', 'exitSound',
            'timeLimit', 'hangupOnStar', 'maxMembers', 'recordFilePath',
            'recordFileFormat', 'recordFileName', 'action', 'method',
	    'callbackUrl', 'callbackMethod', 'digitsMatch', 
	    'floorEvent', 'stayAlone');

        /**
        * Conference Constructor
        *
        * Instatiates a new Conference object with room and optional attributes.
        * Possible attributes are:
        *   waitSound: sound to play while alone in conference
        *       (default no sound)
        *   muted: enter conference muted
        *       (default false)
        *   startConferenceOnEnter: the conference start when this member joins
        *       (default true)
        *   endConferenceOnExit: close conference after this member leaves
        *       (default false)
        *   maxMembers: max members in conference
        *       (0 for max : 200)
        *   enterSound: if "", disabled
        *       if beep:1, play one beep when a member enters
        *       if beep:2 play two beeps when a member enters
        *       (default "")
        *   exitSound: if "", disabled
        *       if beep:1, play one beep when a member exits
        *       if beep:2 play two beeps when a member exits
        *       (default "")
        *   timeLimit: max time before closing conference
        *       (default 14400 seconds)
        *   hangupOnStar: exit conference when member press '*'
        *       (default false)
    	*   action: redirect to this URL after leaving conference
    	*   method: submit to 'action' url using GET or POST
    	*   callbackUrl: url to request when call enters/leaves conference
                or has pressed digits matching (digitsMatch)
    	*   callbackMethod: submit to 'callbackUrl' url using GET or POST
    	*   digitsMatch: a list of matching digits to send with callbackUrl
                Can be a list of digits patterns separated by comma.

        *
        * @param string $room Conference room to join
        * @param array $attr Optional attributes
        * @return Conference
        */
         function __construct($room = '', $attr = array()){
            parent::__construct($room, $attr);
         }

    }
    /**
    * The <GetSpeech> element collects speech from caller voice
    * If no input is received before timeout, <GetSpeech> falls through to the
    * next element in the RESTXML document.
    *
    * You may optionally nest <Speak> and <Play> within a <GetDigits> element while
    * waiting for input.
    */
    class GetSpeech extends Element {

        protected $valid = array('action','method','timeout', 'engine', 'grammar', 
                                 'playBeep', 'grammarPath');

        protected $nesting = array('Speak', 'Play', 'Wait');
        /**
        * GetSpeech Constructor
        * @param array $attr Optional attributes
        * @return GetSpeech
        */
        function __construct($attr = array()){
            parent::__construct(NULL, $attr);
        }

    }
    /**
    * The <PreAnswer> element answers the call in early media mode.
    */
    class PreAnswer extends Element {
        protected $valid = array();

        protected $nesting = array('Speak', 'Play', 'Wait', 'GetDigits', 'GetSpeech', 'Redirect', 'SIPTransfer');

         function __construct($attr = array()){
            parent::__construct($attr);
         }
    }


    // Plivo Utility function and Request Validation
    // ========================================================================

    class PlivoUtils {

        protected $AccountSid;
        protected $AuthToken;

        function __construct($id, $token){
            $this->AuthToken = $token;
            $this->AccountSid = $id;
        }

        public function validateRequest($expected_signature, $url, $data = array()) {

           // sort the array by keys
           ksort($data);

           // append them to the data string in order
           // with no delimiters
           foreach($data AS $key=>$value)
                   $url .= "$key$value";

           // This function calculates the HMAC hash of the data with the key
           // passed in
           // Note: hash_hmac requires PHP 5 >= 5.1.2 or PECL hash:1.1-1.5
           // Or http://pear.php.net/package/Crypt_HMAC/
           $calculated_signature = base64_encode(hash_hmac("sha1",$url, $this->AuthToken, true));

           return $calculated_signature == $expected_signature;

        }

    }

?>
