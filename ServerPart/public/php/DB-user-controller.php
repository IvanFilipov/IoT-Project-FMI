<?php 
/**
* 
*/
require_once("DB.php");
abstract class IDBUserController 
{
	protected $db;
	function __construct($db)
	{
		$this->db = $db;
	}
	abstract public function create($username, $email, $password);
	abstract public function isLogin($username, $authKey);
	abstract public function canLogin($username, $password);
	abstract public function updateAuthKey($username, $authKey);
	abstract public function exist($username);
	abstract public function getCurrentUser($username);
	abstract public function getAllUsers();
}

class SQLUserController extends IDBUserController
{
	
	function __construct()
	{
		require_once("DB.php");
		$db = DB::getInstance();
		parent::__construct($db);
	}
	public function create($username, $email, $password)
	{
		$query = "INSERT INTO `users` (username, email, password) VALUES (:username, :email, :password)";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":email",$email);
		$statement->bindParam(":password", $password);
		$res = $statement->execute();
		return $res;
	}
	public function isLogin($username, $authKey)
	{

		$db = DB::getInstance();

		$query = "SELECT * FROM `users` WHERE username = :username AND authKey = :authKey";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":authKey",$authKey);
		$statement->execute();

		$count = $statement->rowCount();
		if($count != 0) return TRUE;
		return FALSE;
	}
	public function canLogin($username, $password)
	{

		$db = DB::getInstance();

		$query = "SELECT * FROM `users` WHERE username = :username AND password = :password";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":password",$password);
		$statement->execute();
		$count = $statement->rowCount();

		if($count != 0) return TRUE;
		return FALSE;
	}
	public function updateAuthKey($username, $authKey)
	{
		$uptate_authkey_query = "UPDATE users SET authKey = :authKey WHERE username = :username;";
		$statement = $this->db->connection->prepare($uptate_authkey_query);
		$statement->bindParam(":username",$username);
		$statement->bindParam(":authKey",$authKey);
		$statement->execute();
	}
	public function exist($username)
	{
		$check_user_exist_query = "SELECT * FROM `users` WHERE username = :username";
		$statement = $this->db->connection->prepare($check_user_exist_query);
		$statement->bindParam(":username",$username);
		$statement->execute();
		$count = $statement->rowCount();
		if($count != 0) return TRUE;
		else return FALSE;
	}
	public function getCurrentUser($username)
	{
		$username = $_SERVER['HTTP_USERNAME'];
		$authKey = $_SERVER['HTTP_X_AUTH_KEY'];
		$check_user_exist_query = "SELECT username, id FROM `users` WHERE username = :username";
		$statement = $this->db->connection->prepare($check_user_exist_query);
		$statement->bindParam(":username",$username);
		$statement->execute();
		$count = $statement->rowCount();
		if($count == 0) return FALSE;

		$user = $statement->fetch(PDO::FETCH_ASSOC);
		return $user;
	}

	public function getAllUsers()
	{	
		$query = "SELECT username, id FROM `users`";
		$statement = $this->db->connection->prepare($query);
		$statement->bindParam(":username",$username);
		$statement->execute();
		$count = $statement->rowCount();

		if($count != 0) return $statement->fetchAll(PDO::FETCH_ASSOC);
		return array();
	}
}

class DBUserController extends SQLUserController //adapter
{
	function __construct()
	{
		parent::__construct();
	}
}
 ?>






