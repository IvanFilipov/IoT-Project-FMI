<?php 
/**
* 
*/
abstract class IDBESPController
{
	protected $db;
	function __construct($db)
	{
		$this->db = $db;
	}
	abstract public function add($username, $espName, $unic_id);
	abstract public function remove($username, $unic_id);
	abstract public function rename($username, $unic_id, $newName);
	abstract public function changeStatus($username, $unic_id, $newStatus);
	abstract public function getAll();
	abstract public function getESPSByLoginUsername($username);
	abstract public function getESPSByNotLoginUsername($username);
	abstract public function exist($unic_id);
}

/**
* 
*/
class SQLDBESPController extends IDBESPController
{
	
	function __construct()
	{
		require_once("DB.php");
		$db = DB::getInstance();
		parent::__construct($db);
	}


	public function add($espName, $unic_id, $username)
	{
		$query = "INSERT INTO `ESPS` (name, unic_id, username) VALUES (:name, :unic_id, :username)";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":name",$espName);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->bindParam(":username", $username);
		$res = $statement->execute();
		return $res;
	}
	public function remove($username, $unic_id)
	{

		$query = "DELETE FROM `ESPS` WHERE unic_id=:unic_id AND username=:username";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->bindParam(":username", $username);
		$res = $statement->execute();
		return $res;
	}
	public function rename($username, $unic_id, $newName)
	{
		$query = "UPDATE ESPS SET name = :name  WHERE username = :username AND unic_id = :unic_id;";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->bindParam(":name", $newName);
		$res = $statement->execute();
		return $res;
	}
	public function changeStatus($username, $unic_id, $newStatus)
	{
		$query = "UPDATE ESPS SET public = :newStatus  WHERE username = :username AND unic_id = :unic_id;";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->bindParam(":newStatus", $newStatus);
		$res = $statement->execute();
		return $res;
	}
	public function getAll()
	{

		$query = "
SELECT ESPS.id, ESPS.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public FROM ESPS LEFT JOIN (select *
			    from data as a
			    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
			    group by unic_id) as data ON data.unic_id = ESPS.unic_id
WHERE ESPS.public = TRUE";

		// $query = "SELECT name, unic_id, username FROM `ESPS`";
		$statement = $this->db->connection->prepare($query);
		$statement->execute();
		$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $esps;
	}
	public function getESPSByLoginUsername($username)
	{

		$query = "
SELECT ESPS.id, ESPS.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public FROM ESPS LEFT JOIN (select *
			    from data as a
			    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
			    group by unic_id) as data ON data.unic_id = ESPS.unic_id
WHERE ESPS.username = :username";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->execute();

		$count = $statement->rowCount();
		$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $esps;
	}
	public function getESPSByNotLoginUsername($username)
	{
		$query = "
SELECT ESPS.id, ESPS.unic_id, data.temperature, ESPS.name, ESPS.username, ESPS.public FROM ESPS LEFT JOIN (select *
			    from data as a
			    where a.id = (select max(id) from data where unic_id = a.unic_id group by a.unic_id)
			    group by unic_id) as data ON data.unic_id = ESPS.unic_id
WHERE ESPS.username = :username AND ESPS.public = TRUE";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->execute();

		$count = $statement->rowCount();
		$esps = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $esps;
	}
	public function exist($unic_id)
	{
		$check_esp_exist_query = "SELECT * FROM `ESPS` WHERE unic_id = :unic_id";
		$statement = $this->db->connection->prepare($check_esp_exist_query);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->execute();

		$count = $statement->rowCount();
		if($count != 0) return TRUE;
		else return FALSE;
	}
}


class DBESPController extends SQLDBESPController //adapter
{
	
	function __construct()
	{
		parent::__construct();
	}
}

 ?>