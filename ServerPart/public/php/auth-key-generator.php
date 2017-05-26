<?php 
class RandomGenerator
{
	private static $chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    // private static const $length = 40;

   	private static function getRandomNumber($min = 0, $max = 2147483647) {
	    return rand($min, $max);
	}

	public static function getRandomString($length) {
	    $str = '';
	    for ($i = 0; $i < $length; $i += 1) {
	    	$charsCount = strlen(RandomGenerator::$chars) - 1;
	        $index = self::getRandomNumber(0, $charsCount);
	        $char = RandomGenerator::$chars[$index];
	        $str = $str . $char;
	    }
	    return $str;
	}
}










 ?>