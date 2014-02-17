/*!
Animate.css - http://daneden.me/animate
Licensed under the MIT license

Copyright (c) 2013 Daniel Eden

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
module.exports = function(value) {

	var r = {};
	r['-wmso-animation-name'] = '';
	r['-wmso-animation-duration'] = '1s',
	name = '';

	if(typeof value === 'string') {
		r['-wmso-animation-name'] = value;
	} else if(typeof value === 'object') {

		if(value instanceof Array) {
			if(value.length === 1) {
				r['-wmso-animation-name'] = value[0];
			} else if(value.length === 2) {
				r = {
					keyframes: {
						name: value[0],
						frames: value[1]
					}
				};
			} else {
				value = r = {};
			}
		} else {
			r['-wmso-animation-name'] = value.name;
			value.duration ? r['-wmso-animation-duration'] = value.duration : '';
			value.fillMode ? r['-wmso-animation-fill-mode'] = value.fillMode : '';
			value.timingFunction ? r['-wmso-animation-timing-function'] = value.timingFunction : '';
			value.iterationCount ? r['-wmso-animation-iteration-count'] = value.iterationCount : '';
			value.delay ? r['-wmso-animation-delay'] = value.delay : '';
			value.direction ? r['-wmso-animation-direction'] = value.direction : '';
			value.playState ? r['-wmso-animation-play-state'] = value.playState : '';
			if(value.frames) {
				r.keyframes = {
					name: value.name,
					frames: value.frames
				}
			}
		}
		
	}

	switch(r['-wmso-animation-name']) {

case "blink":
	r.keyframes = {
		name: "blink",
		frames: {
			"0%, 100%": {
				transparent: 0
			},
			"50%": {
				transparent: 1
			}
		}
	}
break;

case "bounce":
	r.keyframes = {
		name: "bounce",
		frames: {
			"0%, 20%, 50%, 80%, 100%": {
				"-wmso-transform": "translateY(0)"
			},
			"40%": {
				"-wmso-transform": "translateY(-30px)"
			},
			"60%": {
				"-wmso-transform": "translateY(-15px)"
			}
		}
	}
break;

case "flash":
	r.keyframes = {
		name: "flash",
		frames: {
			"0%, 50%, 100%": {
				"opacity": "1"
			},
			"25%, 75%": {
				"opacity": "0"
			}
		}
	}
break;

case "pulse":
	r.keyframes = {
		name: "pulse",
		frames: {
			"0%": {
				"-wmso-transform": "scale(1)"
			},
			"50%": {
				"-wmso-transform": "scale(1.1)"
			},
			"100%": {
				"-wmso-transform": "scale(1)"
			}
		}
	}
break;

case "shake":
	r.keyframes = {
		name: "shake",
		frames: {
			"0%, 100%": {
				"-wmso-transform": "translateX(0)"
			},
			"10%, 30%, 50%, 70%, 90%": {
				"-wmso-transform": "translateX(-10px)"
			},
			"20%, 40%, 60%, 80%": {
				"-wmso-transform": "translateX(10px)"
			}
		}
	}
break;

case "swing":
	r.keyframes = {
		name: "swing",
		frames: {
			"20%": {
				"-wmso-transform": "rotate(15deg)"
			},
			"40%": {
				"-wmso-transform": "rotate(-10deg)"
			},
			"60%": {
				"-wmso-transform": "rotate(5deg)"
			},
			"80%": {
				"-wmso-transform": "rotate(-5deg)"
			},
			"100%": {
				"-wmso-transform": "rotate(0deg)"
			}
		}
	}
break;

case "tada":
	r.keyframes = {
		name: "tada",
		frames: {
			"0%": {
				"-wmso-transform": "scale(1)"
			},
			"10%, 20%": {
				"-wmso-transform": "scale(0.9) rotate(-3deg)"
			},
			"30%, 50%, 70%, 90%": {
				"-wmso-transform": "scale(1.1) rotate(3deg)"
			},
			"40%, 60%, 80%": {
				"-wmso-transform": "scale(1.1) rotate(-3deg)"
			},
			"100%": {
				"-wmso-transform": "scale(1) rotate(0)"
			}
		}
	}
break;

case "wobble":
	r.keyframes = {
		name: "wobble",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0%)"
			},
			"15%": {
				"-wmso-transform": "translateX(-25%) rotate(-5deg)"
			},
			"30%": {
				"-wmso-transform": "translateX(20%) rotate(3deg)"
			},
			"45%": {
				"-wmso-transform": "translateX(-15%) rotate(-3deg)"
			},
			"60%": {
				"-wmso-transform": "translateX(10%) rotate(2deg)"
			},
			"75%": {
				"-wmso-transform": "translateX(-5%) rotate(-1deg)"
			},
			"100%": {
				"-wmso-transform": "translateX(0%)"
			}
		}
	}
break;

case "bounceIn":
	r.keyframes = {
		name: "bounceIn",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "scale(.3)"
			},
			"50%": {
				"opacity": "1",
				"-wmso-transform": "scale(1.05)"
			},
			"70%": {
				"-wmso-transform": "scale(.9)"
			},
			"100%": {
				"-wmso-transform": "scale(1)"
			}
		}
	}
break;

case "bounceInDown":
	r.keyframes = {
		name: "bounceInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			},
			"60%": {
				"opacity": "1",
				"-wmso-transform": "translateY(30px)"
			},
			"80%": {
				"-wmso-transform": "translateY(-10px)"
			},
			"100%": {
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "bounceInLeft":
	r.keyframes = {
		name: "bounceInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			},
			"60%": {
				"opacity": "1",
				"-wmso-transform": "translateX(30px)"
			},
			"80%": {
				"-wmso-transform": "translateX(-10px)"
			},
			"100%": {
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "bounceInRight":
	r.keyframes = {
		name: "bounceInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			},
			"60%": {
				"opacity": "1",
				"-wmso-transform": "translateX(-30px)"
			},
			"80%": {
				"-wmso-transform": "translateX(10px)"
			},
			"100%": {
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "bounceInUp":
	r.keyframes = {
		name: "bounceInUp",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(2000px)"
			},
			"60%": {
				"opacity": "1",
				"-wmso-transform": "translateY(-30px)"
			},
			"80%": {
				"-wmso-transform": "translateY(10px)"
			},
			"100%": {
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "bounceOut":
	r.keyframes = {
		name: "bounceOut",
		frames: {
			"0%": {
				"-wmso-transform": "scale(1)"
			},
			"25%": {
				"-wmso-transform": "scale(.95)"
			},
			"50%": {
				"opacity": "1",
				"-wmso-transform": "scale(1.1)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "scale(.3)"
			}
		}
	}
break;

case "bounceOutDown":
	r.keyframes = {
		name: "bounceOutDown",
		frames: {
			"0%": {
				"-wmso-transform": "translateY(0)"
			},
			"20%": {
				"opacity": "1",
				"-wmso-transform": "translateY(-20px)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(2000px)"
			}
		}
	}
break;

case "bounceOutLeft":
	r.keyframes = {
		name: "bounceOutLeft",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0)"
			},
			"20%": {
				"opacity": "1",
				"-wmso-transform": "translateX(20px)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			}
		}
	}
break;

case "bounceOutRight":
	r.keyframes = {
		name: "bounceOutRight",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0)"
			},
			"20%": {
				"opacity": "1",
				"-wmso-transform": "translateX(-20px)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			}
		}
	}
break;

case "bounceOutUp":
	r.keyframes = {
		name: "bounceOutUp",
		frames: {
			"0%": {
				"-wmso-transform": "translateY(0)"
			},
			"20%": {
				"opacity": "1",
				"-wmso-transform": "translateY(20px)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			}
		}
	}
break;

case "fadeIn":
	r.keyframes = {
		name: "fadeIn",
		frames: {
			"0%": {
				"opacity": "0"
			},
			"100%": {
				"opacity": "1"
			}
		}
	}
break;

case "fadeInDown":
	r.keyframes = {
		name: "fadeInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-20px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "fadeInDownBig":
	r.keyframes = {
		name: "fadeInDownBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "fadeInLeft":
	r.keyframes = {
		name: "fadeInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-20px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "fadeInLeftBig":
	r.keyframes = {
		name: "fadeInLeftBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "fadeInRight":
	r.keyframes = {
		name: "fadeInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(20px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "fadeInRightBig":
	r.keyframes = {
		name: "fadeInRightBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "fadeInUp":
	r.keyframes = {
		name: "fadeInUp",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(20px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "fadeInUpBig":
	r.keyframes = {
		name: "fadeInUpBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(2000px)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "fadeOut":
	r.keyframes = {
		name: "fadeOut",
		frames: {
			"0%": {
				"opacity": "1"
			},
			"100%": {
				"opacity": "0"
			}
		}
	}
break;

case "fadeOutDown":
	r.keyframes = {
		name: "fadeOutDown",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(20px)"
			}
		}
	}
break;

case "fadeOutDownBig":
	r.keyframes = {
		name: "fadeOutDownBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(2000px)"
			}
		}
	}
break;

case "fadeOutLeft":
	r.keyframes = {
		name: "fadeOutLeft",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-20px)"
			}
		}
	}
break;

case "fadeOutLeftBig":
	r.keyframes = {
		name: "fadeOutLeftBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			}
		}
	}
break;

case "fadeOutRight":
	r.keyframes = {
		name: "fadeOutRight",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(20px)"
			}
		}
	}
break;

case "fadeOutRightBig":
	r.keyframes = {
		name: "fadeOutRightBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			}
		}
	}
break;

case "fadeOutUp":
	r.keyframes = {
		name: "fadeOutUp",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-20px)"
			}
		}
	}
break;

case "fadeOutUpBig":
	r.keyframes = {
		name: "fadeOutUpBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			}
		}
	}
break;

case "flip":
	r.keyframes = {
		name: "flip",
		frames: {
			"0%": {
				"-wmso-transform": "perspective(400px) translateZ(0) rotateY(0) scale(1)",
				"animation-timing-function": "ease-out"
			},
			"40%": {
				"-wmso-transform": "perspective(400px) translateZ(150px) rotateY(170deg) scale(1)",
				"animation-timing-function": "ease-out"
			},
			"50%": {
				"-wmso-transform": "perspective(400px) translateZ(150px) rotateY(190deg) scale(1)",
				"animation-timing-function": "ease-in"
			},
			"80%": {
				"-wmso-transform": "perspective(400px) translateZ(0) rotateY(360deg) scale(.95)",
				"animation-timing-function": "ease-in"
			},
			"100%": {
				"-wmso-transform": "perspective(400px) translateZ(0) rotateY(360deg) scale(1)",
				"animation-timing-function": "ease-in"
			}
		}
	}
break;

case "flipInX":
	r.keyframes = {
		name: "flipInX",
		frames: {
			"0%": {
				"-wmso-transform": "perspective(400px) rotateX(90deg)",
				"opacity": "0"
			},
			"40%": {
				"-wmso-transform": "perspective(400px) rotateX(-10deg)"
			},
			"70%": {
				"-wmso-transform": "perspective(400px) rotateX(10deg)"
			},
			"100%": {
				"-wmso-transform": "perspective(400px) rotateX(0deg)",
				"opacity": "1"
			}
		}
	}
break;

case "flipInY":
	r.keyframes = {
		name: "flipInY",
		frames: {
			"0%": {
				"-wmso-transform": "perspective(400px) rotateY(90deg)",
				"opacity": "0"
			},
			"40%": {
				"-wmso-transform": "perspective(400px) rotateY(-10deg)"
			},
			"70%": {
				"-wmso-transform": "perspective(400px) rotateY(10deg)"
			},
			"100%": {
				"-wmso-transform": "perspective(400px) rotateY(0deg)",
				"opacity": "1"
			}
		}
	}
break;

case "flipOutX":
	r.keyframes = {
		name: "flipOutX",
		frames: {
			"0%": {
				"-wmso-transform": "perspective(400px) rotateX(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-wmso-transform": "perspective(400px) rotateX(90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "flipOutY":
	r.keyframes = {
		name: "flipOutY",
		frames: {
			"0%": {
				"-wmso-transform": "perspective(400px) rotateY(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-wmso-transform": "perspective(400px) rotateY(90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "lightSpeedIn":
	r.keyframes = {
		name: "lightSpeedIn",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(100%) skewX(-30deg)",
				"opacity": "0"
			},
			"60%": {
				"-wmso-transform": "translateX(-20%) skewX(30deg)",
				"opacity": "1"
			},
			"80%": {
				"-wmso-transform": "translateX(0%) skewX(-15deg)",
				"opacity": "1"
			},
			"100%": {
				"-wmso-transform": "translateX(0%) skewX(0deg)",
				"opacity": "1"
			}
		}
	}
break;

case "lightSpeedOut":
	r.keyframes = {
		name: "lightSpeedOut",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0%) skewX(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-wmso-transform": "translateX(100%) skewX(-30deg)",
				"opacity": "0"
			}
		}
	}
break;

case "rotateIn":
	r.keyframes = {
		name: "rotateIn",
		frames: {
			"0%": {
				"transform-origin": "center center",
				"-wmso-transform": "rotate(-200deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "center center",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
break;

case "rotateInDownLeft":
	r.keyframes = {
		name: "rotateInDownLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(-90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
break;

case "rotateInDownRight":
	r.keyframes = {
		name: "rotateInDownRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
break;

case "rotateInUpLeft":
	r.keyframes = {
		name: "rotateInUpLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
break;

case "rotateInUpRight":
	r.keyframes = {
		name: "rotateInUpRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(-90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
break;

case "rotateOut":
	r.keyframes = {
		name: "rotateOut",
		frames: {
			"0%": {
				"transform-origin": "center center",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "center center",
				"-wmso-transform": "rotate(200deg)",
				"opacity": "0"
			}
		}
	}
break;

case "rotateOutDownLeft":
	r.keyframes = {
		name: "rotateOutDownLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "rotateOutDownRight":
	r.keyframes = {
		name: "rotateOutDownRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(-90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "rotateOutUpLeft":
	r.keyframes = {
		name: "rotateOutUpLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-wmso-transform": "rotate(-90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "rotateOutUpRight":
	r.keyframes = {
		name: "rotateOutUpRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-wmso-transform": "rotate(90deg)",
				"opacity": "0"
			}
		}
	}
break;

case "slideInDown":
	r.keyframes = {
		name: "slideInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			},
			"100%": {
				"-wmso-transform": "translateY(0)"
			}
		}
	}
break;

case "slideInLeft":
	r.keyframes = {
		name: "slideInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			},
			"100%": {
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "slideInRight":
	r.keyframes = {
		name: "slideInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			},
			"100%": {
				"-wmso-transform": "translateX(0)"
			}
		}
	}
break;

case "slideOutLeft":
	r.keyframes = {
		name: "slideOutLeft",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-2000px)"
			}
		}
	}
break;

case "slideOutRight":
	r.keyframes = {
		name: "slideOutRight",
		frames: {
			"0%": {
				"-wmso-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(2000px)"
			}
		}
	}
break;

case "slideOutUp":
	r.keyframes = {
		name: "slideOutUp",
		frames: {
			"0%": {
				"-wmso-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateY(-2000px)"
			}
		}
	}
break;

case "hinge":
	r.keyframes = {
		name: "hinge",
		frames: {
			"0%": {
				"-wmso-transform": "rotate(0)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"20%, 60%": {
				"-wmso-transform": "rotate(80deg)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"40%": {
				"-wmso-transform": "rotate(60deg)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"80%": {
				"-wmso-transform": "rotate(60deg) translateY(0)",
				"opacity": "1",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"100%": {
				"-wmso-transform": "translateY(700px)",
				"opacity": "0"
			}
		}
	}
break;

case "rollIn":
	r.keyframes = {
		name: "rollIn",
		frames: {
			"0%": {
				"opacity": "0",
				"-wmso-transform": "translateX(-100%) rotate(-120deg)"
			},
			"100%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0px) rotate(0deg)"
			}
		}
	}
break;

case "rollOut":
	r.keyframes = {
		name: "rollOut",
		frames: {
			"0%": {
				"opacity": "1",
				"-wmso-transform": "translateX(0px) rotate(0deg)"
			},
			"100%": {
				"opacity": "0",
				"-wmso-transform": "translateX(100%) rotate(120deg)"
			}
		}
	}
break;

	}
	return r;
}