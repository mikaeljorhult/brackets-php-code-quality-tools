define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var Parser = require( 'modules/parsers/base' ),
		PHP7CC = new Parser( 'php7cc', 'PHP 7 Compatibility Checker' );
	
	PHP7CC.setCommand( 'php {{path}} --level={{level}} {{file}}' );
	
	PHP7CC.buildCommand = function( file ) {
		var level = this.concatenateArray( this._preferences.get( 'php7-opts' ) );
		
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file )
			.replace( '{{level}}', level );
	};
	
	PHP7CC.buildOptions = function() {
		return {
			cwd: this._basePath
		};
	};
	
	PHP7CC.shouldRun = function() {
		return this._preferences.get( 'php7-opts' ) !== false;
	};
	
	PHP7CC.callback = function( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|(.*)/g,
			matches,
			type;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? PHP7CC._codeInspection.Type.ERROR : PHP7CC._codeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			PHP7CC._errors.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 3 ].replace( /\s?\[.?\]\s?/, '' ),
				type: type
			} );
		}
		
		// Run CodeInspection.
		PHP7CC.requestRun();
	};
	
	return PHP7CC;
} );