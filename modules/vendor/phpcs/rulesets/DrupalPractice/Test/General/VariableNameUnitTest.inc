<?php

$form = array(
  'test' => array(
    '#type' => 'textfield',
    '#title' => t('Minimum cache refresh time'),
    '#description' => t('The minimum amount of time before cron will force a cache clear.'),
    '#element_validate' => array('element_validate_integer'),
    '#required' => TRUE,
    '#size' => 5,
    '#default_value' => variable_get('wrongprefix_cron_min', 60),
    '#field_suffix' => t('Minutes'),
  ),
);
