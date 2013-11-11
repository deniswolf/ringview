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
		var tokenRanges = this._createElementsByTokenRange(arity, tokens);
		var parentElement = document.createElement('div');
		_.each(tokenRanges.reverse(), function (tokenDiv) {
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

	var params = ['1701411834', '123', '93',
		'3', '6923173730371588', '123', '1',
		'234233', '69231737303715812333328',
		'3', '69231473730371588', '1231233',
		'1', '124124142', '124124', '12312'
	];

	var container = document.body.querySelector('#container');

	var visualisation = ringViewVisualizer.generate(params);
	container.appendChild(visualisation);

})();