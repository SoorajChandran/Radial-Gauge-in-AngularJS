/* Javascript file for Delight Meter - used to render the delight meter when <delight-meter> tag appears in the HTML document*/

'use strict';

/* Initialising Angular application */

var delightMeterApp = angular.module('delightMeterApp', []);

/* Creating directive for the application */

delightMeterApp.directive('delightMeter', function () {

    /*
    @params Default angular parameters $scope, $element, $attrs.
    Link function for angular directive.
    @returns The delight meter to be rendered when the directive is used.
    */
    function link($scope, $element, $attrs) {

        /* Class for DelightMeter */

        function DelightMeterArc() {

            /*
            @param X Co-ordiante of center, Y Co-ordiante of center, radius of the arc, angle in degrees.
            Converts the polar cordinates to cartesian cordinates
            @returns Cartesian value of Polar co-ordinates.
            */

            this.polarToCartesian = function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                this.angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                    x: centerX + (radius * Math.cos(this.angleInRadians)),
                    y: centerY + (radius * Math.sin(this.angleInRadians))
                };
            }

            /*
            @param X co-ordinate of center, Y co-ordinate of center, radius of the arc, starting angle of the arc, ending angle of the arc.
            To supply attributes to SVG path element to describe the arc.
            @returns An array containing attributes for SVG path to describe the arc.
            */
            this.describeArc = function describeArc(x, y, radius, startAngle, endAngle) {
                this.start = this.polarToCartesian(x, y, radius, endAngle);
                this.end = this.polarToCartesian(x, y, radius, startAngle);
                this.arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                this.d = [
                    "M", this.start.x, this.start.y,
                    "A", radius, radius, 0, this.arcSweep, 0, this.end.x, this.end.y
                ].join(" ");
                return this.d;
            }

            /*
            @params Delight Score read from the scope variable (from range bar in this case).
            Rotates the needle to the specified score.
            @returns nothing.
            */
            this.scoreRotateNeedle = function scoreRotateNeedle(delightScore) {
                if (isNaN(delightScore)) {
                    alert("Please enter an integer value");
                }
                if (delightScore < 0 || delightScore > 100) {
                    alert("We would like you to rate us in 0-100 please");
                    return false;
                }
                /* To convert the delight score into corresponding degree for needle to rotate */
                delightScore = delightScore * 1.8;
                /*
                To rotate the needle to the desired score.
                */
                $('.needleset').css({
                    "transform": "rotate(" + delightScore + "deg)",
                    "transform-origin": "40px 40px"
                });
                /*
                To keep the number in the needle tip without rotating (by rotating it in reverse direction)
                */
                $('.scoreInCircle').css({
                    "transform": "rotate(" + delightScore * -1 + "deg)",
                    "transform-origin": "25px 25px"
                });
            }
        }

        /* Creating object for DelightMeterArc class */
        var objDelightMeterArc = new DelightMeterArc();

        /* Drawing the 5 arcs of the meter by supplying(start co-ordinateX, start co-ordinateY, radius, start angle, end angle)
        to describeArc function. 
        1 degree in between every arc left for white space. */
        document.getElementById("arc1").setAttribute("d", objDelightMeterArc.describeArc(200, 200, 100, -90, -54));
        document.getElementById("arc2").setAttribute("d", objDelightMeterArc.describeArc(200, 200, 100, -53, -18));
        document.getElementById("arc3").setAttribute("d", objDelightMeterArc.describeArc(200, 200, 100, -17, 18));
        document.getElementById("arc4").setAttribute("d", objDelightMeterArc.describeArc(200, 200, 100, 19, 54));
        document.getElementById("arc5").setAttribute("d", objDelightMeterArc.describeArc(200, 200, 100, 55, 90));
        
        /*
        Function to be implemented whenever value of score changes.Calls scoreRotateNeedle with the changed value of score
        */
        $scope.$watch('score', function () {
            objDelightMeterArc.scoreRotateNeedle($scope.score);
        });
    }
    return {
        restrict: 'E',
        templateUrl: 'svgmeter.html',
        scope: {
            score: '=ngModel'
        },
        link: link
    };
});

/* Controller for delight meter app - used to initialise delightScore. */
delightMeterApp.controller('delightMeterController', function ($scope) {
    $scope.delightScore = 0;
   });

