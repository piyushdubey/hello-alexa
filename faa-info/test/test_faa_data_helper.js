'use strict'

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised); //use chai-as-promised

var expect = chai.expect;

var FAADataHelper = require('../faa_data_helper');

chai.config.includeStack = true; //turn on stack trace

describe('FAADataHelper', function() {
	var subject = new FAADataHelper();
	var airportCode;
	
	describe('#getAirportStatus', function() {
		context('with a valid airport code', function() {
			it('returns matching airport code', function() {
				airportCode = 'SFO';
				var value = subject.requestAirportStatus(airportCode).then(function(statusObject) {
					return statusObject.IATA;
				});
				return expect(value).to.eventually.eq(airportCode);
			});
		});

		context('with an invalid airport code', function() {
			it('returns invalid airport code', function() {
				airportCode = 'dfjsdfhsdjkfhjkshjfkhdjsk';
			return expect(subject.requestAirportStatus(airportCode)).to.be.rejectedWith(Error);
		});
		});
	});	

	describe('#formatAirportStatus', function() {
		var status = {
			"delay": "true",
			"name": "Hartsfield-Jackson Atlanta International",
			"ICAO": "KATL",
			"city": "Atlanta",
			"weather": {
	        "visibility": 5.00,
	        "weather": "Light Snow",
	        "meta": {
	        	"credit": "NOAA's National Weather Service",
	        	"updated": "3:54 PM Local",
	        	"url": "http://weather.gov/"
	        },
	        "temp": "36.0 F (2.2 C)",
	        "wind": "Northeast at 9.2mph"
	    },
	    "status": {
	    	"reason": "AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY",
	    	"closureBegin": "",
	    	"endTime": "",
	    	"minDelay": "",
	    	"avgDelay": "57 minutes",
	    	"maxDelay": "",
	    	"closureEnd": "",
	    	"trend": "",
	    	"type": "Ground Delay"
	    }
	};

	context("with status containing no delay", function() {
		it("formats the status as expected", function() {
			status.delay = "false";
			expect(subject.formatAirportStatus(status)).to.eq('There is currently no delay at Hartsfield-Jackson Atlanta International. The current weather conditions are Light Snow, 36.0 F (2.2 C) and wind Northeast at 9.2mph.');
		});
	});
	context("with a status containing a delay", function() {
		it("formats the status as expected", function() {
			status.delay = "true";
			expect(subject.formatAirportStatus(status)).to.eq('There is currently a delay for Hartsfield-Jackson Atlanta International. The average delay time is 57 minutes. Delay is because of the following: AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY. The current weather conditions are Light Snow, 36.0 F (2.2 C) and wind Northeast at 9.2mph.');
		});
	});
	});
});
