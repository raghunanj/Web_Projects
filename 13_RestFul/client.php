<?php
	$method = "";
	extract($_GET);
	if($method == "read")
	{
		$str = "http://localhost/web%20lab/lab13/$method/student/$usn";
	}
	else if($method == "update")
	{
		$str = "http://localhost/web%20lab/lab13/$method/student/$usn/$grade";
	}
	else if($method == "create")
	{
		$str = "http://localhost/web%20lab/lab13/$method/student/$usn/$name/$grade";
	}
	else
	{
		$str = "http://localhost/web%20lab/lab13/server.php";
	}
	$data = file_get_contents($str);
	echo $data;
?>