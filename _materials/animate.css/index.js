var glob = require("glob"),
	path = require("path"),
	fs = require("fs"),
	cssparse = require("css-parse");
glob("./source/**/*.css", {}, function (er, files) {
	var code = '';
	for(var i=0; i<files.length, f=files[i]; i++) {
		var animationName = path.basename(f).replace(/\.css/g, '');
		var fileContent = fs.readFileSync(f, { encoding: 'utf8' });
		// if(i == 0) {
			fileContent = fileContent.split("}\n\n")[0] + "}";
			fileContent = fileContent.replace(/\n/g, '');
			fileContent = fileContent.replace(/\r/g, '');
			fileContent = fileContent.replace(/\t/g, '');
			console.log(f);
			var o = cssparse(fileContent);
			var keyframes = o.stylesheet.rules[0].keyframes;
			var keyframesCode = '';
			for(var j=0; j<keyframes.length, k=keyframes[j]; j++) {
				var properties = '';
				for(var m=0; m<k.declarations.length, p=k.declarations[m]; m++) {
					if(p.property == 'transform') p.property = '-w-transform';
					properties += '				"' + p.property + '": "' + p.value + '"';
					if(m < k.declarations.length-1) {
						properties += ',\n';
					} else {
						properties += '\n';
					}
				}
				keyframesCode += '\
			"' + k.values.join(", ") + '": {\n' + properties + '			}';
				if(j < keyframes.length-1) {
					keyframesCode += ',\n';
				} else {
					keyframesCode += '\n';
				}
			}
			code += '\n\
case "' + animationName + '":\n\
	r.keyframes = {\n\
		name: "' + animationName + '",\n\
		frames: {\n\
' + keyframesCode + '\
		}\n\
	}\n\
	r["-w-animation-name"] = "' + animationName + '";\n\
break;\n\
';
			
		// }
	}
	fs.writeFileSync('code.js', code, {encoding: 'utf8'});
});

/*

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

*/