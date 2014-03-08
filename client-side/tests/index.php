<?php $rand = rand(0, 1000000000); ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>AbsurdJS</title>
	<style type="text/css">
		body {
			background: #E3E3E3;
		}
		.form, .hidden {
			display: none;
		}
	</style>
	<link rel="stylesheet" href="jasmine-1.3.1/jasmine.css">
	<script src="../build/absurd.organic.js"></script>
	<script src="../build/absurd.js"></script>
	<script>
		var require = function(path) {
			if(path == '../../../index.js') return Absurd;
			if(path == '../../index.js') return Absurd;
		}
		var __dirname = "";
	</script>
	<script src="jasmine-1.3.1/jasmine.js"></script>
	<script src="jasmine-1.3.1/jasmine-html.js"></script>
	<script src="utils.js"></script>
	<script src="tests.js"></script>
	<script src="tests.from.node.js"></script>
	<script src="00.str2DOMElement.js"></script>
	<script src="01.components.js"></script>
	<script src="02.components.css.js"></script>
	<script src="13.components.dom.js"></script>
	<script src="03.components.html.js"></script>
	<script src="04.components.complex.js"></script>
	<script src="05.components.events.js"></script>
	<script src="05.components.events.observer.js"></script>
	<script src="06.components.async.js"></script>
	<script src="06.components.nesting.js"></script>
	<script src="07.components.di.js"></script>
	<script src="08.components.utils.js"></script>
	<script src="09.components.apply.helpers.js"></script>
	<script src="10.components.is.js"></script>
	<script src="11.components.router.js"></script>
	<script src="12.components.ajax.js"></script>
	<script src="14.components.mediaqueries.js"></script>
</head>
<body>
	<div id="content"></div>	
	<script>
		(function() {
			var jasmineEnv = jasmine.getEnv();
			var htmlReporter = new jasmine.HtmlReporter(null, document.getElementById("content"));
			jasmineEnv.updateInterval = 1000;
			jasmineEnv.clearReporters();
			jasmineEnv.addReporter(htmlReporter);
			jasmineEnv.specFilter = function(spec) {
				return htmlReporter.specFilter(spec);
			};
			var currentWindowOnload = window.onload;
			window.onload = function() {
				if (currentWindowOnload) {
					currentWindowOnload();
				}
				execJasmine();
			};
			function execJasmine() {
				absurd = Absurd();
				jasmineEnv.execute();
			}
		})();
	</script>

	<p class="hidden">Nothing</p>

	<div id="banner-A" class="<% this.theme %>" style="display: none;">
		<input type="text" />
		<p><% this.text %></p>
		<small>small text</small>
	</div>

	<div class="form">
		<form AUTOCOMPLETE="off" id="form<?php echo $rand; ?>">
			<textarea class="textarea" >blah in textarea</textarea>
			<input type="radio" name="radio" value="blah1">
			<input type="radio" name="radio" value="blah2">
			<input type="checkbox" name="check-options" value="check1">
			<input type="checkbox" name="check-options" value="check2">
			<input type="checkbox" name="check-options" value="check3">
			<select class="select">
				<option value="A">A</option>
				<option value="B" selected="selected">B</option>
				<option value="C">C</option>
				<option value="D">D</option>
			</select>
			<input type="text" value="blah" class="input" />
			<div class="div">div blah</div>
			<span class="span">I'm an inline</span>
			<a class="link" href="#">I'm a link</a>
			<p>A paragraph</p>
			<section class="section">
				<h1>Title here</h1>
				<p>Very long text with <a href='#'>link</a> inside.</p>
			</section>
			<ul class="list">
				<li>option A</li>
				<li>option B</li>
				<li>option C</li>
			</li>
		</form>
	</div>

	<div class="hidden dom-test">
		<form>
		    <input type="radio" value="oA" name="options"> option A
		    <input type="radio" value="oB" name="options" checked> option B
		    <input type="checkbox" value="f1" name="features"> feature 1
		    <input type="checkbox" value="f2" checked name="features"> feature 2
		    <input type="checkbox" value="f3" checked name="features"> feature 2
		</form>
	</div>

	<div class="hidden">
		<div class="content-events">
			<% for(var i=0; i&lt;this.data.length; i++) { %>
			<div class="text" data-absurd-event="click:remove:<% i %>">label <% this.data[i] %></div>
			<% } %>
		</div>
	</div>

	<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-1621908-2', 'absurdjs.com');
      ga('send', 'pageview');
    </script>

</body>
</html>