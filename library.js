const moment = require ('moment');

module.exports.fechaCool = () => {
    const fecha = new moment("2/07/2021","DD/MM/YY");
    const fechaFormateada = fecha.format ("MM/DD/YY");
    return fechaFormateada;
};
