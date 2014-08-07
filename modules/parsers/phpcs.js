define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		Paths = require( 'modules/Paths' ),
		PHPCS = new Parser( 'phpcs' );
	
	PHPCS.setCommand( 'php {{path}} --standard={{standards}} --report-width=300 {{file}}' );
	
	PHPCS.buildCommand = function( file ) {
		var standards = this.concatenateArray( this.prepareStandards( this._preferences.get( 'phpcs-standards' ) ) );
		
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file )
			.replace( '{{standards}}', standards );
	}
	
	PHPCS.prepareStandards = function( standards ) {
		var standard;
		
		// Make sure standards are available.
		if ( standards ) {
			// Go through each standard.
			for ( standard in standards ) {
				// Check if standard name is a path.
				if ( standards[ standard ].indexOf( '/' ) > -1 ) {
					standards[ standard ] = Paths.escape( Paths.get( 'base', true ) + 'phpcs/' + standards[ standard ] );
				}
			}
		}
		
		return standards;
	}
	
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
	}
	
	return PHPCS;
} );