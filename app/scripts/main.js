(function (){
	// mustache-styled templating
	_.templateSettings = {
		'interpolate': /{{([\s\S]+?)}}/g
	};

})();

(function(){
	'use strict';

	var ringViewVisualizer = {};

	// max number for Token's integer
	ringViewVisualizer.maxLength = '170141183460469231731687303715884105728'.length;

	ringViewVisualizer._validate = function _validate(tokenStrings) {
		_.each(tokenStrings, function (tokenString) {
			if (!_.isString(tokenString)) {
				throw tokenString + ' is not a String';
			}
			if (!/^\d+$/.test(tokenString)) {
				throw tokenString + ' is not an integer';
			}


			// naive implementation}
			if (tokenString.length > this.maxLength) {
				throw tokenString + ' is too big';
			}
		},this);

		var uniq = _.uniq(tokenStrings);
		if(uniq.length !== tokenStrings.length){
			throw 'duplicated values in token string';
		}
	};

	ringViewVisualizer._buildDataCollection = function _buildDataCollection(params) {
		var collection = {};
		_.each(params, function (token) {
				// act as 0-based array
				var index = token.length - 1;
				if (!collection[index]) {
					collection[index] = [];
				}
				collection[index].push(token);
			}
		);
		return collection;
	};

	ringViewVisualizer._createElementsByTokenRange = function _createElementByTokenRange(arity, tokensCollection) {
		var rangesContainers = [];
		for (var i = 1; i <= arity; i++) {
			rangesContainers.push(document.createElement('span'));
		}
		_.each(tokensCollection, function addByRange (tokenChunks, index) {
			_.each(tokenChunks, function addByToken (tokenId) {
				var el = document.createElement('div');
				el.setAttribute('data-token-id', tokenId);
				rangesContainers[index].appendChild(el);
			});
		});
		return rangesContainers;
	};


	ringViewVisualizer._createVisualisation = function _createVusialisation(container, arity, tokens){
		var css = generateCircularAreasClasses(),
			parentElement = document.createElement('div'),
			tokenRanges = this._createElementsByTokenRange(arity, tokens);

		document.head.appendChild(css.style);
		parentElement.classList.add('token-circle-container');

		if(css.classNames.length !== tokenRanges.length){
			throw 'error in css/token calculations for Circle View';
		}

		_.each(tokenRanges, function (tokenDiv, index) {
			tokenDiv.classList.add(css.classNames[index]);
			parentElement.appendChild(tokenDiv);
		});
		return parentElement;
	};

	ringViewVisualizer.generate = function generate(listOfTokens) {
		var arity = this.maxLength,
			container = document.createElement('div');

		this._validate(listOfTokens);

		var tokens = this._buildDataCollection(listOfTokens);
		return this._createVisualisation(container, arity, tokens);
	};

	function generateCircularAreasClasses(){
		var radius = '12em';
		var numberOfArias = '170141183460469231731687303715884105728'.length;
		var degreeDelta = 360/numberOfArias;
		var degree = 270;
		var degreeName;
		var classCode = '';
		var styleElement = document.createElement('style');
		var classNames = [];

		for(var i = 0; i< numberOfArias; i++){
			degreeName = Math.round(degree);
			classNames.push('deg'+degreeName);
			classCode += _.template(
				".deg{{degreeName}} {"+
					"-webkit-transform: rotate({{degree}}) translate({{radius}}) rotate(-{{degree}});"+
					"transform: rotate({{degree}}) translate({{radius}}) rotate(-{{degree}});"+
					"}\n",
				{degree:degree+'deg', radius: radius, degreeName: degreeName}
			);
			degree = degree + degreeDelta;
		}
		styleElement.appendChild(document.createTextNode(classCode));
		return {style:styleElement, classNames: classNames};

	}
	var params = ['1701411834', '123', '93',
		'73', '6923173730371588', '1253111',
		'234233', '69231737303715812333328',
		'3', '69231473730371588', '1231233',
		'1', '124124142', '124124', '12312'
	];

	var container = document.body;

	var visualisation = ringViewVisualizer.generate(params);
	container.appendChild(visualisation);

})();