<?php

	$params = null;
	parse_str(file_get_contents('php://input'), $params);

	$data = json_decode(stripslashes($params['data']));

	$result = (object) array(
		"result" => $data->library.' is a '.$data->type.' written in '.$data->language.'.'
	);

	echo json_encode($result);

?>