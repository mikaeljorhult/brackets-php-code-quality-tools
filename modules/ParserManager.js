define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		EditorManager = brackets.getModule( 'editor/EditorManager' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		CommandRunner = require( 'modules/CommandRunner' ),
		Events = require( 'modules/Events' ),
		Parsers = require( 'modules/Parsers' ),
		Paths = require( 'modules/Paths' ),
		
		// Setup extension.
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' );
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = normalizePath( fullPath ),
			phpcsStandards = concatenateArray( preferences.get( 'phpcs-standards' ), ' --standard=' ),
			phpmdRulesets = concatenateArray( preferences.get( 'phpmd-rulesets' ) ),
			
			// Commands.
			phpcpdCommand = 'php ' + Paths.get( 'phpcpd' ) + ' ' + filePath,
			phpcsCommand = 'php ' + Paths.get( 'phpcs' ) + phpcsStandards + ' --report-width=200 ' + filePath,
			phplCommand = 'php ' + ' -d display_errors=1 -d error_reporting=-1 -l ' + filePath,
			phpmdCommand = 'php ' + Paths.get( 'phpmd' ) + ' ' + filePath + ' text ' + phpmdRulesets;
		
		// Pass command to parser.
		if ( phpcsStandards !== false ) {
			// Only run parser if any CodeSniffer standards has been actived.
			Parsers.run( {
				name: 'phpcs',
				command: phpcsCommand
			} );
		}
		
		Parsers.run( {
			name: 'phpcpd',
			command: phpcpdCommand
		} );
		
		Parsers.run( {
			name: 'phpl',
			command: phplCommand
		} );
		
		if ( phpmdRulesets !== false ) {
			// Only run parser if any CodeSniffer standards has been actived.
			Parsers.run( {
				name: 'phpmd',
				command: phpmdCommand
			} );
		}
	}
	
	// Concatenate a array of values to a comma separated string.
	function concatenateArray( valueArray, prefix ) {
		var returnValue = false;
		
		if ( valueArray.length > 0 ) {
			returnValue = ( prefix !== undefined ? prefix : '' ) + valueArray.join( ',' );
		}
		
		return returnValue;
	}
	
	// Escape paths on different systems.
	function normalizePath( fullPath ) {
		if ( brackets.platform === 'win' ) {
			fullPath = '"' + fullPath + '"';
		} else {
			fullPath = fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' );
		}
		
		return fullPath;
	}
	
	// Register event listeners.
	function registerEvents() {
		// Test for PHP.
		CommandRunner.run( 'php -v', function( data ) {
			var phpAvailable = data.indexOf( 'PHP' ) > -1;
			
			// Save PHP state
			preferences.set( 'php-available', phpAvailable );
			preferences.save();
			
			// Only register linters and listeners if PHP is available on machine.
			if ( phpAvailable ) {
				// Register linting service.
				CodeInspection.register( 'php', {
					name: 'PHP Copy/Paste Detector',
					scanFile: function() {
						return {
							errors: Parsers.errors().phpcpd
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: 'PHP CodeSniffer',
					scanFile: function() {
						return {
							errors: Parsers.errors().phpcs
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: 'PHP Lint',
					scanFile: function() {
						return {
							errors: Parsers.errors().phpl
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: 'PHP Mess Detector',
					scanFile: function() {
						return {
							errors: Parsers.errors().phpmd
						};
					}
				} );
				
				// Run CodeInspection when a file is saved, a file gets focus or on startup.
				$( DocumentManager ).on( 'documentSaved.phpCodeQualityTools', getErrorsFromDocument );
				$( EditorManager ).on( 'activeEditorChange.phpCodeQualityTools', getErrorsFromEditor );
				AppInit.appReady( getErrorsFromEditor );
			}
		} );
	}
	
	// Receive, or use active editor, to get current file.
	function getErrorsFromEditor( event, editor ) {
		editor = editor || EditorManager.getCurrentFullEditor();
		
		if ( editor ) {
			getErrorsFromDocument( event, editor.document );
		}
	}
	
	// Trigger function to get errors if file is PHP.
	function getErrorsFromDocument( event, fileEntry ) {
		if ( fileEntry.language.getName() === 'PHP' ) {
			getErrors( fileEntry.file.fullPath );
		}
	}
	
	// Register event listeners.
	if ( CommandRunner.initialized() ) {
		registerEvents();
	} else {
		Events.subscribe( 'node:connected', registerEvents );
	}
} );