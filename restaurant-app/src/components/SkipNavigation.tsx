import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const SkipLink = styled(Button)(({ theme }) => ({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  '&:focus': {
    position: 'fixed',
    top: theme.spacing(1),
    left: theme.spacing(1),
    width: 'auto',
    height: 'auto',
    zIndex: theme.zIndex.tooltip,
  },
}));

const SkipNavigation: React.FC = () => {
  const handleSkip = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <SkipLink
      variant="contained"
      onClick={handleSkip}
      tabIndex={0}
      aria-label="Skip to main content"
    >
      Skip to main content
    </SkipLink>
  );
};

export default SkipNavigation;