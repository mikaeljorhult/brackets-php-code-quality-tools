<?php

db_query('INSERT INTO {node}');
db_query('UPDATE {node}');
db_query("DELETE FROM {node}");

/**
 * Implements hook_install().
 */
function testmodule_install() {
  db_query("
    UPDATE {system}
    SET weight = 20
    WHERE type = 'module' AND
          name = 'node'");
}

db_query("TRUNCATE TABLE {node}");
