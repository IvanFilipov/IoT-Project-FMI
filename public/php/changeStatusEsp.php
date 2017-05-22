<?php 
	$request_body = file_get_contents('php://input');
	$obj = json_decode($request_body);

	$newStatus = $obj->newStatus;
	$unic_id = $obj->unic_id;

	$username = $_SERVER['HTTP_USERNAME'];
	$authKey = $_SERVER['HTTP_X_AUTH_KEY'];

	require_once("DB-user-controller.php");
	$dbUserController = new DBUserController();

	if($dbUserController->isLogin($username, $authKey))
	{
		require_once("DB-esp-controller.php");
		$dbEspController = new DBESPController();
		$dbEspController->changeStatus($username, $unic_id, $newStatus);
	}


 ?>  
