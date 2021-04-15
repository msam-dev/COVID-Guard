function generateBusinessCode(){
    return getRandomInt(1679616, 60466176).toString(36).toUpperCase()
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
module.exports = {generateBusinessCode};