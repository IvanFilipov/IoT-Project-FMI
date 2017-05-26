<?php 		
			require_once("DB.php");
			$db = DB::getInstance();

			$check_user_exist_query = "SELECT * FROM `users` WHERE username = 'mirko' AND password = 'f10e2821bbbea527ea02200352313bc059445190'";
			$statement = $db->connection->prepare($check_user_exist_query);
			$user = $statement->execute();
			var_dump($user);
			echo $user->;


 ?>

 