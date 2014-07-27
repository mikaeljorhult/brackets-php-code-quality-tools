define( function() {
	'use strict';
	
	return {
		enabledTools: [ 'phpcs', 'phpcpd', 'phpl' ],
		phpcsStandards: [ 'PSR1', 'PSR2' ],
		phpmdRulesets: [ 'cleancode', 'codesize', 'controversial', 'design', 'naming', 'unusedcode' ]
	};
} );