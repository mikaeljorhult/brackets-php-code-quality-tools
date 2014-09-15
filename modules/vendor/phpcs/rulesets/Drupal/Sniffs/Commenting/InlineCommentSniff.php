<?php
/**
 * PHP_CodeSniffer_Sniffs_Drupal_Commenting_InlineCommentSniff.
 *
 * PHP version 5
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */

/**
 * PHP_CodeSniffer_Sniffs_Drupal_Commenting_InlineCommentSniff.
 *
 * Checks that no perl-style comments are used. Checks that inline comments ("//")
 * have a space after //, start capitalized and end with proper punctuation.
 * Largely copied from Squiz_Sniffs_Commenting_InlineCommentSniff.
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */
class Drupal_Sniffs_Commenting_InlineCommentSniff implements PHP_CodeSniffer_Sniff
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
        return array(
                T_COMMENT,
                T_DOC_COMMENT_OPEN_TAG,
               );

    }//end register()


    /**
     * Processes this test, when one of its tokens is encountered.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token in the
     *                                        stack passed in $tokens.
     *
     * @return void
     */
    public function process(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens = $phpcsFile->getTokens();

        // If this is a function/class/interface doc block comment, skip it.
        // We are only interested in inline doc block comments, which are
        // not allowed.
        if ($tokens[$stackPtr]['code'] === T_DOC_COMMENT_OPEN_TAG) {
            $nextToken = $phpcsFile->findNext(
                PHP_CodeSniffer_Tokens::$emptyTokens,
                ($stackPtr + 1),
                null,
                true
            );

            $ignore = array(
                       T_CLASS,
                       T_INTERFACE,
                       T_TRAIT,
                       T_FUNCTION,
                       T_PUBLIC,
                       T_PRIVATE,
                       T_PROTECTED,
                       T_FINAL,
                       T_STATIC,
                       T_ABSTRACT,
                       T_CONST,
                       T_OBJECT,
                       T_PROPERTY,
                      );

            // Also ignore all doc blocks defined in the outer scope (no scope
            // conditions are set).
            if (in_array($tokens[$nextToken]['code'], $ignore) === true
                || empty($tokens[$stackPtr]['conditions']) === true
            ) {
                return;
            } else {
                if ($phpcsFile->tokenizerType === 'JS') {
                    // We allow block comments if a function is being assigned
                    // to a variable.
                    $ignore    = PHP_CodeSniffer_Tokens::$emptyTokens;
                    $ignore[]  = T_EQUAL;
                    $ignore[]  = T_STRING;
                    $ignore[]  = T_OBJECT_OPERATOR;
                    $nextToken = $phpcsFile->findNext($ignore, ($nextToken + 1), null, true);
                    if ($tokens[$nextToken]['code'] === T_FUNCTION) {
                        return;
                    }
                }

                $prevToken = $phpcsFile->findPrevious(
                    PHP_CodeSniffer_Tokens::$emptyTokens,
                    ($stackPtr - 1),
                    null,
                    true
                );

                if ($tokens[$prevToken]['code'] === T_OPEN_TAG) {
                    return;
                }

                if ($tokens[$stackPtr]['content'] === '/**') {
                    // The only exception to inline doc blocks is the /** @var */
                    // declaration.
                    $content = $phpcsFile->getTokensAsString($stackPtr, $tokens[$stackPtr]['comment_closer'] - $stackPtr + 1);
                    if (preg_match('#^/\*\* @var [a-zA-Z_\\\\]+ \$[a-zA-Z_]+ \*/$#', $content) !== 1) {
                        $error = 'Inline doc block comments are not allowed; use "/* Comment */" or "// Comment" instead';
                        $phpcsFile->addError($error, $stackPtr, 'DocBlock');
                        return;
                    }
                }
            }//end if
        }//end if

        if ($tokens[$stackPtr]['content']{0} === '#') {
            $error = 'Perl-style comments are not allowed; use "// Comment" instead';
            $phpcsFile->addError($error, $stackPtr, 'WrongStyle');
        }

        // We don't want end of block comments. If the last comment is a closing
        // curly brace.
        $previousContent = $phpcsFile->findPrevious(T_WHITESPACE, ($stackPtr - 1), null, true);
        if ($tokens[$previousContent]['line'] === $tokens[$stackPtr]['line']) {
            if ($tokens[$previousContent]['code'] === T_CLOSE_CURLY_BRACKET) {
                return;
            }

            // Special case for JS files.
            if ($tokens[$previousContent]['code'] === T_COMMA
                || $tokens[$previousContent]['code'] === T_SEMICOLON
            ) {
                $lastContent = $phpcsFile->findPrevious(T_WHITESPACE, ($previousContent - 1), null, true);
                if ($tokens[$lastContent]['code'] === T_CLOSE_CURLY_BRACKET) {
                    return;
                }
            }
        }

        $comment = rtrim($tokens[$stackPtr]['content']);

        // Only want inline comments.
        if (substr($comment, 0, 2) !== '//') {
            return;
        }

        // Ignore code example lines.
        if ($this->isInCodeExample($phpcsFile, $stackPtr) === true) {
            return;
        }

        // Verify the indentation of this comment line.
        $this->processIndentation($phpcsFile, $stackPtr);

        // The below section determines if a comment block is correctly capitalised,
        // and ends in a full-stop. It will find the last comment in a block, and
        // work its way up.
        $nextComment = $phpcsFile->findNext(array(T_COMMENT), ($stackPtr + 1), null, false);

        if (($nextComment !== false) && (($tokens[$nextComment]['line']) === ($tokens[$stackPtr]['line'] + 1))) {
            return;
        }

        $topComment  = $stackPtr;
        $lastComment = $stackPtr;
        while (($topComment = $phpcsFile->findPrevious(array(T_COMMENT), ($lastComment - 1), null, false)) !== false) {
            if ($tokens[$topComment]['line'] !== ($tokens[$lastComment]['line'] - 1)) {
                break;
            }

            $lastComment = $topComment;
        }

        $topComment  = $lastComment;
        $commentText = '';

        for ($i = $topComment; $i <= $stackPtr; $i++) {
            if ($tokens[$i]['code'] === T_COMMENT) {
                $commentText .= trim(substr($tokens[$i]['content'], 2));
            }
        }

        if ($commentText === '') {
            $error = 'Blank comments are not allowed';
            $phpcsFile->addError($error, $stackPtr, 'Empty');
            return;
        }

        $words = preg_split('/\s+/', $commentText);
        if (preg_match('|\p{Lu}|u', $commentText[0]) === 0 && $commentText[0] !== '@') {
            // Allow special lower cased words that contain non-alpha characters
            // (function references, machine names with underscores etc.).
            $matches = array();
            preg_match('/[a-z]+/', $words[0], $matches);
            if (isset($matches[0]) && $matches[0] === $words[0]) {
                $error = 'Inline comments must start with a capital letter';
                $phpcsFile->addError($error, $topComment, 'NotCapital');
            }
        }

        $commentCloser   = $commentText[(strlen($commentText) - 1)];
        $acceptedClosers = array(
                            'full-stops'        => '.',
                            'exclamation marks' => '!',
                            'or question marks' => '?',
                           );

        if (in_array($commentCloser, $acceptedClosers) === false && $commentText[0] !== '@') {
            // Allow @tag style comments without punctuation
            if ($commentText[0] !== '@') {
                // Allow special last words like URLs or function references
                // without punctuation.
                $lastWord = $words[count($words) - 1];
                $matches  = array();
                preg_match('/((\()?[$a-zA-Z]+\)|([$a-zA-Z]+))/', $lastWord,
                    $matches);
                if (isset($matches[0]) === true && $matches[0] === $lastWord) {
                    $error = 'Inline comments must end in %s';
                    $ender = '';
                    foreach ($acceptedClosers as $closerName => $symbol) {
                        $ender .= $closerName.', ';
                    }

                    $ender = rtrim($ender, ', ');
                    $data  = array($ender);
                    $phpcsFile->addError($error, $stackPtr, 'InvalidEndChar',
                        $data);
                }
            }
        }

        // Finally, the line below the last comment cannot be empty.
        $start = false;
        for ($i = ($stackPtr + 1); $i < $phpcsFile->numTokens; $i++) {
            if ($tokens[$i]['line'] === ($tokens[$stackPtr]['line'] + 1)) {
                if ($tokens[$i]['code'] !== T_WHITESPACE) {
                    return;
                }
            } else if ($tokens[$i]['line'] > ($tokens[$stackPtr]['line'] + 1)) {
                break;
            }
        }

        $error = 'There must be no blank line following an inline comment';
        $phpcsFile->addWarning($error, $stackPtr, 'SpacingAfter');

    }//end process()


    /**
     * Determines if a comment line is part of an @code/@endcode example.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return boolean Returns true if the comment line is within a @code block,
     *                 false otherwise.
     */
    protected function isInCodeExample(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens      = $phpcsFile->getTokens();
        $prevComment = $stackPtr;
        $lastComment = $stackPtr;
        while (($prevComment = $phpcsFile->findPrevious(array(T_COMMENT), ($lastComment - 1), null, false)) !== false) {
            if ($tokens[$prevComment]['line'] !== ($tokens[$lastComment]['line'] - 1)) {
                return false;
            }

            if ($tokens[$prevComment]['content'] === '// @code'.$phpcsFile->eolChar) {
                return true;
            }

            if ($tokens[$prevComment]['content'] === '// @endcode'.$phpcsFile->eolChar) {
                return false;
            }

            $lastComment = $prevComment;
        }

        return false;

    }//end isInCodeExample()


    /**
     * Checks the indentation level of the comment contents.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return void
     */
    protected function processIndentation(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens     = $phpcsFile->getTokens();
        $comment    = rtrim($tokens[$stackPtr]['content']);
        $spaceCount = 0;
        for ($i = 2; $i < strlen($comment); $i++) {
            if ($comment[$i] !== ' ') {
                break;
            }

            $spaceCount++;
        }

        if ($spaceCount === 0 && strlen($comment) > 2) {
            $error = 'No space before comment text; expected "// %s" but found "%s"';
            $data  = array(
                      substr($comment, 2),
                      $comment,
                     );
            $phpcsFile->addError($error, $stackPtr, 'NoSpaceBefore', $data);
        }

        if ($spaceCount > 1) {
            // Check if there is a comment on the previous line that justifies the
            // indentation.
            $prevComment = $phpcsFile->findPrevious(array(T_COMMENT), ($stackPtr - 1), null, false);
            if (($prevComment !== false) && (($tokens[$prevComment]['line']) === ($tokens[$stackPtr]['line'] - 1))) {
                $prevCommentText = rtrim($tokens[$prevComment]['content']);
                $prevSpaceCount  = 0;
                for ($i = 2; $i < strlen($prevCommentText); $i++) {
                    if ($prevCommentText[$i] !== ' ') {
                        break;
                    }

                    $prevSpaceCount++;
                }

                if ($spaceCount > $prevSpaceCount && $prevSpaceCount > 0) {
                    // A previous comment could be a list item or @todo.
                    $indentationStarters = array('-', '@todo');
                    $words = preg_split('/\s+/', $prevCommentText);
                    if (in_array($words[1], $indentationStarters) === true) {
                        if ($spaceCount !== ($prevSpaceCount + 2)) {
                            $error = 'Comment indentation error after %s element, expected %s spaces';
                            $phpcsFile->addError($error, $stackPtr, 'SpacingBefore', array($words[1], $prevSpaceCount + 2));
                        }
                    } else {
                        $error = 'Comment indentation error, expected only %s spaces';
                        $phpcsFile->addError($error, $stackPtr, 'SpacingBefore', array($prevSpaceCount));
                    }
                }
            } else {
                $error = '%s spaces found before inline comment; expected "// %s" but found "%s"';
                $data  = array(
                          $spaceCount,
                          substr($comment, (2 + $spaceCount)),
                          $comment,
                         );
                $phpcsFile->addError($error, $stackPtr, 'SpacingBefore', $data);
            }//end if
        }//end if

    }//end processIndentation()


}//end class
