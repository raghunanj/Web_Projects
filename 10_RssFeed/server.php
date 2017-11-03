<?php
	//use full line : https://developers.google.com/feed/v1/jsondevguide
	header('Content-type : text/xml');
	extract($_GET);
	$data = file_get_contents("http://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q=" . $category );
	$data = json_decode($data);
	$url = $data->responseData->entries[0]->url;
	//echo $url;
	$data = file_get_contents($url);
	echo $data;
?>