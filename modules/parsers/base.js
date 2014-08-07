define( function( require ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		CommandRunner = require( 'modules/CommandRunner' ),
		Paths = require( 'modules/Paths' ),
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' );
		
	function Parser( name ) {
		this._name = name;
		this._path = Paths.get( name );
		this._command = 'php {{path}} {{file}}';
		this._errors = [];
		
		this._codeInspection = CodeInspection;
	}
	
	Parser.prototype.parse = function( file ) {
		var enabledTools = preferences.get( 'enabled-tools' );
		
		// Assume no errors.
		this._errors = [];
		
		// Run tool if it's enabled in settings.
		if ( enabledTools.indexOf( this._name ) !== -1 ) {
			this.run( this.buildCommand( file ) );
		}
	}
	
	Parser.prototype.run = function( command ) {
		var callback = this.callback;
		
		CommandRunner.run( command, callback );
	}
	
	Parser.prototype.setCommand = function( command ) {
		this._command = command;
	}
	
	Parser.prototype.buildCommand = function( file ) {
		return this._command
			.replace( '{{path}}', this._path )
			.replace( '{{file}}', file );
	}
	
	Parser.prototype.getErrors = function() {
		return this._errors;
	}
	
	Parser.prototype.requestRun = function() {
		// Run CodeInspection.
		CodeInspection.requestRun();
	}
	
	return Parser;
} );