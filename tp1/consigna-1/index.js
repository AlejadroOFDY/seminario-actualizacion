var cajaComentario = document.getElementById("cajaComentario");

cajaComentario.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault();
        var texto = cajaComentario.value;
        alert(texto);
    }
});

var btnCambiarColor = document.getElementById("btnCambiarColor");
var estadoColor = 0;

btnCambiarColor.addEventListener("click", function () {
    estadoColor = (estadoColor + 1) % 3;

    switch (estadoColor) {
        case 0:
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
            break;
        case 1:
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
            break;
        case 2:
            document.body.style.backgroundColor = "lightblue";
            document.body.style.color = "red";
            break;
    }
});