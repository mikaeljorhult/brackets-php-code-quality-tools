define( function() {
	'use strict';
	
	return {
		enabledTools: [ 'phpcs', 'phpcpd', 'phpl', 'phpmd' ],
		phpcsStandards: [ 'PSR1', 'PSR2' ],
		phpcsfixerLevel: [ 'PSR2' ],
		php7ccOpts: ['error'],
		phpmdRulesets: [ 'codesize', 'unusedcode', 'naming' ],
		PHPDirectory: ''
	};
} );