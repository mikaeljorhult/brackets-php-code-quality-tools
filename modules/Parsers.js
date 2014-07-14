define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		
		// Variables.
		errors = {
			phpcs: [],
			phpmd: []
		};
	
	// Parse message returned from CodeSniffer for errors.
	function phpcs( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|.*] (.*)/g,
			matches,
			type;
		
		// Assume no errors.
		errors.phpcs = [];
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? CodeInspection.Type.ERROR : CodeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			errors.phpcs.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 3 ],
				type: type
			} );
		}
		
		// Run CodeInspection.
		CodeInspection.requestRun();
	}
	
	function returnErrors() {
		return errors;
	}
	
	return {
		errors: returnErrors,
		phpcs: phpcs
	};
} );