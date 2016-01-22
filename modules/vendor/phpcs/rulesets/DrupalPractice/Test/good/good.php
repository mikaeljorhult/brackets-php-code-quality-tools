<?php

/**
 * @file
 * This file should throw no warnings/errors.
 */

$form['vocab_fieldset']['entity_view_modes'] = array(
  '#type'     => 'select',
  '#prefix'   => '<div id="entity_view_modes_div">',
  '#suffix'   => '</div>',
  '#title'    => t('View Mode'),
  '#description' => '<p>' . t('test description') . '</p>',
  '#required' => 1,
  '#options'  => array(),
  '#ajax' => array(
    'callback' => 'custom_listing_pages_entity_vocabulary_listing',
    'wrapper'  => 'vocab_fieldset_div',
    'method'   => 'replace',
    'effect'   => 'fade',
  ),
);
print_r($form);

/**
 * Ignoring the array value in a foreach loop is OK.
 */
function test1() {
  $array = array(1, 2);
  foreach ($array as $key => $value) {
    print $key;
  }

  try {
    print 'foo';
  }
  catch (Exception $e) {
    // $e is unused here, which is fine.
    print 'error';
  }

  // Initializing an array on the fly is allowed.
  $items['foo'] = 'bar';
  return $items;
}

/**
 * Variables that are used by reference are allowed to not be read.
 */
function test2() {
  $list = &some_other_function();
  $list = array();
}

/**
 * Variables that are used by reference are allowed to not be read.
 */
function test3(&$variables, $hook) {
  foreach ($variables['items'] as &$item) {
    $item['image'] = 'foo';
  }
}

/**
 * Global variables that are used in ifs should not be flagged as unused.
 */
function test4() {
  global $user;
  $x = 5;
  if ($x == 5) {
    $user = 123;
  }
}
