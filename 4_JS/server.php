<?php
	//Advantage of using iframe is that we can store history :	
	//	Therefore both back and forward button works
	extract($_GET);
	if($usn == "user1")
	{
		echo "<script type='text/javascript'>";
		echo "parent.disp('varun', 'cse', '9.06');";
		//echo "parent.validity('Valid', 'green', '" . $usn . "')";
		echo "</script>";
	}
	else if($usn == "user2")
	{
		echo "<script type='text/javascript'>";
		echo "parent.disp('arun', 'ece', '8.25');";
		echo "parent.validity('Valid', 'green', '" . $usn . "')";
		echo "</script>";
	}
	else
	{
		echo "<script type='text/javascript'>";
		echo "parent.validity('Invalid usn', 'red', '" . $usn . "')";
		echo "</script>";
	}
?>