
// $("li").on("click", "a" , function(){
// 	$(this).toggleClass("completed");
// });

$("ul").on("click", "a", function(event){
	event.stopPropagation();
	$(this).parent().fadeOut(400 , function(){
		$(this).remove();
	});
});


$("h1").on("click" , "span" , function() {
	$("input[type='text']").fadeToggle(400);
	$("button[type='submit']").fadeToggle(400);
});
