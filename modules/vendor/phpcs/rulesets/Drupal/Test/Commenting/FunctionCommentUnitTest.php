<?php

class Drupal_Sniffs_Commenting_FunctionCommentUnitTest extends CoderSniffUnitTest
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
        return array(
                7 => 1,
                9 => 1,
                18 => 1,
                28 => 1,
                38 => 1,
                48 => 1,
                57 => 1,
                66 => 1,
                73 => 1,
                82 => 1,
                87 => 1,
                96 => 1,
                108 => 1,
                121 => 2,
                142 => 1,
                143 => 3,
                175 => 1,
                182 => 1,
               );

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
        return array();

    }//end getWarningList()


}//end class
