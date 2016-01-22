<?php

watchdog('test', 'Request info: !response', array(
  '!response' => "<pre>Response:\n" . check_plain(var_export($body, TRUE)) . '</pre>',
), WATCHDOG_DEBUG);

watchdog('test', 'Request info: @response', array(
  '@response' => check_plain(var_export($body, TRUE)),
), WATCHDOG_DEBUG);
