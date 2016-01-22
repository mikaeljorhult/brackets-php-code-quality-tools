<?php
/**
 * DrupalPractice_Sniffs_FunctionCalls_ThemeSniff
 *
 * PHP version 5
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */

/**
 * Checks that theme functions are not directly called.
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */
class DrupalPractice_Sniffs_FunctionCalls_ThemeSniff extends Drupal_Sniffs_Semantics_FunctionCall
{

    /**
     * List of functions starting with "theme_" that don't generate theme output.
     *
     * @var array
     */
    protected $reservedFunctions = array(
                                    'theme_get_registry',
                                    'theme_get_setting',
                                    'theme_render_template',
                                    'theme_enable',
                                    'theme_disable',
                                    'theme_get_suggestions',
                                   );


    /**
     * Processes this test, when one of its tokens is encountered.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return void
     */
    public function process(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens       = $phpcsFile->getTokens();
        $functionName = $tokens[$stackPtr]['content'];
        if (strpos($functionName, 'theme_') !== 0
            || in_array($functionName, $this->reservedFunctions) === true
            || $this->isFunctionCall($phpcsFile, $stackPtr) === false
        ) {
            return;
        }

        $themeName = substr($functionName, 6);
        $warning   = "Do not call theme functions directly, use theme('%s', ...) instead";
        $phpcsFile->addWarning($warning, $stackPtr, 'ThemeFunctionDirect', array($themeName));

    }//end process()


}//end class
