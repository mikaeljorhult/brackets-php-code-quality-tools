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
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		NodeConnection = brackets.getModule( 'utils/NodeConnection' ),
    	nodeConnection = new NodeConnection(),
		
		// Variables.
		phpcsPath = 'php ' + ExtensionUtils.getModulePath( module, 'modules/vendor/phpcs/phpcs.phar' ).replace( ' ', '\\ ' ),
		codeStyleErrors = [];
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var command = phpcsPath + ' ' + fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' );
		
		// Run command using Node.
		nodeConnection.domains.phpcs.commander( command ).done( function( data ) {
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
		} );
	}
	
	// Run CodeInspection when a file is saved.
	$( DocumentManager ).on( 'documentSaved.phpcs', function( event, fileEntry ) {
		getErrors( fileEntry.file.fullPath );
	} );
	
	// Register panel and setup event listeners.
	AppInit.appReady( function() {
		// Connect to Node.
		nodeConnection.connect( true ).done( function() {
			// Load terminal domain.
			var path = ExtensionUtils.getModulePath( module, 'node/commander' );
			
			// Load commander into Node.
			nodeConnection.loadDomains( [ path ], true ).done( function() {
				// Loaded.
			} );
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
} );