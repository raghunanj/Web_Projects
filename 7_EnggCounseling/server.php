<?php
	$res = array();
	$file = fopen("seats.txt", "r");
	$data = split("\n", fread($file, filesize("seats.txt")));
	$temp1 = split(":", $data[0]);
	$temp2 = split(":", $data[1]);
	$res["pesit"] = array();
	$res["pesit"]["cse"] = $temp1[0];
	$res["pesit"]["ece"] = $temp1[1];
	
	$res["rvce"] = array();
	$res["rvce"]["cse"] = $temp2[0];
	$res["rvce"]["ece"] = $temp2[1];
	fclose($file);
	if(count($_GET) != 0)
	{
		extract($_GET);
		$res[$clg][$seat] -= 1;
		$fileOut = fopen("seats.txt", "w");
		fwrite($fileOut, $res["pesit"]["cse"] . ":" . $res["pesit"]["ece"] . "\n" .$res["rvce"]["cse"] . ":" .$res["rvce"]["ece"]);
		fclose($fileOut);
	}
	echo json_encode($res);
?>