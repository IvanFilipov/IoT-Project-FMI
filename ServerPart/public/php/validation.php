<?php 
	abstract class Validate
	{
		protected $data;
		protected $requirements;
		protected $errors;
		protected $invalidFields;
		function __construct($data, $requirements)
		{
			$this->data = $data;
			$this->requirements = $requirements;
			$this->errors = array();
			$this->invalidFields = array();
		}

		abstract public function isValid();
		abstract public function getInvalidFields();
		abstract public function printErrors();
	}

	class ValidateLogin extends Validate
	{
		
		function __construct($data,  $requirements = null)
		{
			if(!$requirements)
			{
				$requirements = [
				 	"username" => [
					 	"max" => 100,
					 	"min" => 1
					 ],
				 	"password" => [
					 	"max" => 100,
					 	"min" => 1
					 ]
				];
			}
			parent::__construct($data, $requirements);
		}

		public function isValid()
		{
			foreach ($this->data as $fieldName => $fieldValue) 
			{
				$fieldRequirements = $this->requirements[$fieldName];
				if($fieldRequirements["max"] < strlen($fieldValue))
				{
					array_push($this->errors, $fieldName." need be less ".$fieldRequirements["max"]);
					array_push($this->invalidFields, $fieldName);
				}
				else if($fieldRequirements["min"] > strlen($fieldValue))
				{
					array_push($this->errors, $fieldName." need be more of ".$fieldRequirements["max"]);
					array_push($this->invalidFields, $fieldName);
				}
			}
			if(count($this->errors) != 0) return false;
			return true;
		}

		public function getInvalidFields()
		{
			return $this->invalidFields;
		}

		public function getErrors()
		{
			return $this->errors;
		}

		public function printErrors()
		{
			foreach ($this->errors as $error) {
				echo $error;
				echo " ";
			}
		}
	}
	class ValidateRegister extends Validate
	{
		
		function __construct($data,  $requirements = null)
		{
			if(!$requirements)
			{
				$requirements = [
				 	"username" => [
					 	"max" => 100,
					 	"min" => 1
					 ],
				 	"password" => [
					 	"max" => 100,
					 	"min" => 1
					 ],
				 	"email" => [
					 	"max" => 100,
					 	"min" => 1
					 ]
				];
			}
			parent::__construct($data, $requirements);
		}

		public function isValid()
		{
			foreach ($this->data as $fieldName => $fieldValue) 
			{
				$fieldRequirements = $this->requirements[$fieldName];
				if($fieldRequirements["max"] < strlen($fieldValue))
				{
					array_push($this->errors, $fieldName." need be less ".$fieldRequirements["max"]);
					array_push($this->invalidFields, $fieldName);
				}
				else if($fieldRequirements["min"] > strlen($fieldValue))
				{
					array_push($this->errors, $fieldName." need be more of ".$fieldRequirements["max"]);
					array_push($this->invalidFields, $fieldName);
				}
			}
			if(count($this->errors) != 0) return false;
			return true;
		}

		public function getInvalidFields()
		{
			return $this->invalidFields;
		}

		public function getErrors()
		{
			return $this->errors;
		}

		public function printErrors()
		{
			foreach ($this->errors as $error) {
				echo $error;
				echo " ";
			}
		}
	}

 ?>











