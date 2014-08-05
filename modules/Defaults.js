define( function() {
	'use strict';
	
	return {
		enabledTools: [ 'phpcs', 'phpcpd', 'phpl', 'phpmd' ],
		phpcsStandards: [ 'PSR1', 'PSR2' ],
		phpmdRulesets: [ 'codesize', 'unusedcode', 'naming' ]
	};
} );