/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const mysql = require('mysql');

const handlers = {
    'LaunchRequest': function () {
        var obj = this;

        var connection = mysql.createConnection({
          host     : 'gesture2.cn8pndyiytrv.us-east-1.rds.amazonaws.com',
          user     : 'gestureadmin',
          password : 'SpartansWill',
          database : 'Gesture'
        });

        connection.connect();

        connection.query('SELECT * FROM Requests ORDER BY id DESC LIMIT 1', function(error, results, fields) {
            if (error) {
                obj.emit(':tell', 'Sorry, there was problem with our database');
                throw error;
            } else {
                const res = results[0];
                connection.end();
                obj.emit(':tell', res.location);
            }
        });


    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
