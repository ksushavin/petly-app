import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')``;

export const Tittle = styled('h2')`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.38;
  color: ${({ theme }) => theme.palette.text.black};

  ${({ theme }) => theme.breakpoints.up('tablet')} {
    font-size: 68px;
    line-height: 1.47;
    text-shadow: 0.5px 0.5px 0.2px white, -0.5px -0.5px 0.2px white;
  }

  ${({ theme }) => theme.breakpoints.up('desktop')} {
    font-size: 68px;
  }
`;
