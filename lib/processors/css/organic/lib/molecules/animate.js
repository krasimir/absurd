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
	r['-w-animation-duration'] = '1s';
	r['-w-animation-fill-mode'] = 'both';
	switch(value) {

case "bounce":
	r.keyframes = {
		name: "bounce",
		frames: {
			"0%, 20%, 50%, 80%, 100%": {
				"-w-transform": "translateY(0)"
			},
			"40%": {
				"-w-transform": "translateY(-30px)"
			},
			"60%": {
				"-w-transform": "translateY(-15px)"
			}
		}
	}
	r["-w-animation-name"] = "bounce";
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
	r["-w-animation-name"] = "flash";
break;

case "pulse":
	r.keyframes = {
		name: "pulse",
		frames: {
			"0%": {
				"-w-transform": "scale(1)"
			},
			"50%": {
				"-w-transform": "scale(1.1)"
			},
			"100%": {
				"-w-transform": "scale(1)"
			}
		}
	}
	r["-w-animation-name"] = "pulse";
break;

case "shake":
	r.keyframes = {
		name: "shake",
		frames: {
			"0%, 100%": {
				"-w-transform": "translateX(0)"
			},
			"10%, 30%, 50%, 70%, 90%": {
				"-w-transform": "translateX(-10px)"
			},
			"20%, 40%, 60%, 80%": {
				"-w-transform": "translateX(10px)"
			}
		}
	}
	r["-w-animation-name"] = "shake";
break;

case "swing":
	r.keyframes = {
		name: "swing",
		frames: {
			"20%": {
				"-w-transform": "rotate(15deg)"
			},
			"40%": {
				"-w-transform": "rotate(-10deg)"
			},
			"60%": {
				"-w-transform": "rotate(5deg)"
			},
			"80%": {
				"-w-transform": "rotate(-5deg)"
			},
			"100%": {
				"-w-transform": "rotate(0deg)"
			}
		}
	}
	r["-w-animation-name"] = "swing";
break;

case "tada":
	r.keyframes = {
		name: "tada",
		frames: {
			"0%": {
				"-w-transform": "scale(1)"
			},
			"10%, 20%": {
				"-w-transform": "scale(0.9) rotate(-3deg)"
			},
			"30%, 50%, 70%, 90%": {
				"-w-transform": "scale(1.1) rotate(3deg)"
			},
			"40%, 60%, 80%": {
				"-w-transform": "scale(1.1) rotate(-3deg)"
			},
			"100%": {
				"-w-transform": "scale(1) rotate(0)"
			}
		}
	}
	r["-w-animation-name"] = "tada";
break;

case "wobble":
	r.keyframes = {
		name: "wobble",
		frames: {
			"0%": {
				"-w-transform": "translateX(0%)"
			},
			"15%": {
				"-w-transform": "translateX(-25%) rotate(-5deg)"
			},
			"30%": {
				"-w-transform": "translateX(20%) rotate(3deg)"
			},
			"45%": {
				"-w-transform": "translateX(-15%) rotate(-3deg)"
			},
			"60%": {
				"-w-transform": "translateX(10%) rotate(2deg)"
			},
			"75%": {
				"-w-transform": "translateX(-5%) rotate(-1deg)"
			},
			"100%": {
				"-w-transform": "translateX(0%)"
			}
		}
	}
	r["-w-animation-name"] = "wobble";
break;

case "bounceIn":
	r.keyframes = {
		name: "bounceIn",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "scale(.3)"
			},
			"50%": {
				"opacity": "1",
				"-w-transform": "scale(1.05)"
			},
			"70%": {
				"-w-transform": "scale(.9)"
			},
			"100%": {
				"-w-transform": "scale(1)"
			}
		}
	}
	r["-w-animation-name"] = "bounceIn";
break;

case "bounceInDown":
	r.keyframes = {
		name: "bounceInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			},
			"60%": {
				"opacity": "1",
				"-w-transform": "translateY(30px)"
			},
			"80%": {
				"-w-transform": "translateY(-10px)"
			},
			"100%": {
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "bounceInDown";
break;

case "bounceInLeft":
	r.keyframes = {
		name: "bounceInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			},
			"60%": {
				"opacity": "1",
				"-w-transform": "translateX(30px)"
			},
			"80%": {
				"-w-transform": "translateX(-10px)"
			},
			"100%": {
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "bounceInLeft";
break;

case "bounceInRight":
	r.keyframes = {
		name: "bounceInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			},
			"60%": {
				"opacity": "1",
				"-w-transform": "translateX(-30px)"
			},
			"80%": {
				"-w-transform": "translateX(10px)"
			},
			"100%": {
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "bounceInRight";
break;

case "bounceInUp":
	r.keyframes = {
		name: "bounceInUp",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(2000px)"
			},
			"60%": {
				"opacity": "1",
				"-w-transform": "translateY(-30px)"
			},
			"80%": {
				"-w-transform": "translateY(10px)"
			},
			"100%": {
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "bounceInUp";
break;

case "bounceOut":
	r.keyframes = {
		name: "bounceOut",
		frames: {
			"0%": {
				"-w-transform": "scale(1)"
			},
			"25%": {
				"-w-transform": "scale(.95)"
			},
			"50%": {
				"opacity": "1",
				"-w-transform": "scale(1.1)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "scale(.3)"
			}
		}
	}
	r["-w-animation-name"] = "bounceOut";
break;

case "bounceOutDown":
	r.keyframes = {
		name: "bounceOutDown",
		frames: {
			"0%": {
				"-w-transform": "translateY(0)"
			},
			"20%": {
				"opacity": "1",
				"-w-transform": "translateY(-20px)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(2000px)"
			}
		}
	}
	r["-w-animation-name"] = "bounceOutDown";
break;

case "bounceOutLeft":
	r.keyframes = {
		name: "bounceOutLeft",
		frames: {
			"0%": {
				"-w-transform": "translateX(0)"
			},
			"20%": {
				"opacity": "1",
				"-w-transform": "translateX(20px)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "bounceOutLeft";
break;

case "bounceOutRight":
	r.keyframes = {
		name: "bounceOutRight",
		frames: {
			"0%": {
				"-w-transform": "translateX(0)"
			},
			"20%": {
				"opacity": "1",
				"-w-transform": "translateX(-20px)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			}
		}
	}
	r["-w-animation-name"] = "bounceOutRight";
break;

case "bounceOutUp":
	r.keyframes = {
		name: "bounceOutUp",
		frames: {
			"0%": {
				"-w-transform": "translateY(0)"
			},
			"20%": {
				"opacity": "1",
				"-w-transform": "translateY(20px)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "bounceOutUp";
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
	r["-w-animation-name"] = "fadeIn";
break;

case "fadeInDown":
	r.keyframes = {
		name: "fadeInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(-20px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInDown";
break;

case "fadeInDownBig":
	r.keyframes = {
		name: "fadeInDownBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInDownBig";
break;

case "fadeInLeft":
	r.keyframes = {
		name: "fadeInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(-20px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInLeft";
break;

case "fadeInLeftBig":
	r.keyframes = {
		name: "fadeInLeftBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInLeftBig";
break;

case "fadeInRight":
	r.keyframes = {
		name: "fadeInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(20px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInRight";
break;

case "fadeInRightBig":
	r.keyframes = {
		name: "fadeInRightBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInRightBig";
break;

case "fadeInUp":
	r.keyframes = {
		name: "fadeInUp",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(20px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInUp";
break;

case "fadeInUpBig":
	r.keyframes = {
		name: "fadeInUpBig",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(2000px)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "fadeInUpBig";
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
	r["-w-animation-name"] = "fadeOut";
break;

case "fadeOutDown":
	r.keyframes = {
		name: "fadeOutDown",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(20px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutDown";
break;

case "fadeOutDownBig":
	r.keyframes = {
		name: "fadeOutDownBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(2000px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutDownBig";
break;

case "fadeOutLeft":
	r.keyframes = {
		name: "fadeOutLeft",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(-20px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutLeft";
break;

case "fadeOutLeftBig":
	r.keyframes = {
		name: "fadeOutLeftBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutLeftBig";
break;

case "fadeOutRight":
	r.keyframes = {
		name: "fadeOutRight",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(20px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutRight";
break;

case "fadeOutRightBig":
	r.keyframes = {
		name: "fadeOutRightBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutRightBig";
break;

case "fadeOutUp":
	r.keyframes = {
		name: "fadeOutUp",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(-20px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutUp";
break;

case "fadeOutUpBig":
	r.keyframes = {
		name: "fadeOutUpBig",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "fadeOutUpBig";
break;

case "flip":
	r.keyframes = {
		name: "flip",
		frames: {
			"0%": {
				"-w-transform": "perspective(400px) translateZ(0) rotateY(0) scale(1)",
				"animation-timing-function": "ease-out"
			},
			"40%": {
				"-w-transform": "perspective(400px) translateZ(150px) rotateY(170deg) scale(1)",
				"animation-timing-function": "ease-out"
			},
			"50%": {
				"-w-transform": "perspective(400px) translateZ(150px) rotateY(190deg) scale(1)",
				"animation-timing-function": "ease-in"
			},
			"80%": {
				"-w-transform": "perspective(400px) translateZ(0) rotateY(360deg) scale(.95)",
				"animation-timing-function": "ease-in"
			},
			"100%": {
				"-w-transform": "perspective(400px) translateZ(0) rotateY(360deg) scale(1)",
				"animation-timing-function": "ease-in"
			}
		}
	}
	r["-w-animation-name"] = "flip";
break;

case "flipInX":
	r.keyframes = {
		name: "flipInX",
		frames: {
			"0%": {
				"-w-transform": "perspective(400px) rotateX(90deg)",
				"opacity": "0"
			},
			"40%": {
				"-w-transform": "perspective(400px) rotateX(-10deg)"
			},
			"70%": {
				"-w-transform": "perspective(400px) rotateX(10deg)"
			},
			"100%": {
				"-w-transform": "perspective(400px) rotateX(0deg)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "flipInX";
break;

case "flipInY":
	r.keyframes = {
		name: "flipInY",
		frames: {
			"0%": {
				"-w-transform": "perspective(400px) rotateY(90deg)",
				"opacity": "0"
			},
			"40%": {
				"-w-transform": "perspective(400px) rotateY(-10deg)"
			},
			"70%": {
				"-w-transform": "perspective(400px) rotateY(10deg)"
			},
			"100%": {
				"-w-transform": "perspective(400px) rotateY(0deg)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "flipInY";
break;

case "flipOutX":
	r.keyframes = {
		name: "flipOutX",
		frames: {
			"0%": {
				"-w-transform": "perspective(400px) rotateX(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-w-transform": "perspective(400px) rotateX(90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "flipOutX";
break;

case "flipOutY":
	r.keyframes = {
		name: "flipOutY",
		frames: {
			"0%": {
				"-w-transform": "perspective(400px) rotateY(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-w-transform": "perspective(400px) rotateY(90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "flipOutY";
break;

case "lightSpeedIn":
	r.keyframes = {
		name: "lightSpeedIn",
		frames: {
			"0%": {
				"-w-transform": "translateX(100%) skewX(-30deg)",
				"opacity": "0"
			},
			"60%": {
				"-w-transform": "translateX(-20%) skewX(30deg)",
				"opacity": "1"
			},
			"80%": {
				"-w-transform": "translateX(0%) skewX(-15deg)",
				"opacity": "1"
			},
			"100%": {
				"-w-transform": "translateX(0%) skewX(0deg)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "lightSpeedIn";
break;

case "lightSpeedOut":
	r.keyframes = {
		name: "lightSpeedOut",
		frames: {
			"0%": {
				"-w-transform": "translateX(0%) skewX(0deg)",
				"opacity": "1"
			},
			"100%": {
				"-w-transform": "translateX(100%) skewX(-30deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "lightSpeedOut";
break;

case "rotateIn":
	r.keyframes = {
		name: "rotateIn",
		frames: {
			"0%": {
				"transform-origin": "center center",
				"-w-transform": "rotate(-200deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "center center",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "rotateIn";
break;

case "rotateInDownLeft":
	r.keyframes = {
		name: "rotateInDownLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(-90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "rotateInDownLeft";
break;

case "rotateInDownRight":
	r.keyframes = {
		name: "rotateInDownRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "rotateInDownRight";
break;

case "rotateInUpLeft":
	r.keyframes = {
		name: "rotateInUpLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "rotateInUpLeft";
break;

case "rotateInUpRight":
	r.keyframes = {
		name: "rotateInUpRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(-90deg)",
				"opacity": "0"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			}
		}
	}
	r["-w-animation-name"] = "rotateInUpRight";
break;

case "rotateOut":
	r.keyframes = {
		name: "rotateOut",
		frames: {
			"0%": {
				"transform-origin": "center center",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "center center",
				"-w-transform": "rotate(200deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "rotateOut";
break;

case "rotateOutDownLeft":
	r.keyframes = {
		name: "rotateOutDownLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "rotateOutDownLeft";
break;

case "rotateOutDownRight":
	r.keyframes = {
		name: "rotateOutDownRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(-90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "rotateOutDownRight";
break;

case "rotateOutUpLeft":
	r.keyframes = {
		name: "rotateOutUpLeft",
		frames: {
			"0%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "left bottom",
				"-w-transform": "rotate(-90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "rotateOutUpLeft";
break;

case "rotateOutUpRight":
	r.keyframes = {
		name: "rotateOutUpRight",
		frames: {
			"0%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(0)",
				"opacity": "1"
			},
			"100%": {
				"transform-origin": "right bottom",
				"-w-transform": "rotate(90deg)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "rotateOutUpRight";
break;

case "slideInDown":
	r.keyframes = {
		name: "slideInDown",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			},
			"100%": {
				"-w-transform": "translateY(0)"
			}
		}
	}
	r["-w-animation-name"] = "slideInDown";
break;

case "slideInLeft":
	r.keyframes = {
		name: "slideInLeft",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			},
			"100%": {
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "slideInLeft";
break;

case "slideInRight":
	r.keyframes = {
		name: "slideInRight",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			},
			"100%": {
				"-w-transform": "translateX(0)"
			}
		}
	}
	r["-w-animation-name"] = "slideInRight";
break;

case "slideOutLeft":
	r.keyframes = {
		name: "slideOutLeft",
		frames: {
			"0%": {
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "slideOutLeft";
break;

case "slideOutRight":
	r.keyframes = {
		name: "slideOutRight",
		frames: {
			"0%": {
				"-w-transform": "translateX(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(2000px)"
			}
		}
	}
	r["-w-animation-name"] = "slideOutRight";
break;

case "slideOutUp":
	r.keyframes = {
		name: "slideOutUp",
		frames: {
			"0%": {
				"-w-transform": "translateY(0)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateY(-2000px)"
			}
		}
	}
	r["-w-animation-name"] = "slideOutUp";
break;

case "hinge":
	r.keyframes = {
		name: "hinge",
		frames: {
			"0%": {
				"-w-transform": "rotate(0)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"20%, 60%": {
				"-w-transform": "rotate(80deg)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"40%": {
				"-w-transform": "rotate(60deg)",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"80%": {
				"-w-transform": "rotate(60deg) translateY(0)",
				"opacity": "1",
				"transform-origin": "top left",
				"animation-timing-function": "ease-in-out"
			},
			"100%": {
				"-w-transform": "translateY(700px)",
				"opacity": "0"
			}
		}
	}
	r["-w-animation-name"] = "hinge";
break;

case "rollIn":
	r.keyframes = {
		name: "rollIn",
		frames: {
			"0%": {
				"opacity": "0",
				"-w-transform": "translateX(-100%) rotate(-120deg)"
			},
			"100%": {
				"opacity": "1",
				"-w-transform": "translateX(0px) rotate(0deg)"
			}
		}
	}
	r["-w-animation-name"] = "rollIn";
break;

case "rollOut":
	r.keyframes = {
		name: "rollOut",
		frames: {
			"0%": {
				"opacity": "1",
				"-w-transform": "translateX(0px) rotate(0deg)"
			},
			"100%": {
				"opacity": "0",
				"-w-transform": "translateX(100%) rotate(120deg)"
			}
		}
	}
	r["-w-animation-name"] = "rollOut";
break;


		default:
			r = { "-wmo-animation": value };
		break;
	}
	return r;
}