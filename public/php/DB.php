<?php 
class DB
{
	public $connection;
	private $user = 'root';
	private $pass = '';
	private $dbName = 'iot';
	private static $instance = NULL;
	private function __construct()
	{
		try {
			$this->connection = new PDO("mysql:host=localhost;dbname={$this->dbName}", $this->user, $this->pass);
		} catch (Exception $e) {
			echo "cant connect";
		}

		$this->connection->query("SET NAMES utf8");
	}

	public static function getInstance(): DB
	{
		if(self::$instance == NULL)
		{
			self::$instance = new DB;
		}
		return self::$instance;
	}
}

?>