'use strict'
var Alexa = require("alexa-sdk");
var fetch = require('isomorphic-fetch')
var APP_ID = '';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(startSessionHandlers, InfoCollectorHandlers);
    alexa.execute();
};

var startSessionHandlers = {
    'StartSession': function() {
        this.emit(':askWithCard', 'Hello, say a sentence you would like translated to yodish');
    },
    'AMAZON.StopIntent': function() {
      this.emit(':tell', "Goodbye!");
    },
    'AMAZON.CancelIntent': function() {
      this.emit(':tell', "Goodbye!");
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    }
}

var InfoCollectorHandlers = {
    'StartSession': function() {
        this.emit('StartSession');
    },
    'YodaIntent': function() {
      var phrase = this.event.request.intent.slots.phrase.value
      var url = 'http://yoda-api.appspot.com/api/v1/yodish?text='
      var encodedPhrase = encodeURIComponent(phrase)
      fetch(url+encodedPhrase)
      .then((res) => res.json())
      .then((data) => {
          this.emit(':tell', data.yodish);
      })

    },
    'YodaEngineeringIntent': function() {
      this.emit(':tell', 'Do great and powerful things, become an engineer so you can. Yeesss.')
    },
    'AMAZON.CancelIntent': function() {
      this.emit(':tell', "Goodbye!");
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a sentence or phrase to be translated.', 'Try saying a sentence or phrase to be translated.');
    }
}
