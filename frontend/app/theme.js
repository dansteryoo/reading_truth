import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333333',
      black: '#111111',
      blue: '#0000FF',
    },
    secondary: {
      main: '#cc0000',
      darkRed: '#a60321',
      mainYellow: '#ffeb49',
      lightYellow: '#fff080',
      greenCheck: '#00e676',
      activeGreen: '#056B1A',
      lightBlue: '#80bdff',
      darkPurple: '#7e35cc',
      lightPurple: '#cfcef2',
      mediumGray: '#666666',
      lightGray: '#f4f4f4',
      gray: '#999999',
      pink: '#ffdddd',
      gainsboro: '#dcdcdc',
    },
    button: {
      white: '#fff',
      whiteHover: '#999999',
      yellow: '#ffeb49',
      yellowHover: '#7F7524',
      green: '#4caf50',
      greenHover: '#357a38',
      orangeRed: '#f44336',
      red: '#cc0000',
      redHover: '#8e0000',
      purple: '#7e35cc',
      purpleHover: '#46207f',
      gray: '#999999',
      grayHover: '#666666',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: `"Open Sans", "Helvetica", "Arial", "Lucida", sans-serif`,
    fontSize: 13.5,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
  },
});

export default theme;
