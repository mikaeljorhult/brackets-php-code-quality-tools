define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHPSA = new Parser( 'phpsa', 'PHP Static Analysis' );
	
	PHPSA.setCommand( 'php {{path}} check {{file}}' );
	
	PHPSA.buildCommand = function( file ) {
		
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file );
	};
	
	PHPSA.buildOptions = function() {
		return {
			cwd: this._basePath
		};
	};
	
	
	PHPSA.callback = function( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|(.*)/g,
			matches,
			type;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? PHPSA._codeInspection.Type.ERROR : PHPSA._codeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			PHPCS._errors.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 3 ].replace( /\s?\[.?\]\s?/, '' ),
				type: type
			} );
		}
		
		// Run CodeInspection.
		PHPSA.requestRun();
	};
	
	return PHPSA;
} );