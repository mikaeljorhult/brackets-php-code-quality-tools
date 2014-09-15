<?php
/**
 * Drupal_Sniffs_Files_LineLengthSniff.
 *
 * PHP version 5
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */

/**
 * Checks comment lines in the file, and throws warnings if they are over 80
 * characters in length.
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */
class Drupal_Sniffs_Files_LineLengthSniff extends Generic_Sniffs_Files_LineLengthSniff
{

    /**
     * The limit that the length of a line should not exceed.
     *
     * @var int
     */
    public $lineLimit = 80;

    /**
     * The limit that the length of a line must not exceed.
     * But just check the line length of comments....
     *
     * Set to zero (0) to disable.
     *
     * @var int
     */
    public $absoluteLineLimit = 0;


    /**
     * Checks if a line is too long.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param array                $tokens    The token stack.
     * @param int                  $stackPtr  The first token on the next line.
     *
     * @return void
     */
    protected function checkLineLength(PHP_CodeSniffer_File $phpcsFile, $tokens, $stackPtr)
    {
        if (isset(PHP_CodeSniffer_Tokens::$commentTokens[$tokens[$stackPtr - 1]['code']]) === true) {
            $doc_comment_tag = $phpcsFile->findFirstOnLine(T_DOC_COMMENT_TAG, $stackPtr - 1);
            if ($doc_comment_tag !== false) {
                // Allow doc comment tags such as long @param tags to exceed the 80
                // character limit.
                return;
            }
            if ($tokens[($stackPtr - 1)]['code'] === T_COMMENT
                && preg_match('/^[[:space:]]*\/\/ @.+/', $tokens[($stackPtr - 1)]['content']) === 1
            ) {
                // Allow @link and @see documentation to exceed the 80 character
                // limit.
                return;
            }

            parent::checkLineLength($phpcsFile, $tokens, $stackPtr);
        }

    }//end checkLineLength()


    /**
     * Returns the length of a defined line.
     *
     * @return integer
     */
    public function getLineLength(PHP_CodeSniffer_File $phpcsFile, $currentLine)
    {
        $tokens = $phpcsFile->getTokens();

        $tokenCount         = 0;
        $currentLineContent = '';

        $trim = (strlen($phpcsFile->eolChar) * -1);
        for (; $tokenCount < $phpcsFile->numTokens; $tokenCount++) {
            if ($tokens[$tokenCount]['line'] === $currentLine) {
                $currentLineContent .= $tokens[$tokenCount]['content'];
            }
        }

        return strlen($currentLineContent);

    }//end getLineLength()


}//end class

?>
