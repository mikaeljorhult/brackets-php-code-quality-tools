<?php
/**
 * Parses and verifies the doc comments for files.
 *
 * PHP version 5
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */

/**
 * Parses and verifies the doc comments for files.
 *
 * Verifies that :
 * <ul>
 *  <li>A doc comment exists.</li>
 *  <li>There is a blank newline after the @file statement.</li>
 * </ul>
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */

class Drupal_Sniffs_Commenting_FileCommentSniff implements PHP_CodeSniffer_Sniff
{


    /**
     * A list of tokenizers this sniff supports.
     *
     * @var array
     */
    public $supportedTokenizers = array(
                                   'PHP',
                                   'JS',
                                  );


    /**
     * Returns an array of tokens this test wants to listen for.
     *
     * @return array
     */
    public function register()
    {
        return array(T_OPEN_TAG);

    }//end register()


    /**
     * Processes this test, when one of its tokens is encountered.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return int
     */
    public function process(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $this->currentFile = $phpcsFile;

        $tokens       = $phpcsFile->getTokens();
        $commentStart = $phpcsFile->findNext(T_WHITESPACE, ($stackPtr + 1), null, true);

        if ($tokens[$commentStart]['code'] === T_COMMENT) {
            $fix = $phpcsFile->addFixableError('You must use "/**" style comments for a file comment', $commentStart, 'WrongStyle');
            if ($fix === true) {
                $content = $tokens[$commentStart]['content'];

                // If the comment starts with something like "/**+" then we just
                // insert a space after the stars.
                if (strpos($content, '/**') === 0) {
                    $phpcsFile->fixer->replaceToken($commentStart, str_replace('/**', '/** ', $content));
                }
                // Just turn the /* ... */ style comment into a /** ... */ style
                // comment.
                else if (strpos($content, '/*') === 0) {
                    $phpcsFile->fixer->replaceToken($commentStart, str_replace('/*', '/**', $content));
                } else {
                    $content = trim(ltrim($tokens[$commentStart]['content'], '/# '));
                    $phpcsFile->fixer->replaceToken($commentStart, "/**\n * @file\n * $content\n */\n");
                }
            }

            return ($phpcsFile->numTokens + 1);
        } else if ($commentStart === false || $tokens[$commentStart]['code'] !== T_DOC_COMMENT_OPEN_TAG) {
            $fix = $phpcsFile->addFixableError('Missing file doc comment', 0, 'Missing');
            if ($fix === true) {
                // Only PHP has a real opening tag, additional newline at the
                // beginning here.
                if ($phpcsFile->tokenizerType === 'PHP') {
                    // In templates add the file doc block to the very beginning of
                    // the file.
                    if ($tokens[0]['code'] === T_INLINE_HTML) {
                        $phpcsFile->fixer->addContentBefore(0, "<?php\n\n/**\n * @file\n */\n?>\n");
                    } else {
                        $phpcsFile->fixer->addContent($stackPtr, "\n/**\n * @file\n */\n");
                    }
                } else {
                    $phpcsFile->fixer->addContent($stackPtr, "/**\n * @file\n */\n");
                }
            }

            return ($phpcsFile->numTokens + 1);
        }//end if

        $commentEnd = $tokens[$commentStart]['comment_closer'];
        $fileTag    = $phpcsFile->findNext(T_DOC_COMMENT_TAG, ($commentStart + 1), $commentEnd, false, '@file');
        $next       = $phpcsFile->findNext(T_WHITESPACE, ($commentEnd + 1), null, true);

        // If there is no @file tag and the next line is a function or class
        // definition then the file docblock is mising.
        if ($fileTag === false
            && $tokens[$next]['line'] === ($tokens[$commentEnd]['line'] + 1)
            && in_array($tokens[$next]['code'], array(T_FUNCTION, T_CLASS, T_INTERFACE, T_TRAIT))
        ) {
            $fix = $phpcsFile->addFixableError('Missing file doc comment', $stackPtr, 'Missing');
            if ($fix === true) {
                // Only PHP has a real opening tag, additional newline at the
                // beginning here.
                if ($phpcsFile->tokenizerType === 'PHP') {
                    $phpcsFile->fixer->addContent($stackPtr, "\n/**\n * @file\n */\n");
                } else {
                    $phpcsFile->fixer->addContent($stackPtr, "/**\n * @file\n */\n");
                }
            }

            return ($phpcsFile->numTokens + 1);
        }

        if ($fileTag === false || $tokens[$fileTag]['line'] !== ($tokens[$commentStart]['line'] + 1)) {
            $second_line = $phpcsFile->findNext(array(T_DOC_COMMENT_STAR, T_DOC_COMMENT_CLOSE_TAG), ($commentStart + 1), $commentEnd);
            $fix         = $phpcsFile->addFixableError('The second line in the file doc comment must be "@file"', $second_line, 'FileTag');
            if ($fix === true) {
                if ($fileTag === false) {
                    $phpcsFile->fixer->addContent($commentStart, "\n * @file");
                } else {
                    // Delete the @file tag at its current position and insert one
                    // after the beginning of the comment.
                    $phpcsFile->fixer->beginChangeset();
                    $phpcsFile->fixer->addContent($commentStart, "\n * @file");
                    $phpcsFile->fixer->replaceToken($fileTag, '');
                    $phpcsFile->fixer->endChangeset();
                }
            }

            return ($phpcsFile->numTokens + 1);
        }

        // Exactly one blank line after the file comment.
        if ($tokens[$next]['line'] !== ($tokens[$commentEnd]['line'] + 2) && $tokens[$next]['line'] > $tokens[$commentEnd]['line']) {
            $error = 'There must be exactly one blank line after the file comment';
            $phpcsFile->addError($error, $commentEnd, 'SpacingAfterComment');
        }

        // Ignore the rest of the file.
        return ($phpcsFile->numTokens + 1);

    }//end process()


}//end class
