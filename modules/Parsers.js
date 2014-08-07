define( function( require, exports ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		CommandRunner = require( 'modules/CommandRunner' ),
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' ),
		
		// Variables.
		errors = {
			phpcs: [],
			phpl: []
		};
	
	// Run tool.
	function runTool( tool ) {
		var enabledTools = preferences.get( 'enabled-tools' );
		
		// Assume no errors.
		errors[ tool.name ] = [];
		
		// Run tool if it's enabled in settings.
		if ( enabledTools.indexOf( tool.name ) !== -1 ) {
			CommandRunner.run( tool.command, exports[ tool.name ] );
		}
	}
	
	// Parse message returned from CodeSniffer for errors.
	function phpcs( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|(.*)/g,
			matches,
			type;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? CodeInspection.Type.ERROR : CodeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			errors.phpcs.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 3 ].replace( /\s?\[.?\]\s?/, '' ),
				type: type
			} );
		}
		
		// Run CodeInspection.
		CodeInspection.requestRun();
	}
	
	function returnErrors() {
		return errors;
	}
	
	exports.errors = returnErrors;
	exports.phpcs = phpcs;
	exports.run = runTool;
} );