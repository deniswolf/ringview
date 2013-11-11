(function(){
	'use strict';

	// should be loaded as a part of configuration
		var maxLength = '170141183460469231731687303715884105728'.length;

		function validateTokenStrings(tokenStrings){
			_.each(tokenStrings, function(tokenString){
				if(!_.isString(tokenString)){
					throw tokenString+' is not a String';
				}
				if(! /^\d+$/.test(tokenString)){
					throw tokenString+' is not an integer';
				}

				// naive implementation}
				if(tokenString.length > maxLength){
					throw tokenString+' is too big';
				}
			});
		}

		function buildTokensCollection(params){
			var collection = {};

			params.forEach(
				function(token){
					if(!collection[token.length]){
						collection[token.length] = [];
					}
					collection[token.length].push(token);
				}
			);

			return collection;
		}

		function buildRulerVisualisation(parentElement, arity, tokensCollection){
			var tokenRulerMarkings = [];
			for (var i=1; i<=arity; i++){
				tokenRulerMarkings.push(document.createElement('span'));
			}
			_.each(tokensCollection, function(tokenChunks, index){
				tokenChunks
					.map(function(tokenId){
						var el = document.createElement('div');
						el.setAttribute('data-token-id',tokenId);
						return el;
					})
					.forEach(function(tokenElement){
						tokenRulerMarkings[index].appendChild(tokenElement);
					});
			});
			_.each(tokenRulerMarkings.reverse(), function(tokenDiv){
				parentElement.appendChild(tokenDiv);
			});
		}

		var params = ['1701411834', '123', '93',
			'3', '6923173730371588', '123', '1',
			'234233', '69231737303715812333328',
			'3', '69231473730371588', '1231233',
			'1', '124124142', '124124', '12312'
		];

		validateTokenStrings(params);

		var tokens = buildTokensCollection(params);

		var container = document.body.querySelector('#container');

		buildRulerVisualisation(container, maxLength, tokens);

})();