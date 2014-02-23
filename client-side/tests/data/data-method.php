<?php

	$params = null;
	parse_str(file_get_contents('php://input'), $params);

	echo $_SERVER['REQUEST_METHOD'];

	if($params != null && isset($params['id'])) {
		echo $params['id'];
	}

?>