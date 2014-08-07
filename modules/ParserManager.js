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
		Paths = require( 'modules/Paths' ),
		
		// Parsers.
		phpl = require( 'modules/parsers/phpl' ),
		phpmd = require( 'modules/parsers/phpmd' ),
		phpcpd = require( 'modules/parsers/phpcpd' ),
		phpcs = require( 'modules/parsers/phpcs' ),
		parsers = [
			phpl,
			phpcpd,
			phpcs,
			phpmd
		],
		
		// Setup extension.
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' );
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = Paths.escape( fullPath ),
			parser;
		
		// Pass file to each parser.
		for ( parser in parsers ) {
			if ( parsers.hasOwnProperty( parser ) ) {
				parsers[ parser ].parse( filePath );
			}
		}
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
					name: phpcpd.name(),
					scanFile: function() {
						return {
							errors: phpcpd.errors()
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: phpcs.name(),
					scanFile: function() {
						return {
							errors: phpcs.errors()
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: phpl.name(),
					scanFile: function() {
						return {
							errors: phpl.errors()
						};
					}
				} );
				
				CodeInspection.register( 'php', {
					name: phpmd.name(),
					scanFile: function() {
						return {
							errors: phpmd.errors()
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