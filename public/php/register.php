<?php 
	$json = file_get_contents('php://input');
	$obj = json_decode($json);
	if(isset($_POST) && array_key_exists('username',$obj) && 
		array_key_exists('email',$obj) &&
		array_key_exists('password',$obj))
	{
		$obj = get_object_vars($obj);
		require_once("validation.php");
		$validator = new ValidateRegister($obj);

		if($validator->isValid())
		{
			$username = $obj["username"];
			$email = $obj["email"];
			$password = $obj["password"];
			
			require_once("DB-user-controller.php");
			$dbUserController = new DBUserController();

			if($dbUserController->exist($username))
			{
				$result = array('result' => array('err' => 'user exist'));
				echo json_encode($result);
				http_response_code(400);
			}
			else 
			{
				$passHesh = sha1($password);
				$res = $dbUserController->create($username, $email, $passHesh);
				echo $res;
			}

		}
		else 
		{
			$errors = $validator->errors();
			$result = array('result' => array('err' => $errors));
			echo json_encode($result);
			http_response_code(400);
		}
	}
	else
	{
		$result = array('result' => array('err' => 'No user, no email, no pass?'));
		echo json_encode($result);
		http_response_code(400);
	}


 ?>