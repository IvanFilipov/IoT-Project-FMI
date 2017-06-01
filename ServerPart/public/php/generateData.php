<?php 

	require_once("DB-data-controller.php");
	$dbDataController = new DBDataController();
	$data = $_GET;

	$temperature = 20;
	$battery = 50;
	$humidity = 25;

	$time = new DateTime();
	for ($j=1; $j < 30; $j++) { 
		$time->setDate(2017,5,$j);
		for ($p=0; $p < 23; $p++) { 
			# code...
			for ($i=1; $i < 55; $i+=15) { 
				$time->setTime($p,$i);
				$unic_id = "aaa";
				$rand0 = rand ( 1 , 10 );

				if ($rand0 % 2) {
					$temperature++;
				}
				else $temperature--;

				$rand1 = rand ( 1 , 10 );
				if ($rand1 % 2) {
					$humidity++;
				}
				elseif($humidity > 0) $humidity--;

				// $rand2 = rand ( 1 , 10 );
				// if ($rand2 % 2) {
				// 	$battery++;
				// }
				// else $battery--;

				$newTime = date_format($time, "Y-m-d H:i:s");
				echo "time: ";
				echo date_format($time, "Y-m-d H:i:s");
				echo "</br>";
				echo "unic_id: ".$unic_id;
				echo " temperature: ".$temperature;
				echo " humidity: ".$humidity;
				echo " time: ".$newTime;
				$moment_time = $newTime;
				echo "</br>";
				echo "</br>";

				require_once("DB.php");
				$db = DB::getInstance();
				$query = "INSERT INTO data (unic_id, temperature, humidity, battery, moment_time) VALUES (:unic_id, :temperature, :humidity, :battery, :moment_time)";

				// $query = "INSERT INTO data (unic_id, temperature, humidity, battery) VALUES (:unic_id, :temperature, :humidity, :battery)";

				$statement = $db->connection->prepare($query);
				$statement->bindParam(":unic_id",$unic_id);
				$statement->bindParam(":temperature",$temperature);
				$statement->bindParam(":humidity",$humidity);
				$statement->bindParam(":battery",$battery);
				$statement->bindParam(":moment_time",$moment_time);
				$res = $statement->execute();
				echo $res;
				//DELETE FROM data WHERE id >135


		// $query = "INSERT INTO `users` (username, email, password) VALUES (:username, :email, :password)";
		// $statement = $this->db->connection->prepare($query);
		// $statement->bindParam(":username",$username);
		// $statement->bindParam(":email",$email);
		// $statement->bindParam(":password", $password);
		// $res = $statement->execute();
			}
		# code...
		}
	}




 ?>