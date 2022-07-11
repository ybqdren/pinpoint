import React, { useImperativeHandle, useState, useRef, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';

import { useCaptureKeydown, useOutsideClick } from '../../hooks/interaction';
import { DropdownContent } from './DropdownContent';
import { DropdownTrigger } from './DropdownTrigger';
import DropdownContext from './DropdownContext';

export interface DropdownRef {
  close: () => void;
}

export interface DropdownProps {
  open?: boolean;
  className?: string;
  children?: React.ReactNode[];
  onChange?: ({ open }: { open: boolean }) => void;
  hoverable?: boolean;
}

const Dropdown = React.forwardRef(({
  open: initOpen = false,
  className,
  children,
  onChange,
  hoverable,
}: DropdownProps, ref) => {
  const [ open, setOpen ] = useState(initOpen);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    open && setOpen(false);
  })

  useCaptureKeydown(event => {
    if(event.code === 'Escape') {
      open && setOpen(false);
    }
  })

  useEffect(() => {
    onChange?.({
      open,
    })
  }, [ open, onChange ])

  useImperativeHandle(ref, () => ({
    close() {
      closeContent();
    }
  }))

  function closeContent() {
    setOpen(false);
  }

  function handleMouseEnter() {
    hoverable && setOpen(true);
  }

  function handleMouseLeave() {
    hoverable && setOpen(false);
  }

  return (
    <DropdownContext.Provider value={{ open, setOpen: useMemo(() => setOpen, [ setOpen ]) }}>
      <StyledContainer 
        ref={dropdownRef} 
        className={className} 
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </StyledContainer>
    </DropdownContext.Provider>
  );
});

const StyledContainer = styled.div`
  position: relative;
  z-index: 1000;
`

export default Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
})
