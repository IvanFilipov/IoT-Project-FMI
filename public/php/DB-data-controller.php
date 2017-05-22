<?php 
abstract class IDBDataController
{
	protected $db;
	function __construct($db)
	{
		$this->db = $db;
	}
	abstract public function pushData($array);
	abstract public function getDataByUnicIdFromAndTo($unic_id, $from, $to);
	abstract public function redirect($array);
}

/**
* 
*/
class SQLDBDataController extends IDBDataController
{
	function __construct()
	{
		require_once("DB.php");
		$db = DB::getInstance();
		parent::__construct($db);
	}

	public function pushData($array)
	{
		$prep = array();
		foreach($array as $key => $value ) {
		    $prep[':'.$key] = $value;
		}
		$query = "INSERT INTO data ( " . implode(', ',array_keys($array)) . ") VALUES (" . implode(', ',array_keys($prep)) . ")";

		$statement = $this->db->connection->prepare($query);
		$statement->execute($prep);
	}

	public function getDataByUnicIdFromAndTo($unic_id, $fromTime, $toTime)
	{
		$query = "SELECT temperature, moment_time FROM data WHERE unic_id = :unic_id AND moment_time > :fromTime AND moment_time < :toTime ";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":unic_id",$unic_id);
		$statement->bindParam(":fromTime", $fromTime);
		$statement->bindParam(":toTime", $toTime);
		$statement->execute();
		$data = $statement->fetchAll(PDO::FETCH_ASSOC);
		return $data;
	}

	public function redirect($array)
	{
		
	}
}

class DBDataController extends SQLDBDataController
{
	function __construct()
	{
		parent::__construct();
	}
}
 ?>