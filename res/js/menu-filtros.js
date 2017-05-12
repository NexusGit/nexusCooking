
cats=function(){

    $("#cats").slideToggle();
    $("#dif").slideUp();
    $("#tim").slideUp();

    $( "#cats-activo" ).toggleClass( "activo" )
    $( "#dif-activo" ).removeClass( "activo" );
    $( "#tim-activo" ).removeClass( "activo" );

}
dif=function(){

    $("#dif").slideToggle();
    $("#cats").slideUp();
    $("#tim").slideUp();

    $( "#dif-activo" ).toggleClass( "activo" )
    $( "#cats-activo" ).removeClass( "activo" );
    $( "#tim-activo" ).removeClass( "activo" );
}
tim=function(){

    $("#tim").slideToggle();
    $("#cats").slideUp();
    $("#dif").slideUp();

    $( "#tim-activo" ).toggleClass( "activo" )
    $( "#cats-activo" ).removeClass( "activo" );
    $( "#dif-activo" ).removeClass( "activo" );
}
