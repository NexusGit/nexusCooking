var file;
var metadata;
var isPossible;

// Sube un fichero al stg de FB
function handleFileSelect(evt){
    // FALTA VERIFICAR EL TIPO DE DATO QUE SEA IMAGEN Y LAS DIMENSIONES QUE SEAN 700X700
    try{
        isPossible = true;
        file = evt.target.files[0];
        if (file.size > (1024 * 1024 * 1.1)){
            alert("El archivo es demasiado pesado. Max 1.1Mb");
            isPossible = false;
        }
        img = new Image();
        img.onload = function () {
            if (!((this.width == this.height) && (this.width > 500))){
                isPossible = false;
                alert("Las dimensiones de la imagen deben ser estrictamente de 700x700");
            }
            return;
        };
        img.src = window.URL.createObjectURL(file);
        if (!(/\.(jpeg|jpg)$/i).test(file.name)){
            isPossible = false;
            alert("La extension no es valida");
        }
        metadata = {
            'contentType': file.type
        }
    }
    catch(err){
        isPossible = false;
        console.log(err);
        alert(err);
    }
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);