<?php 
	require_once("DB-esp-controller.php");
	$dbEspController = new DBESPController();

	$esps = NULL;
	if (array_key_exists('HTTP_USERNAME', $_SERVER)) {
		$username = $_SERVER['HTTP_USERNAME'];
		$authKey = $_SERVER['HTTP_X_AUTH_KEY'];

		require_once("DB-user-controller.php");
		$dbUserController = new DBUserController();
		if($dbUserController->isLogin($username, $authKey))
		{
			require_once("DB-esp-controller.php");
			$dbEspController = new DBESPController();
			$esps = $dbEspController->getAllByLogin($username);
		}
	}
	if(is_null($esps)) $esps = $dbEspController->getAll();


	header('Content-Type: application/json');
	$res;
	$res["ESPS"] = $esps;
	$result = array('result' => $res);
	echo json_encode($result);


 ?>