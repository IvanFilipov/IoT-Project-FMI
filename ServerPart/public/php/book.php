<?php 
	require_once("DB-esp-controller.php");
	$dbEspController = new DBESPController();
	$esps = $dbEspController->getAll();


	header('Content-Type: application/json');
	$res;
	$res["ESPS"] = $esps;
	$result = array('result' => $res);
	echo json_encode($result);


 ?>