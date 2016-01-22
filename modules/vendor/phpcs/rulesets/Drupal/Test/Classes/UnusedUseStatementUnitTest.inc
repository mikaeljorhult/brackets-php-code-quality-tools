<?php

use Foo\Bar;
use Bar\Fail;
use Test\Bar\Thing;
use Thing\Fail\ActuallyUsed;
use Test\TraitTest;
use Thing\NotUsed;
use Test\AnotherTrait;
use Thing\SomeName as OtherName;
use Thing\DifferentName as UsedOtherName;
use Another\UnusedUse;

/**
 * Bla.
 */
class Pum {
  use TraitTest;
  use Test\AnotherTrait;

  /**
   * Description.
   */
  protected function test(ActuallyUsed $x, UsedOtherName $y) {

  }

  /**
   * Description.
   */
  protected function test2(\Thing\NotUsed $x) {

  }

}
