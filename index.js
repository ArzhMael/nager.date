#!/usr/bin/env node

//#region NPM PACKAGES

const axios = require('axios');
const { getCode, getName } = require('country-list');
const clc = require("cli-color");

//#endregion

let URL = "https://date.nager.at/api/v2/publicholidays/";
let errorMessage = clc.red('ERROR\nInvalid Arguments - ');
let country = "";
let countryCode = "";
let year = 0;
let holidays;
let myArgs = process.argv;
myArgs.splice(0, 2);

start();

function start() {
    console.log(clc.green("\n--------------------------------"));
    console.log(clc.green("-- Welcome to NAGER.DATE TOOL --"));
    console.log(clc.green("--------------------------------"));
    console.log();
    checkArgs();
}

function argsErrorMessage(message) {
    errorMessage += clc.red(message);
    console.error(errorMessage);
    process.exit();
}

function checkArgs() {
    // Check if there is exactly 2 args (one for the country and one for the year).
    if (myArgs.length != 2) {
        argsErrorMessage(
            "You must give 2 arguments : Country (String) and Year (Integer)."
            + "\nexample: $ node NodeJS-CLI \"United States of America\" 2020"
        );
    }

    // Check if there is exaclty ONE string (the country) and ONE number (the year) and make data verifications.
    let _number = 0;
    let _string = 0;

    myArgs.forEach(element => {
        if (isNaN(element)) {
            _string++;

            if (element.length == 2) {
                countryCode = element;
                country = getName(element);
                if (country == undefined) {
                    argsErrorMessage("Invalid country code");
                }

            }
            else if (element.length > 2) {
                country = element;
                countryCode = getCode(element);
                if (countryCode == undefined) {
                    argsErrorMessage("Invalid country name");
                }
            }
            else {
                argsErrorMessage("Invalid country or country code");
            }
        }
        else {
            _number++;
            if (!Number.isInteger(parseFloat(element))) {
                argsErrorMessage("The date must be an integer");
            }
            year = element;
        }
    });
    if (_number != 1 || _string != 1) {
        argsErrorMessage(
            "You must give 2 arguments : Country (String) and Year (Integer)."
            + "\nexample: $ node NodeJS-CLI \"United States of America\" 2020"
        );
    }
    success();
}

async function success() {
    console.log(clc.green("Holydays for the year "+clc.blue(year)+" in "+clc.blue(country.toUpperCase()+" ("+countryCode.toUpperCase()+")")+ " are :\n"));
    URL += year + '/' + countryCode;
    request();
}

async function request() {

    await axios({
        method: 'get',
        url: URL,
    }).then(function (response) {
        holidays = response.data;
    });

    processData();
    console.log();
    console.log(clc.green('Happy Holidays !'));
    console.log();
    process.exit();
}

function processData() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];   
    
    holidays.forEach(element => {
        let date = new Date(element.date);
        console.log(clc.green("> ")+clc.blue(date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear())+clc.green(" - ")+element.name);
    });
}
