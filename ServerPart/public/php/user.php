<?php 
	header('Content-Type: application/json');
	$result = "";
	if(isset($_GET) && (array_key_exists('username',$_GET) 
		|| array_key_exists('HTTP_USERNAME', $_SERVER)))
	{
		$username = $_SERVER['HTTP_USERNAME'];
		$authKey = $_SERVER['HTTP_X_AUTH_KEY'];

		require_once("DB-user-controller.php");

		$dbUserController = new DBUserController();

		$user = $dbUserController->getCurrentUser($username);
		if($user != FALSE)
		{
			require_once("DB-esp-controller.php");
			$dbEspController = new DBESPController();
			$esps = "";
			if($dbUserController->isLogin($username ,$authKey))
			{
				$esps = $dbEspController->getUserESPSByLoginUsername($username);
			}
			else{
				$esps = $dbEspController->getUserESPSByNotLoginUsername($username);
			}

			$user['ESPS'] = $esps;
			$result = array('result' => $user);
		}
		else 
		{	
			$result = array('result' => array('err' => 'User Not found'));
			http_response_code(404);
		}
	}
	else if (isset($_GET)) {
		$result = array('result' => array('err' => 'Headers Not found'));
		http_response_code(404);
	}
	echo json_encode($result);


/*
<?php 
	function printPublic($username)
	{
		$db = DB::getInstance();
		$query = "SELECT ESPS.id, ESPS.name, ESPS.username FROM ESPS WHERE ESPS.username = :username AND ESPS.public = TRUE";
		$statement = $db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->execute();
		$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $esps;
	}
	header('Content-Type: application/json');
	if(isset($_GET) && (array_key_exists('username',$_GET) 
		|| array_key_exists('HTTP_USERNAME', $_SERVER)))
	{
		require_once("DB.php");
		$db = DB::getInstance();
		$username = $_SERVER['HTTP_USERNAME'];
		$authKey = $_SERVER['HTTP_X_AUTH_KEY'];
		$check_user_exist_query = "SELECT username, id FROM `users` WHERE username = :username";
		$statement = $db->connection->prepare($check_user_exist_query);
		$statement->bindParam(":username",$username);
		$statement->execute();
		$count = $statement->rowCount();
		$user = $statement->fetch(PDO::FETCH_ASSOC);

		if($count != 0)
		{
			require_once("isLogin.php");
			if(isLogin($username ,$authKey))
			{
				$query = "
SELECT ESPS.id, ESPS.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public FROM ESPS LEFT JOIN (select *
					    from data as a
					    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
					    group by unic_id) as data ON data.unic_id = ESPS.unic_id
WHERE ESPS.username = :username";
				$statement = $db->connection->prepare($query);
				$statement->bindParam(":username",$username);
				$statement->execute();

				$count = $statement->rowCount();
				$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
				// if($count == 0) 
				// {
				// 	$query = "SELECT ESPS.id, ESPS.name, ESPS.username FROM ESPS WHERE ESPS.username = :username";
				// 	$statement = $db->connection->prepare($query);
				// 	$statement->bindParam(":username",$username);
				// 	$statement->execute();
				// 	$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
				// }
				// echo "string";
				$user['ESPS'] = $esps;

			}
			else{
				// //когато няма данни, а само устройство, не се откриват
				// $query = "SELECT ESPS.id, data.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public
				// 	FROM ESPS, (select *
				// 	    from data as a
				// 	    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
				// 	    group by unic_id) as data WHERE ESPS.unic_id = data.unic_id  AND ESPS.username = :username AND ESPS.public = TRUE;";
				// $statement = $db->connection->prepare($query);
				// $statement->bindParam(":username",$username);
				// $statement->execute();
				// $esps = $statement->fetchAll(PDO::FETCH_ASSOC);


				$query = "
SELECT ESPS.id, ESPS.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public FROM ESPS LEFT JOIN (select *
					    from data as a
					    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
					    group by unic_id) as data ON data.unic_id = ESPS.unic_id
WHERE ESPS.username = :username AND ESPS.public = TRUE";
				$statement = $db->connection->prepare($query);
				$statement->bindParam(":username",$username);
				$statement->execute();

				$count = $statement->rowCount();
				$esps = $statement->fetchAll(PDO::FETCH_ASSOC);


				$user['ESPS'] = $esps;


			}
			$result = array('result' => $user);
			echo json_encode($result);
		}
		else 
		{	
			$result = array('result' => array('err' => 'User Not found'));
			echo json_encode($result);
			http_response_code(404);
		}
	}
	else if (isset($_GET)) {
		$result = array('result' => array('err' => 'Headers Not found'));
		echo json_encode($result);
		http_response_code(404);
	}



 ?>










*/
 ?>









