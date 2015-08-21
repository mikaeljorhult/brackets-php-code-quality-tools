define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHPCS = new Parser( 'phpcs', 'PHP CodeSniffer' );
	
	PHPCS.setCommand( 'php {{path}} --standard={{standards}} --report-width=300 {{file}}' );
	
	PHPCS.buildCommand = function( file ) {
		var standards = this.concatenateArray( this._preferences.get( 'phpcs-standards' ) );
		
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file )
			.replace( '{{standards}}', standards );
	};
	
	PHPCS.buildOptions = function() {
		return {
			cwd: this._basePath
		};
	};
	
	PHPCS.shouldRun = function() {
		return this._preferences.get( 'phpcs-standards' ) !== false;
	};
	
	PHPCS.callback = function( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|(.*)/g,
			matches,
			type;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? PHPCS._codeInspection.Type.ERROR : PHPCS._codeInspection.Type.WARNING;
			
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
		PHPCS.requestRun();
	};
	
	return PHPCS;
} );