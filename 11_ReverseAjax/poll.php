<?php
	ob_start();
	$lastModified = "";
	while(true)
	{
		clearstatcache();
		$modified = filemtime("reply.txt");
		if($lastModified != $modified)
		{
			$lastModified = $modified;
			$file = fopen("reply.txt", "r");
			$data = fread($file, filesize("reply.txt"));
			echo ";" . $data;
			ob_flush();
			flush();
		}
		sleep(1);
	}
?>