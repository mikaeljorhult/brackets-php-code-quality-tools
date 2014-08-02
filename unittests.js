define( function( require, exports, module ) {
	'use strict';
	
	// Get dependencies.
	var FileUtils = brackets.getModule( 'file/FileUtils' ),
	
		// Get Todo modules.
		Defaults = require( 'modules/Defaults' ),
		CommandRunner = require( 'modules/CommandRunner' ),
		Paths = require( 'modules/Paths' ),
	
		// Setup paths and other variables.
		extensionPath = FileUtils.getNativeModuleDirectoryPath( module ),
		testPath = extensionPath + '/unittest-files/';
	
	// Start testing!
	describe( 'PHP Code Quality Tools', function() {
		// Test module holding default values.
		describe( 'Defaults Module', function() {
			// Defaults should be in the form of a object.
			it( 'should expose enabledTools value', function() {
				expect( Defaults ).toBeDefined();
				expect( Defaults ).toEqual( jasmine.any( Object ) );
			} );
			
			// Array of enabled tools.
			it( 'should expose enabledTools value', function() {
				expect( Defaults.enabledTools ).toBeDefined();
				expect( Defaults.enabledTools ).toEqual( jasmine.any( Array ) );
			} );
			
			// Array of CodeSniffer standards.
			it( 'should expose phpcsStandards variable', function() {
				expect( Defaults.phpcsStandards ).toBeDefined();
				expect( Defaults.phpcsStandards ).toEqual( jasmine.any( Array ) );
			} );
			
			// Array of Mess Detector rulesets.
			it( 'should expose phpmdRulesets variable', function() {
				expect( Defaults.phpmdRulesets ).toBeDefined();
				expect( Defaults.phpmdRulesets ).toEqual( jasmine.any( Array ) );
			} );
		} );
		
		// Test module running commands.
		describe( 'CommandRunner Module', function() {
			// Run command should be available.
			it( 'should expose run method', function() {
				expect( CommandRunner.run ).toBeDefined();
				expect( CommandRunner.run ).toEqual( jasmine.any( Function ) );
			} );
			
			// Node connection should be available.
			it( 'should expose Node connection', function() {
				expect( CommandRunner._nodeConnection).toBeDefined();
				expect( CommandRunner._nodeConnection ).toEqual( jasmine.any( Object ) );
			} );
			
			// Node connection should be available.
			it( 'should expose initialized getter', function() {
				expect( CommandRunner.initialized ).toBeDefined();
				expect( CommandRunner.initialized ).toEqual( jasmine.any( Function ) );
			} );
			
			// Node domain should be setup.
			it( 'should have a Node domain setup', function() {
				expect( CommandRunner._nodeConnection).toBeDefined();
				expect( CommandRunner._nodeConnection ).toEqual( jasmine.any( Object ) );
				expect( CommandRunner._nodeConnection.domains.phplinttools ).not.toBeNull();
			} );
			
			// Run PHP executable.
			it( 'should be able to run php executable', function() {
				var response = null;
				
				runs( function() {
					CommandRunner.run( 'php -v', function( data ) {
						response = data;
					} );
				} );
				
				waitsFor( function() {
					return ( response !== null );
				}, 'Command output should be returned.', 100 );
				
				// Run expectations on returned comments.
				runs( function() {
					expect( response ).toEqual( jasmine.any( String ) );
					expect( response ).toMatch( 'PHP' );
				} );
			} );
			
			// Run CodeSniffer.
			it( 'should be able to run CodeSniffer through PHP', function() {
				var response = null;
				
				runs( function() {
					CommandRunner.run( 'php ' + Paths.get( 'phpcs' ) + ' --version', function( data ) {
						response = data;
					} );
				} );
				
				waitsFor( function() {
					return ( response !== null );
				}, 'Command output should be returned.', 100 );
				
				// Run expectations on returned comments.
				runs( function() {
					expect( response ).toEqual( jasmine.any( String ) );
					expect( response ).toMatch( 'PHP_CodeSniffer' );
				} );
			} );
			
			// Run Copy/Paste Detector.
			it( 'should be able to run Copy/Paste Detector through PHP', function() {
				var response = null;
				
				runs( function() {
					CommandRunner.run( 'php ' + Paths.get( 'phpcpd' ) + ' --version', function( data ) {
						response = data;
					} );
				} );
				
				waitsFor( function() {
					return ( response !== null );
				}, 'Command output should be returned.', 100 );
				
				// Run expectations on returned comments.
				runs( function() {
					expect( response ).toEqual( jasmine.any( String ) );
					expect( response ).toMatch( 'Bergmann' );
				} );
			} );
			
			// Run Mess Detector.
			it( 'should be able to run Mess Detetctor through PHP', function() {
				var response = null;
				
				runs( function() {
					CommandRunner.run( 'php ' + Paths.get( 'phpmd' ) + ' --version', function( data ) {
						response = data;
					} );
				} );
				
				waitsFor( function() {
					return ( response !== null );
				}, 'Command output should be returned.', 100 );
				
				// Run expectations on returned comments.
				runs( function() {
					expect( response ).toEqual( jasmine.any( String ) );
					expect( response ).toMatch( 'PHPMD' );
				} );
			} );
		} );
	} );
} );