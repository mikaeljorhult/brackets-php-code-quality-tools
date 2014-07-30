define( function( require, exports, module ) {
	'use strict';
	
	// Get dependencies.
	var FileUtils = brackets.getModule( 'file/FileUtils' ),
	
		// Get Todo modules.
		Defaults = require( 'modules/Defaults' ),
		CommandRunner = require( 'modules/CommandRunner' ),
	
		// Setup paths and other variables.
		extensionPath = FileUtils.getNativeModuleDirectoryPath( module ),
		testPath = extensionPath + '/unittest-files/';
	
	// Start testing!
	describe( 'PHP Code Quality Tools', function() {
		// Test module holding default values.
		describe( 'Defaults Module', function() {
			// Defaults should be in the form of a object.
			it( 'should expose enabledTools value', function() {
				expect( Defaults ).not.toBeNull();
				expect( Defaults ).toEqual( jasmine.any( Object ) );
			} );
			
			// Array of enabled tools.
			it( 'should expose enabledTools value', function() {
				expect( Defaults.enabledTools ).not.toBeNull();
				expect( Defaults.enabledTools ).toEqual( jasmine.any( Array ) );
			} );
			
			// Array of CodeSniffer standards.
			it( 'should expose phpcsStandards variable', function() {
				expect( Defaults.phpcsStandards ).not.toBeNull();
				expect( Defaults.phpcsStandards ).toEqual( jasmine.any( Array ) );
			} );
			
			// Array of Mess Detector rulesets.
			it( 'should expose phpmdRulesets variable', function() {
				expect( Defaults.phpmdRulesets ).not.toBeNull();
				expect( Defaults.phpmdRulesets ).toEqual( jasmine.any( Array ) );
			} );
		} );
		
		// Test module running commands.
		describe( 'CommandRunner Module', function() {
			// Run command should be available.
			it( 'should expose run method', function() {
				expect( CommandRunner.run ).not.toBeNull();
				expect( CommandRunner.run ).toEqual( jasmine.any( Function ) );
			} );
			
			// Node connection should be available.
			it( 'should expose Node connection', function() {
				expect( CommandRunner._nodeConnection).not.toBeNull();
				expect( CommandRunner._nodeConnection ).toEqual( jasmine.any( Object ) );
			} );
			
			// Node connection should be available.
			it( 'should expose initialized getter', function() {
				expect( CommandRunner.initialized ).not.toBeNull();
				expect( CommandRunner.initialized ).toEqual( jasmine.any( Function ) );
				expect( CommandRunner.initialized() ).toEqual( true );
			} );
			
			// Node domain should be setup.
			it( 'should have a Node domain setup', function() {
				expect( CommandRunner._nodeConnection).not.toBeNull();
				expect( CommandRunner._nodeConnection ).toEqual( jasmine.any( Object ) );
				expect( CommandRunner._nodeConnection.domains.phplinttools ).not.toBeNull();
			} );
		} );
	} );
} );