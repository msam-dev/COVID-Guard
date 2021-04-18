function convertToNumber(str) {
    return Number(str.replace(/,/g, ''))
}

module.exports = {convertToNumber};