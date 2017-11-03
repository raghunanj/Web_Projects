<?php
	/***IMP****/
	//You require database for this pgm
	//Database name => test
	//Table name => details => id, name, grade
	
	$con = mysql_connect("127.0.0.1", "root", "varun");//mysql_connect(server, username, password)
	//Here just change the password field to the password you have used in database
	mysql_select_db("test");
	$res = "";
	if(isset($_GET["create"]))
	{
		//url format : 
		//	.../server.php?create=1pi11cs192,varun,9.06
		$temp = $_GET["create"];
		$temp = explode(",", $temp);
		$sql = "insert into details values('" . $temp[0] ."','" . $temp[1] . "','" . $temp[2] ."');";
		$res = mysql_query($sql, $con);
		if($res)
		{
			$res = array("result updated", true);
		}
		else
		{
			$res = array("usn exists", true);
		}
	}
	else if(isset($_GET["update"]))
	{
		//url format : 
		//	.../server.php?update=usn=1pi11cs192,grade=9.0
		$temp = $_GET["update"];
		$temp = explode(",", $temp);
		$usn = explode("=", $temp[0])[1];
		$grade = explode("=", $temp[1])[1];
		$sql = "update details set grade = " . $grade . "where usn = '" . $usn . "';";
		$res = mysql_query($sql, $con);
		if($res)
		{
			//mysql_query("commit");
			$res = array("update successful", true);
		}
		else
		{
			$res = array("update unsuccessful", true);
		}
	}
	else if(isset($_GET["read"]))
	{
		//url format : 
		//	.../server.php?read=usn=1pi11cs192
		$temp = $_GET["read"];
		$usn = explode("=", $temp)[1];
		$sql = "select name, grade from details where usn = '" . $usn . "';";
		$row = mysql_query($sql, $con);
		if($row = mysql_fetch_array($row))
		{
			$res["name"] = $row["name"];
			$res["grade"] = $row["grade"];
		}
		else
		{
			$res = array("Invalid usn", true);
		}
	}
	else
	{
		$res = array("Unknown query", true);
	}
	mysql_close($con);
	echo json_encode($res);
?>