# AbsurdJS

[![Build Status](https://travis-ci.org/krasimir/absurd.png?branch=master)](https://travis-ci.org/krasimir/absurd)
[![Dependency Status](https://david-dm.org/krasimir/absurd.png?theme=shields.io)](https://david-dm.org/krasimir/absurd)

## Overview

Javascript based preprocessor. No new language, no new syntax. Write everything in plain JavaScript. 

## Installation

### [Server-side](http://absurdjs.com/pages/installation/#node-js)

	npm install -g absurd

### [Client-side](http://absurdjs.com/pages/installation/#client-side-port)

	<script src="absurd.min.js"></script>

## What it does

AbsurdJS was started as CSS preprocessor, but later it was expanded to a HTML preprocessor. So, at the moment you could transform:

  - JavaScript, JSON, YAML, CSS to CSS
  - JavaScript, JSON, YAML to HTML

## How

	var api = Absurd();
	api.add({
		body: {
			marginTop: "20px",
			p: {
				color: "#000"
			}
		}
	});
	api.compile(function(err, css) {
		// use the compiled css
	});

## Official site, documentation and online compilator

[http://absurdjs.com/](http://absurdjs.com/)

## Resources

  - AbsurdJS fundamentals - [link](http://krasimirtsonev.com/blog/article/AbsurdJS-fundamentals)
  - Writing your CSS with JavaScript - [link](http://davidwalsh.name/write-css-javascript)

