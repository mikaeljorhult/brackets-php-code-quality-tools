define( function( require, exports, module ) {
	'use strict';
	
	// Get dependencies.
	var FileUtils = brackets.getModule( 'file/FileUtils' ),
	
		// Get Todo modules.
		Defaults = require( 'modules/Defaults' ),
		Events = require( 'modules/Events' ),
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
		
		// Test module holding default values.
		describe( 'Events Module', function() {
			// Events should be in the form of a object.
			it( 'should be an object', function() {
				expect( Events ).toBeDefined();
				expect( Events ).toEqual( jasmine.any( Object ) );
			} );
			
			// Events should have a publish method.
			it( 'should expose publish method', function() {
				expect( Events.publish ).toBeDefined();
				expect( Events.publish ).toEqual( jasmine.any( Function ) );
			} );
			
			// Events should have a subscribe method.
			it( 'should expose subscribe method', function() {
				expect( Events.subscribe ).toBeDefined();
				expect( Events.subscribe ).toEqual( jasmine.any( Function ) );
			} );
			
			// Events should have a subscribe method.
			it( 'should expose unsubscribe method', function() {
				expect( Events.unsubscribe ).toBeDefined();
				expect( Events.unsubscribe ).toEqual( jasmine.any( Function ) );
			} );
			
			// Events should have a cache object.
			it( 'should expose cache object', function() {
				expect( Events.cache ).toBeDefined();
				expect( Events.cache ).toEqual( jasmine.any( Object ) );
			} );
			
			// Callbacks should be added to the cache array.
			it( 'should add events to cache', function() {
				Events.subscribe( 'test', function() {} );
				
				expect( Events.cache[ 'test' ] ).toBeDefined();
				expect( Events.cache[ 'test' ] ).toEqual( jasmine.any( Array ) );
				expect( Events.cache[ 'test' ].length ).toEqual( 1 );
			} );
			
			// Callbacks should be removed from cache array.
			it( 'should remove events to cache', function() {
				var handle = Events.subscribe( 'test', function() {} );
				Events.unsubscribe( handle );
				
				expect( Events.cache[ 'test' ] ).toBeDefined();
				expect( Events.cache[ 'test' ] ).toEqual( jasmine.any( Array ) );
				expect( Events.cache[ 'test' ].length ).toEqual( 0 );
			} );
			
			// Callbacks should be triggered when Events subscribed to are triggered.
			it( 'should run triggered events', function() {
				var response = null;
				
				Events.subscribe( 'test', function() {
					response = 'test';
				} );
				
				runs( function() {
					Events.publish( 'test' );
				} );
				
				waitsFor( function() {
					return ( response !== null );
				}, 'Event should be triggered.', 100 );
				
				// Run expectations on returned value.
				runs( function() {
					expect( response ).toEqual( jasmine.any( String ) );
					expect( response ).toMatch( 'test' );
				} );
			} );
		} );
	} );
} );