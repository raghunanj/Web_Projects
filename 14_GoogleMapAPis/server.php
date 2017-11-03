<?php
	$data = file_get_contents("location.txt");
	$arr = explode("\n",$data);
	$clg = array();
	foreach($arr as $val)
	{
		$temp = explode(":",$val);
		$temp2 = explode(",",$temp[1]);
		$lat = $temp2[0];
		$lng = $temp2[1];
		$clg[$temp[0]] = array($lat,$lng);
	}
	echo json_encode($clg)
?>