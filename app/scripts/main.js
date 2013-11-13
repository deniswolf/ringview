// hello mustache
_.templateSettings = {
	'interpolate': /{{([\s\S]+?)}}/g
};

(function(){
	'use strict';

	var ringViewVisualizer = {};

	// max number for Token's integer
	ringViewVisualizer.maxLength = '170141183460469231731687303715884105728'.length;
	/*
		If we know the maximum possible value,
		it's possible to choose the most optimal distribution,
		here: 34*5 = 170,
		34 was chosen for a better visualization for the current size
	* */
	ringViewVisualizer.maxValueStripped = '170';
	ringViewVisualizer.stepBetweenSectors = 5;
	ringViewVisualizer.numberOfSectors = 34;

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

	ringViewVisualizer._getPositioningBySector = function(maxLength, maxValueStripped, maxSectors, minStep, token){
		var length = token.length;

		if(maxLength < maxValueStripped.length){
			throw 'the token is too big';
		}

		if(maxLength - length >= maxValueStripped.length){
			return 1;
		}

		var cutAt = maxValueStripped.length - (maxLength - length);
		var value = parseInt(token.slice(0,cutAt),10);

		// naive implementation, doesn't check if numbers after maxValueStripped are too big
		if(length === maxLength && value > parseInt(maxValueStripped,10)){
			throw 'the token is too big';
		}

		return Math.round(value/minStep);
	};

	ringViewVisualizer._buildDataCollection = function _buildDataCollection(params, arity) {
		var collection = {};
		for(var i = 0; i < arity; i++){
			collection[i] = [];
		}
		_.each(params, function (token) {
				var sector = this._getPositioningBySector(this.maxLength, '170',this.numberOfSectors, this.stepBetweenSectors, token);
				// acts as 0-based array
				var index = sector - 1;
				collection[index].push(token);
			},
			this);
		return collection;
	};

	ringViewVisualizer._createElementsByTokenRange = function _createElementByTokenRange(arity, tokensCollection) {
		var rangesContainers = [];
		var iterativeContainer;
		var wrapperContainer;
		for (var i = 1; i <= arity; i++) {
			iterativeContainer = document.createElement('div');
			iterativeContainer.classList.add('tokens-radius');
			wrapperContainer = document.createElement('div');
			wrapperContainer.classList.add('tokens-box');
			iterativeContainer.appendChild(wrapperContainer);
			rangesContainers.push(iterativeContainer);
		}
		_.each(tokensCollection, function addByRange (tokenChunks, index) {
			_.each(tokenChunks, function addByToken (tokenId) {
					var el = document.createElement('div');
					el.classList.add('token');
					el.setAttribute('data-token-id', tokenId);

					rangesContainers[index].firstChild.appendChild(el);
				});
		});
		return rangesContainers;
	};

	ringViewVisualizer._createVisualisation = function _createVusialisation(container, arity, tokens){
		var css = this._generateCircleClasses(arity),
			parentElement = document.createElement('div'),
			tokenRanges = this._createElementsByTokenRange(arity, tokens);

		document.head.appendChild(css.style);
		parentElement.classList.add('token-visualisation');

		if(css.classNames.length !== tokenRanges.length){
			throw 'error in css/token calculations for Circle View';
		}

		_.each(tokenRanges, function (tokenDiv, index) {
			tokenDiv.classList.add(css.classNames[index]);
			parentElement.appendChild(tokenDiv);
		});

		return parentElement;
	};

	ringViewVisualizer._generateCircleClasses = function _generateCircleClasses(numberOfArias){
		var degreeDelta = 360/numberOfArias;
		var degree = 0;
		var degreeName;
		var classCode = '';
		var styleElement = document.createElement('style');
		var classNames = [];

		for(var i = 0; i< numberOfArias; i++){
			degreeName = Math.round(degree);
			classNames.push('deg'+degreeName);
			classCode += _.template(
				".deg{{degreeName}} {"+
					"-webkit-transform: rotate({{degree}});"+
					"transform: rotate({{degree}});"+
				"}\n"+
				".deg{{degreeName}} .token:active:after{"+
					"-webkit-transform: rotate({{tooltipDegree}});"+
					"transform: rotate({{tooltipDegree}});"+
				"}\n",
				{degree:degree+'deg', degreeName: degreeName, tooltipDegree: ''+(180-degree)+'deg'}
			);
			degree = degree + degreeDelta;
		}
		styleElement.appendChild(document.createTextNode(classCode));
		return {style:styleElement, classNames: classNames};
	};

	ringViewVisualizer.generate = function generate(listOfTokens) {
		var arity = this.numberOfSectors,
			container = document.createElement('div');

		this._validate(listOfTokens);

		var tokens = this._buildDataCollection(listOfTokens, arity);
		return this._createVisualisation(container, arity, tokens);
	};

	var params = [
		'1',
		'1000',

		// 2^125
		'42535295865117307932921825928971026432',
		// 2^126
		'85070591730234615865843651857942052864',

		'73',
		'5298074214633306907124124122121241241',
		'92980742146337069071241241221212412411',

		'62980742146337069071241241221212412311',
		'72980742146337069071241241221212412311',
		'129807421463370690712412412212124123110',
		'139807421463370690712412412212124123110',
		'149807421463370690712412412212124123110',
		'150807421463370690712412412212124123110',
		'168807421463370690712412412212124123110',
		'170141183460469231731687303715884105728'
	];

	var container = document.body;

	var visualisation = ringViewVisualizer.generate(params);
	container.appendChild(visualisation);

})();