import must from 'must';
import {
    Failure
} from 'criteria-pattern-core';
import Satisfaction from '../src/Satisfaction';
import BulkFailure from '../src/BulkFailure';

var strategy;

describe('Satisfaction', function() {

    describe('apply()', function() {

        beforeEach(function() {

            strategy = new Satisfaction();

        });

        it('should run each criteria', function() {

            return strategy.apply({
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

            return strategy.apply({
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

    });
});
