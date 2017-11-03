<?php
	$data = file_get_contents("cricket.txt");
	$data = explode("\n", $data);
	$res = array();
	foreach($data as $player)
	{
		$player = explode(":", $player);
		if(strcasecmp(@$player[1], $_GET["country"]) == 0)
		{
			$res[$player[0]] = array($player[1], $player[2], $player[3], $player[4]);
		}
	}
	if(count($res))
	{
		echo json_encode($res);
	}
	else
	{
		echo "";
	}
?>