<?php

class Drupal_Sniffs_Classes_UnusedUseStatementUnitTest extends CoderSniffUnitTest
{


    /**
     * Returns the lines where errors should occur.
     *
     * The key of the array should represent the line number and the value
     * should represent the number of errors that should occur on that line.
     *
     * @return array(int => int)
     */
    public function getErrorList($testFile)
    {
        return array();

    }//end getErrorList()


    /**
     * Returns the lines where warnings should occur.
     *
     * The key of the array should represent the line number and the value
     * should represent the number of warnings that should occur on that line.
     *
     * @return array(int => int)
     */
    public function getWarningList($testFile)
    {
        return array(
                3 => 1,
                4 => 1,
                5 => 1,
                8 => 1,
                9 => 1,
                10 => 1,
                12 => 1,
               );

    }//end getWarningList()


}//end class
