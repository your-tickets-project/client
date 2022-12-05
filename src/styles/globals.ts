import css from 'styled-jsx/css';
import { breakPoints, colors, fluidFont, fonts } from './variables';

export default css.global`
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&display=swap');

  /* ! ****** Reset ****** */
  html {
    box-sizing: border-box;
    font-family: ${fonts.font1};
    font-size: 16px;
    scroll-behavior: smooth;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  body {
    color: ${colors.black};
    margin: 0;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
  }

  h1 {
    margin: 0;
    font-size: ${fluidFont.h1};
  }

  h2 {
    margin: 0;
    font-size: ${fluidFont.h2};
  }

  h3 {
    margin: 0;
    font-size: ${fluidFont.h3};
  }

  h4 {
    margin: 0;
    font-size: ${fluidFont.h4};
  }

  h5 {
    margin: 0;
    font-size: ${fluidFont.h5};
  }

  h6 {
    margin: 0;
    font-size: ${fluidFont.h6};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  svg {
    height: auto;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }

  p {
    font-size: ${fluidFont.p};
    font-weight: 400;
    line-height: 1.2;
  }

  blockquote {
    margin: 0;
  }

  input {
    font-family: ${fonts.font1};
  }

  /* ****** Utilities ****** */
  .box-shadow {
    box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%),
      0 5px 12px 4px rgb(0 0 0 / 9%);
  }

  .container {
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    width: 90%;
  }

  .logo {
    align-items: center;
    color: ${colors.color1};
    display: flex;
    font-size: clamp(1rem, calc(0.66rem + 1.96vw), 2.13rem);
    font-weight: bold;
    justify-content: center;
    text-align: center;
    text-decoration: none;
  }

  @media (min-width: ${breakPoints.sm}) {
    .logo {
      font-size: 1.8rem;
      justify-content: flex-start;
    }
  }
`;
