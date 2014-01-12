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
			r['-w-animation-name'] = 'bounce';
		break;
		default:
			r = { "-wmo-animation": value };
		break;
	}
	return r;
}