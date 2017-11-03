<?php
	$res = array();
	$file = fopen("sports.txt", "r");
	$data = split("\n", fread($file, filesize("sports.txt")));
	$data = split(":", $data[0]);
	$res["rado"] = $data[0];
	$res["rollex"] = $data[1];
	$res["yonex"] = $data[2];
	$res["wilson"] = $data[3];
	if(count($_GET) != 0)
	{
		extract($_GET);
		$res[$item] -= 1;
		$fileOut = fopen("sports.txt", "w");
		fwrite($fileOut, $res["rado"] . ":" . $res["rollex"] . ":" . $res["yonex"] . ":" . $res["wilson"]);
		fclose($fileOut);
	}
	echo json_encode($res);
?>