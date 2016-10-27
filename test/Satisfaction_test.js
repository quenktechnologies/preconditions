import must from 'must';
import {
    Failure
} from 'criteria-pattern-core';
import Satisfaction from '../src/Satisfaction';
import BulkFailure from '../src/BulkFailure';

var satisfaction;

describe('Satisfaction', function() {

    describe('apply()', function() {

        beforeEach(function() {

            satisfaction = new Satisfaction();

        });

        it('should run each criteria', function() {

            return satisfaction.apply({
                name: 'Keith Rowley',
                job: 'lawyer',
                age: 75
            }, {
                name: {
                    satisfy: v => v.toLowerCase()
                },
                job: {
                    satisfy: v => 'politician'
                },
                age: {
                    satisfy: v => v - 15
                }
            }).
            then(function(report) {

                must(report).eql({
                    name: 'keith rowley',
                    job: 'politician',
                    age: 60
                });

            });

        });

        it('should recognize when a Failure occurs', function() {

            return satisfaction.apply({
                name: 'Keith Rowley',
                job: 'lawyer',
                age: 'old'
            }, {
                name: {
                    satisfy: v => v.toLowerCase()
                },
                job: {
                    satisfy: v => 'politician'
                },
                age: {
                    satisfy: v => new Failure('Must be number!')
                }
            }).
            then(function(report) {

                must(report).be.instanceOf(BulkFailure);

                must(report.errors).eql({
                    age: 'Must be number!'
                });

            });

        });

        it('should not execute a chain if the value is not supplied', function() {

            return satisfaction.apply({
                name: 'Keith Rowley',
            }, {
                name: {
                    satisfy: v => v.toLowerCase()
                },
                job: {
                    satisfy: v => 'politician'
                },
                age: {
                    satisfy: v => new Failure('Must be number!')
                }
            }).
            then(function(report) {

                must(report).eql({
                    name: 'keith rowley'
                });
            });
        });

        it('should execute a chain if the value is not supplied but the Criterion is required', function() {

            return satisfaction.apply({
                name: 'Keith Rowley',
            }, {
                name: {
                    satisfy: v => v.toLowerCase()
                },
                job: {
                    required: true,
                    satisfy: v => 'politician'
                },
                age: {
                    satisfy: v => new Failure('Must be number!')
                }
            }).
            then(function(report) {

                must(report).eql({
                    name: 'keith rowley',
                  job: 'politician'
                });

            });
        });

    });
});
