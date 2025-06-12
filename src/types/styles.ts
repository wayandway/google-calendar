export type Colors = {
  brand: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  event: {
    blue: {
      light: string;
      medium: string;
      dark: string;
    };
    green: {
      light: string;
      medium: string;
      dark: string;
    };
    red: {
      light: string;
      medium: string;
      dark: string;
    };
    yellow: {
      light: string;
      medium: string;
      dark: string;
    };
    purple: {
      light: string;
      medium: string;
      dark: string;
    };
  };
  neutral: {
    white: string;
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
    };
    black: string;
  };
};

export type Breakpoints = {
  mobile: string;
  tablet: string;
  laptop: string;
  desktop: string;
};

export type MediaQueries = {
  mobile: string;
  tablet: string;
  laptop: string;
  desktop: string;
};
