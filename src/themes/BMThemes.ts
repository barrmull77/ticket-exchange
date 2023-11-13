import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = {
    palette: {
        primary: {
            main: '#de411b',
            dark: '#bd3717',
        },
        secondary: {
            main: '#F5C6BA',
        },
        background: {
            default: '#ffffff',
        },
        text: {
            primary: '#190703',
            secondary: '#030303',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            laptop: 1024,
        },
    },
    typography: {
        allVariants: {
            fontFamily: "'Roboto', sans-serif",
            textTransform: "none",
        },
        h1: {
            fontWeight: '600',
            fontSize: '1.6rem',
            '@media (min-width:600px)': {
                fontSize: '2.4rem',
            },
            '@media (min-width:1024px)': {
                fontSize: '3rem',
            },
        },
        h2: {
            fontWeight: '600',
            fontSize: '1.4rem',
            '@media (min-width:600px)': {
                fontSize: '2rem',
            },
            '@media (min-width:1024px)': {
                fontSize: '2.4rem',
            },
        },
        h3: {
            fontWeight: '600',
            fontSize: '1.2rem',
            '@media (min-width:600px)': {
                 fontSize: '1.4rem',
            },
            // '@media (min-width:900px)': {
            //     fontSize: '2.4rem',
            // },
        }
    }
} as const;

type CustomTheme = {
    [Key in keyof typeof theme]: typeof theme[Key]
}

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true; // removes the `xs` breakpoint
        sm: true;
        md: true;
        lg: true;
        xl: true;
        laptop: true;
    }
    interface Theme extends CustomTheme {
        breakpoint: BreakpointOverrides
    }
    interface ThemeOptions extends CustomTheme {
        breakpoint?: BreakpointOverrides
    }
}

export default createTheme(theme);
