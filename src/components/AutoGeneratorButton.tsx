'use client';

import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { ReactNode } from 'react';

interface AutoGeneratorButtonProps extends Omit<ButtonProps, 'startIcon' | 'variant'> {
  loading?: boolean;
  children: ReactNode;
  sx?: SxProps<Theme>; 
}

const AutoGeneratorButton = ({ loading, children, sx, ...props }: AutoGeneratorButtonProps) => {
  const styles = {
    backgroundColor: "#FF3737",
    borderRadius: "4px",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    '&:hover': {
      backgroundColor: "#FF6B6B",
      transform: "translateY(-1px)",
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  return (
    <Button
      variant="contained"
      startIcon={<AutoFixHighIcon />}
      disabled={loading || props.disabled}
      sx={{ ...styles, ...sx }}
      {...props}
    >
      {loading ? 'Processando...' : children}
    </Button>
  );
};

export default AutoGeneratorButton;
