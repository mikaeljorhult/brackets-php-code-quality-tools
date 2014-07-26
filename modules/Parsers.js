define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		CommandRunner = require( 'modules/CommandRunner' ),
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' ),
		
		// Variables.
		errors = {
			phpcpd: [],
			phpcs: [],
			phpmd: []
		};
	
	// Run tool.
	function runTool( tool ) {
		var enabledTools = preferences.get( 'enabled-tools' );
		
		// Assume no errors.
		errors[ tool.name ] = [];
		
		// Run tool if it's enabled in settings.
		if ( enabledTools.indexOf( tool.name ) !== -1 ) {
			CommandRunner.run( tool.command, this[ tool.name ] );
		}
	}
	
	// Parse message returned from Copy/Paste Detector for errors.
	function phpcpd( data ) {
		var regularExpression = /-\s(?:.*):((\d+)-(\d+))[\s\S]\s+(?:.*):((\d+)-(\d+))/g,
			matches;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			var message = 'Code duplication on lines ' + matches[ 1 ] + ' and ' + matches[ 4 ] + '.';
			
			// Add each error to array of errors.
			errors.phpcpd.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: message,
				type: CodeInspection.Type.WARNING
			} );
		}
		
		// Run CodeInspection.
		CodeInspection.requestRun();
	}
	
	// Parse message returned from CodeSniffer for errors.
	function phpcs( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|.*] (.*)/g,
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
				message: matches[ 3 ],
				type: type
			} );
		}
		
		// Run CodeInspection.
		CodeInspection.requestRun();
	}
	
	// Parse message returned from CodeSniffer for errors.
	function phpmd( data ) {
		var regularExpression = /(?:.*):(\d+)\s+(.*)/g,
			matches;
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			// Add each error to array of errors.
			errors.phpmd.push( {
				pos: {
					line: parseInt( matches[ 1 ], 10 ) - 1
				},
				message: matches[ 2 ],
				type: CodeInspection.Type.ERROR
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
		phpcpd: phpcpd,
		phpcs: phpcs,
		phpmd: phpmd,
		run: runTool
	};
} );