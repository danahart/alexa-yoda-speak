
var APP_ID = '';

var rp = require('request-promise');

var AlexaSkill = require('./AlexaSkill');

var Metrics = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Metrics.prototype = Object.create(AlexaSkill.prototype);
Metrics.prototype.constructor = Metrics;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

Metrics.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Metrics.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

Metrics.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * override intentHandlers to map intent handling functions.
 */
Metrics.prototype.intentHandlers = {
    "yoda": function (intent, session, response) {
        handleRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// -------------------------- Metrics Domain Specific Business Logic --------------------------


function handleWelcomeRequest(response) {
    var whichMetricPrompt = "Which metric would you like information for?",
        speechOutput = {
            speech: "Hello, which metric on the summary page you like information on?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        },
        repromptOutput = {
            speech: "which metric on the summary page you like information on?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

    response.ask(speechOutput, repromptOutput);
}

function handleHelpRequest(response) {
    var repromptText = "Ask Yoda about being an engineer";
    var speechOutput = "You can ask Yoda questions"
        + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleRequest(intent, session, response) {

    var metric = 'engeinner';
    getYodaResponse(metric, response);
}

function getYodaResponse(metric, response) {

    // Issue the request, and respond to the user
    metricRequest(metric, function yodaResponseCallback(err, yodaResponse) {
        console.log('yodaResponse: '+yodaResponse)
        var speechOutput;

        if (err) {
            speechOutput = "Sorry, the service is experiencing a problem. Please try again later";
        } else {
            speechOutput = 'Do great and powerful things, become an engineer so you can. Yeesss'.
        }

        response.tellWithCard(speechOutput, "Yoda", speechOutput)
    });
}

function metricRequest(metric, yodaResponseCallback) {
    var engineer_response = 'Become an engineer so you can do great and powerful things';
    var yoda_response = 'Do great and powerful things, become an engineer so you can. Yeesssssss.'
    yodaResponseCallback(null, yoda_response);
    /*
    var options = {
        method: 'GET',
        uri: 'https://yoda.p.mashape.com/yoda?sentence='+engineer_response,
        headers: {
            'X-Mashape-Key': 'r426zH6SEomshhaZY3wJt9ktQKEXp1s41qWjsnOKM9KlrJRat2',
            'Accept': 'text/plain'
        },
        resolveWithFullResponse: true,
        json: true
    };

    rp(options)
        .then(function (response) {
            yodaResponseCallback(null, response);
        });
        */
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var metrics = new Metrics();
    metrics.execute(event, context);
};
