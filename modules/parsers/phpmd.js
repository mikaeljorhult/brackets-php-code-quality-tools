define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHPMD = new Parser( 'phpmd', 'PHP Mess Detector' );
	
	PHPMD.setCommand( 'php {{path}} {{file}} text {{rulesets}}' );
	
	PHPMD.buildCommand = function( file ) {
		var rulesets = this.concatenateArray( this._preferences.get( 'phpmd-rulesets' ) );
		
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file )
			.replace( '{{rulesets}}', rulesets );
	}
	
	PHPMD.shouldRun = function() {
		return this._preferences.get( 'phpmd-rulesets' ) !== false;
	}
	
	PHPMD.callback = function( data ) {
		var regularExpression = /(?:.*):(\d+)\s+(.*)/g,
			matches;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			// Add each error to array of errors.
			PHPMD._errors.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 2 ],
				type: PHPMD._codeInspection.Type.ERROR
			} );
		}
		
		// Run CodeInspection.
		PHPMD.requestRun();
	}
	
	return PHPMD;
} );