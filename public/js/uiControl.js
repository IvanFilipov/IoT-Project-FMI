function hideIfNotCurrent(){
	$(".hidden-when-not-current-user").each(function( index ) {
		$thisElement = $(this);
		// console.log($thisElement);
		$username = $thisElement.attr("data-username") || $thisElement.parent().attr("data-username");
		// $username = $thisElement.attr("data-username");
		if(localStorage.getItem("username") && $username != localStorage.getItem("username"))
		{
	  		$thisElement.hide();
		}
	});
}