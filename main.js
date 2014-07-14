/*!
 * Brackets PHP CodeSniffer 0.1.0
 * Lint PHP against coding standards using PHP CodeSniffer.
 *
 * @author Mikael Jorhult
 * @license http://mikaeljorhult.mit-license.org MIT
 */
define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		CommandRunner = require( 'modules/CommandRunner' ),
		
		// Variables.
		phpcsPath = 'php ' + ExtensionUtils.getModulePath( module, 'modules/vendor/phpcs/phpcs.phar' ).replace( ' ', '\\ ' ),
		codeStyleErrors = [];
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var command = phpcsPath + ' ' + fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' );
		
		// Run command using Node.
		CommandRunner.run( command, parseErrors );
	}
	
	// Parse message returned from CodeSniffer for errors.
	function parseErrors( data ) {
		var regularExpression = /(\d+)\s\|\s(.*)\s\|.*] (.*)/g,
			matches,
			type;
		
		// Assume no errors.
		codeStyleErrors = [];
		
		// Go through all matching rows in result.
		while ( ( matches = regularExpression.exec( data ) ) !== null ) {
			type = matches[ 2 ].match( 'ERROR' ) ? CodeInspection.Type.ERROR : CodeInspection.Type.WARNING;
			
			// Add each error to array of errors.
			codeStyleErrors.push( {
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
	
	// Run CodeInspection when a file is saved.
	$( DocumentManager ).on( 'documentSaved.phpcs', function( event, fileEntry ) {
		getErrors( fileEntry.file.fullPath );
	} );
	
	// Register linting service.
	CodeInspection.register( 'php', {
		name: 'PHP CodeSniffer',
		scanFile: function() {
			return {
				errors: codeStyleErrors
			};
		}
	} );
} );