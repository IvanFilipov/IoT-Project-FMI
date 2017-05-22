<?php 
	header('Content-Type: application/json');

	require_once("DB-user-controller.php");
	$dbUserController = new DBUserController();
	$users = $dbUserController->getAllUsers();
	if(count($users))
	{
		$result = array('result' => $users);
		echo json_encode($result);
	}
	else 
	{
		$result = array('result' => array('err' => 'User not found'));
		$result = array('result' => $users);
		echo json_encode($result);
		http_response_code(400);
	}
 ?>