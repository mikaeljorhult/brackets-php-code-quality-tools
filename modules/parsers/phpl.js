define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHPL = new Parser( 'phpl' );
	
	PHPL.setCommand( 'php -d display_errors=1 -d error_reporting=-1 -l {{file}}' );
	
	PHPL.callback = function( data ) {
		var regularExpression = /(.*) in (?:.*) on line (\d+)/g,
			matches,
			type;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 1 ].indexOf( 'error' ) > -1 ? PHPL._codeInspection.Type.ERROR : PHPL._codeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			PHPL._errors.push( {
				pos: {
					line: parseInt( matches[ 2 ], 10 ) - 1
				},
				message: matches[ 1 ],
				type: type
			} );
		}
		
		// Run CodeInspection.
		PHPL.requestRun();
	}
	
	return PHPL;
} );