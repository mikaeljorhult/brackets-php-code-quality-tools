<?php

$form['test'] = array(
  '#type' => 'textfield',
  '#title' => t('Test'),
  '#default_value' => check_plain(variable_get('test')),
);
