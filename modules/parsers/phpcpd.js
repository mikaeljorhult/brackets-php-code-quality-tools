define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHPCPD = new Parser( 'phpcpd', 'PHP Copy/Paste Detector' );
	
	PHPCPD.callback = function( data ) {
		var regularExpression = /-\s(?:.*):((\d+)-(\d+))[\s\S]\s+(?:.*):((\d+)-(\d+))/g,
			matches;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			var message = 'Code duplication on lines ' + matches[ 1 ] + ' and ' + matches[ 4 ] + '.';
			
			// Add each error to array of errors.
			PHPCPD._errors.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: message,
				type: PHPCPD._codeInspection.Type.WARNING
			} );
		}
		
		// Run CodeInspection.
		PHPCPD.requestRun();
	}
	
	return PHPCPD;
} );