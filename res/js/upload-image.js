// Sube un fichero al stg de FB
function handleFileSelect(evt){
    var file = evt.target.files[0];
    var metadata = {
        'contentType': file.type
    };
    var generatedKey = db.ref('db/').child('imagesKeys').push().key;
    storageRef.child('stg/recipes/images/' + generatedKey + '/' + file.name).put(file, metadata).then(function(snapshot) {
        localStorage.setItem('currentURLimg', snapshot.downloadURL);
    }).catch(function(error) {
        alert('Error on the action: Upload failed', error);
    });
}
document.getElementById('file').addEventListener('change', handleFileSelect, false);
