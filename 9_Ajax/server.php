<?php
	header("Content-type : text/xml");
	$data = file_get_contents("http://www.espncricinfo.com/rss/content/story/feeds/0.xml");
	echo $data;
?>