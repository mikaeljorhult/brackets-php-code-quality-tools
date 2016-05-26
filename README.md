# Brackets PHP Code Quality Tools

Brackets/Edge Code extension that lint PHP files using several code analysis tools.


## Requirements
Please note that this extension uses the PHP executable to run its analysis tools so PHP must be installed
on your machine and available globally.


## Installation
You may download and install this extension in one of three ways. Using Extension Manager to find it through 
the extension registry you always find the latest stable release conveniently within Brackets.

You can also get the latest work-in-progress version by downloading or installing the extension directly 
from the repository. This allows you to try new features that might not have been tested properly yet.

### Install using Extension Manager

1. Open the the Extension Manager from the File menu.
2. Click the Available tab i upper left corner.
3. Find PHP Code Quality Tools in list of extensions (use the search field to filter the list).
4. Click Install.

### Install from URL

1. Open the the Extension Manager from the File menu.
2. Click on Install form URL...
3. Copy and paste following URL in the text field: `https://github.com/mikaeljorhult/brackets-php-code-quality-tools`
4. Click Install.

### Install from file system

1. Download this extension using the ZIP button and unzip it.
2. Copy it in Brackets' `/extensions/user` folder by selecting Show Extension Folder in the Help menu. 
3. Reload Brackets.


## Usage
Whenever a PHP file is opened or saved the selected tools will automatically analyze it and give you a list of
detected errors and warnings through Brackets own lint pane.

What tools are used and settings for these may be set in the extension settings by going to
View > PHP Code Quality Tools.


## Available tools

* PHP syntax check (php -l)
* [PHP CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer)
* [PHP Copy/Paste Detector](https://github.com/sebastianbergmann/phpcpd)
* [PHP Mess Detector](http://phpmd.org)
* [PHP Coding Standards Fixer](http://cs.sensiolabs.org/)
* [PHP Static Analysis](https://phpsa.dmtry.me/)