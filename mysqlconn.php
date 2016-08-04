<?php

$conn = @mysql_connect('127.0.0.1','root','cmbc.138');
if (!$conn) {
	die('Could not connect: ' . mysql_error());
}
mysql_select_db('test', $conn);

?>