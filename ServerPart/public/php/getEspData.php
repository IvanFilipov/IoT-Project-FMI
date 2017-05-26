<?php 


if($_GET)
{
	$unic_id = $_GET["unic_id"];

	$fromDay = $_GET["fromDay"];
	$fromMonth = $_GET["fromMonth"];
	$fromYear = $_GET["fromYear"];
	$fromHour = $_GET["fromHour"];
	$fromMinute = $_GET["fromMinute"];

	$toDay = $_GET["toDay"];
	$toMonth = $_GET["toMonth"];
	$toYear = $_GET["toYear"];
	$toHour = $_GET["toHour"];
	$toMinute = $_GET["toMinute"];

	$fromDateTime = new DateTime();
	$fromDateTime->setDate($fromYear, $fromMonth, $fromDay);
	$fromDateTime->setTime($fromHour, $fromMinute);

	$toDateTime = new DateTime();
	$toDateTime->setDate($toYear, $toMonth, $toDay);
	$toDateTime->setTime($toHour, $toMinute);

	$fromTimeString = $fromDateTime->format('Y-m-d H:i:s');
	$toTimeString = $toDateTime->format('Y-m-d H:i:s');

	require_once("DB-data-controller.php");
	$dbDataController = new DBDataController();
	$data = $dbDataController->getDataByUnicIdFromAndTo(
		$unic_id,
		$fromTimeString,
		$toTimeString);

	header('Content-Type: application/json');
	$result = array('result' => array('data' => $data));
	echo json_encode($result);

}
 ?>
