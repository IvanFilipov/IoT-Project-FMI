<?php 
	$result = "";
	$json = file_get_contents('php://input');
	$obj = json_decode($json);
	if(isset($_POST) && array_key_exists('username',$obj) && 
		array_key_exists('password',$obj))
	{
		$obj = get_object_vars($obj);
		require_once("validation.php");
		$validator = new ValidateLogin($obj);

		if($validator->isValid())
		{
			$username = $obj["username"];
			$passHesh = sha1($obj["password"]);

			require_once("DB-user-controller.php");
			$dbUserController = new DBUserController();

			$canLogin = $dbUserController->canLogin($username, $passHesh);

			if($canLogin)
			{
				// session_start();
				// $_SESSION['username'] = $username;
				require_once("auth-key-generator.php");
				$authKey = RandomGenerator::getRandomString(40);

				$dbUserController->updateAuthKey($username, $authKey);

				$result = array('result' => array('username' => $username, 'authKey'=> $authKey));
				http_response_code(200);
			}
			else 
			{
				$result = array('result' => array('err' => "Incorect user or pass"));
				header('Content-Type: application/json');
				http_response_code(400);
			}
		}
		else 
		{
			$errors = $validator->errors();
			$result = array('result' => array('err' => $errors));
			header('Content-Type: application/json');
			http_response_code(400);
		}
	}
	else
	{
		$result = array('result' => array('err' => 'No user, no email, no pass?'));
		header('Content-Type: application/json');
		http_response_code(400);
	}
	echo json_encode($result);
 ?>