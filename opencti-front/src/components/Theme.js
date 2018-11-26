export default {
    fontFamily: 'Roboto, sans-serif',
    palette: {
        type: 'dark',
        text: {main: '#ffffff', disabled: '#4f4f4f', disabledDark: '#434343'},
        primary: {main: '#00bcd4', hover: '#008498'},
        secondary: {main: '#ff3d00', hover: '#ff5d00'},
        header: {background: '#000000', 'text': '#ffffff'},
        nav: {background: '#1a1a1a'},
        navAlt: {background: '#14262c'},
        navBottom: {background: '#0f181f'},
        paper: {background: '#303a3d', disabled: '#181f22'},
        field: {background: 'rgba(64, 193, 255, 0.2)'}
    },
    typography: {
        useNextVariants: true,
        h1: {
            margin: '0 0 10px 0',
            padding: 0,
            color: '#00bcd4',
            fontWeight: 400,
            fontSize: 18,
        },
        h2: {
            margin: '0 0 10px 0',
            padding: 0,
            color: '#ffffff',
            fontWeight: 400,
            fontSize: 15
        },
        h3: {
            margin: '0 0 10px 0',
            padding: 0,
            color: '#00bcd4',
            fontWeight: 400,
            fontSize: 13
        },
        h4: {
            margin: '0 0 10px 0',
            padding: 0,
            color: '#ffffff',
            fontWeight: 400,
            fontSize: 13
        },
        h6: {
            color: '#ffffff',
            fontWeight: 400,
            fontSize: 18
        }
    }
}