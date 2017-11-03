<?php
	
	extract($_GET);
	$file = fopen("books.txt", "r");
	$data = split("\n", fread($file, filesize("books.txt")));
	$res = array();
	foreach($data as $rec)
	{
		$temp = split(":", $rec);
		$res[$temp[0]] = $temp[1];
	}
	if(isset($res[$isbn]))
	{
		echo $res[$isbn];
	}
	else
	{
		echo "no book available";
	}

?>