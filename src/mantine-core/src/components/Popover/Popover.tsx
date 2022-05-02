/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import { Placement } from '@floating-ui/react-dom-interactions';
import { getFloatingPosition, useId } from '@mantine/utils';
import {
  useMantineTheme,
  ClassNames,
  Styles,
  StylesApiProvider,
  MantineNumberSize,
  MantineShadow,
  getDefaultZIndex,
  useMantineDefaultProps,
} from '@mantine/styles';
import { useClickOutside } from '@mantine/hooks';
import { MantineTransition } from '../Transition';
import { usePopover } from './use-popover';
import { PopoverContextProvider } from './Popover.context';
import {
  PopoverWidth,
  PopoverMiddlewares,
  PopoverStylesNames,
  PopoverStylesParams,
} from './Popover.types';
import { PopoverTarget } from './PopoverTarget/PopoverTarget';
import { PopoverDropdown } from './PopoverDropdown/PopoverDropdown';

export interface PopoverProps {
  /** Popover.Target and Popover.Dropdown components */
  children: React.ReactNode;

  /** Dropdown position relative to target */
  position?: Placement;

  /** Space between target element and dropdown in px */
  offset?: number;

  /** Called when dropdown position changes */
  onPositionChange?(position: Placement): void;

  /** useEffect dependencies to force update tooltip position */
  positionDependencies?: any[];

  /** Initial opened state for uncontrolled component */
  defaultOpened?: boolean;

  /** Controls dropdown opened state */
  opened?: boolean;

  /** Called with current state when dropdown opens or closes */
  onChange?(opened: boolean): void;

  /** Called when dropdown closes */
  onClose?(): void;

  /** Called when dropdown opens */
  onOpen?(): void;

  /** One of premade transitions ot transition object */
  transition?: MantineTransition;

  /** Transition duration in ms */
  transitionDuration?: number;

  /** Dropdown width, or 'target' to make Popover width the same as target element */
  width?: PopoverWidth;

  /** Floating ui middlewares to configure position handling */
  middlewares?: PopoverMiddlewares;

  /** Determines whether component should have an arrow */
  withArrow?: boolean;

  /** Arrow size in px */
  arrowSize?: number;

  /** Arrow offset in px */
  arrowOffset?: number;

  /** Determines whether dropdown should be closed on outside clicks, default to true */
  closeOnClickOutside?: boolean;

  /** Events that trigger outside clicks */
  clickOutsideEvents?: string[];

  /** Determines whether focus should be trapped within dropdown, default to false */
  trapFocus?: boolean;

  /** Determines whether dropdown should be rendered within Portal, defaults to false */
  withinPortal?: boolean;

  /** Dropdown z-index */
  zIndex?: React.CSSProperties['zIndex'];

  /** Radius from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Key of theme.shadow or any other valid css box-shadow value */
  shadow?: MantineShadow;

  /** Determines whether dropdown should be closed when Escape key is pressed, defaults to true */
  closeOnEscape?: boolean;

  /** id base to create accessibility connections */
  id?: string;

  unstyled?: boolean;
  classNames?: ClassNames<PopoverStylesNames>;
  styles?: Styles<PopoverStylesNames, PopoverStylesParams>;
}

const defaultProps: Partial<PopoverProps> = {
  position: 'bottom',
  offset: 8,
  positionDependencies: [],
  transition: 'fade',
  transitionDuration: 150,
  middlewares: { flip: true, shift: true },
  arrowSize: 7,
  arrowOffset: 5,
  closeOnClickOutside: true,
  withinPortal: false,
  closeOnEscape: true,
  clickOutsideEvents: ['mousedown', 'touchstart'],
  zIndex: getDefaultZIndex('popover'),
};

export function Popover(props: PopoverProps) {
  const {
    children,
    position,
    offset,
    onPositionChange,
    positionDependencies,
    opened,
    transition,
    transitionDuration,
    width,
    middlewares,
    withArrow,
    arrowSize,
    arrowOffset,
    unstyled,
    classNames,
    styles,
    closeOnClickOutside,
    withinPortal,
    closeOnEscape,
    clickOutsideEvents,
    trapFocus,
    onClose,
    onOpen,
    onChange,
    zIndex,
    radius,
    shadow,
    id,
    defaultOpened,
  } = useMantineDefaultProps('Popover', defaultProps, props);

  const uid = useId(id);
  const theme = useMantineTheme();
  const popover = usePopover({
    middlewares,
    width,
    position: getFloatingPosition(theme.dir, position),
    offset: offset + (withArrow ? arrowSize / 2 : 0),
    onPositionChange,
    positionDependencies,
    opened,
    defaultOpened,
    onChange,
    onOpen,
    onClose,
  });

  useClickOutside(() => closeOnClickOutside && popover.onClose(), clickOutsideEvents, [
    popover.refs.floating.current,
    popover.refs.reference.current as any,
  ]);

  return (
    <StylesApiProvider classNames={classNames} styles={styles} unstyled={unstyled}>
      <PopoverContextProvider
        value={{
          controlled: popover.controlled,
          reference: popover.reference,
          floating: popover.floating,
          x: popover.x,
          y: popover.y,
          opened: popover.opened,
          transition,
          transitionDuration,
          width,
          withArrow,
          arrowSize,
          arrowOffset,
          placement: popover.placement,
          trapFocus,
          withinPortal,
          zIndex,
          radius,
          shadow,
          closeOnEscape,
          onClose: popover.onClose,
          onToggle: popover.onToggle,
          getTargetId: () => `${uid}-target`,
          getDropdownId: () => `${uid}-dropdown`,
        }}
      >
        {children}
      </PopoverContextProvider>
    </StylesApiProvider>
  );
}

Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;
Popover.displayName = '@mantine/core/Popover';
