<?php

	if(isset($_SERVER['HTTP_ABSURD_HEADER'])) {
		echo $_SERVER['HTTP_ABSURD_HEADER'];
	} else {
		echo 'No no no!';
	}

?>