<?php 
	function isLogin($username, $authKey)
	{
		require_once("DB.php");
		$db = DB::getInstance();

		$query = "SELECT * FROM `users` WHERE username = :username AND authKey = :authKey";
		$statement = $db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":authKey",$authKey);
		$statement->execute();

		$count = $statement->rowCount();
		if($count != 0) return TRUE;
		return FALSE;
	}
 ?>