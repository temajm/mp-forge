export default class Theme {

    static LIGHT = 0;
    static DARK = 1;

    static theme = Theme.DARK;

    static palettes = {
        0: { // light
            colorText: "#212121",
            colorBgBase: "#ECEFF1",
            colorPrimary: "#1E88E5",
        },
        1: { // dark
            colorText: "#F5F5F5",
            colorBgBase: "#37474F",
            colorPrimary: "#1E88E5",
        }
    }

    static getPalette = () => {
        return Theme.palettes[Theme.theme];
    }

    static setTheme = (theme) => {
        Theme.theme = theme;
    }

    static getTheme = () => {
        return Theme.theme
    }
}