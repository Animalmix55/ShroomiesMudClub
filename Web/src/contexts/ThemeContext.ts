import React from 'react';

interface Colors {
    primary: RGB;
    secondary: RGB;
}

interface ButtonColors extends Colors {
    disabled: RGB;
}

export interface ThemeContextType {
    fontFamily: string;
    fontColors: {
        normal: Colors;
        hovered: Colors;
    };
    buttonColors: {
        normal: ButtonColors;
        hovered: ButtonColors;
    };
    backgroundColor: RGB;
    lighterBackgroundColor: RGB;
    pallette: {
        darkBlue: RGB;
        lightBlue: RGB;
        darkPurple: RGB;
        lightPurple: RGB;
        yellow: RGB;
        mint: RGB;
        pink: RGB;
    };
}

const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
};

export class RGB {
    public a: number;

    public r: number;

    public g: number;

    public b: number;

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public getRGB = (): { r: number; g: number; b: number } => ({
        r: this.r,
        g: this.g,
        b: this.b,
    });

    public setA = (a: number): RGB => {
        this.a = a;
        return this;
    };

    public toHex = (): string => {
        return `#${componentToHex(this.r)}${componentToHex(
            this.g
        )}${componentToHex(this.b)}`;
    };

    public getCSSColor = (alpha: number): string =>
        `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha || this.a || 1})`;
}

const rgb = (r: number, g: number, b: number, a?: number): RGB =>
    new RGB(r, g, b, a);

export const defaultTheme: ThemeContextType = {
    fontFamily: `'Open Sans', sans-serif`,
    fontColors: {
        normal: {
            primary: rgb(0, 0, 0),
            secondary: rgb(255, 255, 255),
        },
        hovered: {
            primary: rgb(32, 32, 32),
            secondary: rgb(230, 230, 230),
        },
    },
    buttonColors: {
        normal: {
            primary: rgb(255, 255, 255),
            secondary: rgb(219, 174, 59),
            disabled: rgb(82, 82, 82),
        },
        hovered: {
            primary: rgb(255, 255, 255),
            secondary: rgb(247, 221, 136),
            disabled: rgb(82, 82, 82),
        },
    },
    backgroundColor: rgb(0, 0, 0),
    lighterBackgroundColor: rgb(108, 164, 209),
    pallette: {
        yellow: rgb(253, 232, 99),
        darkBlue: rgb(0, 60, 102),
        lightBlue: rgb(10, 194, 255),
        darkPurple: rgb(63, 0, 115),
        lightPurple: rgb(124, 77, 255),
        mint: rgb(167, 252, 146),
        pink: rgb(255, 117, 195),
    },
};
const ThemeContext = React.createContext<ThemeContextType>(defaultTheme);

export const ThemeContextProvider = ThemeContext.Provider;
export const useThemeContext = (): ThemeContextType =>
    React.useContext(ThemeContext);
