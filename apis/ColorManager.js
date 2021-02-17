export function shadeColor(hex, percent) {
    let color = {
        R: parseInt(hex.substring(1, 3), 16),
        G: parseInt(hex.substring(3, 5), 16),
        B: parseInt(hex.substring(5, 7), 16)
    }

    color.R = parseInt(color.R * (100 + percent) / 100);
    color.G = parseInt(color.G * (100 + percent) / 100);
    color.B = parseInt(color.B * (100 + percent) / 100);

    color.R = (color.R < 255) ? color.R : 255;
    color.G = (color.G < 255) ? color.G : 255;
    color.B = (color.B < 255) ? color.B : 255;

    let result = {
        R: ((color.R.toString(16).length == 1) ? "0" + color.R.toString(16) : color.R.toString(16)),
        G: ((color.G.toString(16).length == 1) ? "0" + color.G.toString(16) : color.G.toString(16)),
        B: ((color.B.toString(16).length == 1) ? "0" + color.B.toString(16) : color.B.toString(16))
    }

    return "#" + result.R + result.G + result.B;
}

export default { shadeColor }