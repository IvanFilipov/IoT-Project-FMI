<?php 
	// if($_GET){
	// 	echo "yee";
	// }
	$methodName = $_SERVER['REQUEST_METHOD'];
	$_METHOD;
	if($methodName == "GET") $_METHOD = $_GET;
	else if($methodName == "POST") $_METHOD = $_POST;
	if($_METHOD && array_key_exists('unic_id',$_METHOD))
	{

		$unic_id = $_METHOD['unic_id'];
		$tempreture = $_METHOD['temperature'];
		// $val1 = $_POST['val2'];
		// $val1 = $_POST['val3'];

		// $unic_id = $_SERVER['HTTP_UNICID'];
		// $tempreture = $_SERVER['HTTP_TEMPERATURE'];

		// var_dump($_SERVER);
		// echo $unic_id;
		// echo $_SERVER['REQUEST_METHOD'];

		require_once("DB-esp-controller.php");
		$dbEspController = new DBESPController();

		if($dbEspController->exist($unic_id))
		{
			require_once("DB-data-controller.php");
			$dbDataController = new DBDataController();
			$dbDataController->pushData($_METHOD);
		}
		else {
			$result = array('result' => array('err' => 'ESP Not found'));
			echo json_encode($result);
			http_response_code(404);
		}
	}	
 ?>