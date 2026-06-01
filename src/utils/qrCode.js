const QRCode = require('qrcode');

function generateQRCodeDataUrl(shortUrl) {
    return QRCode.toDataURL(shortUrl, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 300,
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });
}

module.exports = {
    generateQRCodeDataUrl,
};