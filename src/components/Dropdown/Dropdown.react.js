// @flow

import * as React from "react";
import cn from "classnames";
import DropdownTrigger from "./DropdownTrigger.react";
import DropdownMenu from "./DropdownMenu.react";
import DropdownItem from "./DropdownItem.react";
import DropdownItemDivider from "./DropdownItemDivider.react";

import { Manager, Reference, Popper } from "react-popper";

import type {
  PopperChildrenProps,
  Placement,
  ReferenceChildrenProps,
} from "react-popper";

type DefaultProps = {|
  +children?: React.Node,
  +className?: string,
  /**
   * This dropdown should only be displayed on desktop
   */
  +desktopOnly?: boolean,
  /**
   * The trigger component for this Dropdown
   */
  +trigger?: React.Node,
  /**
   * Is this Dropdown a Card option?
   */
  +isOption?: boolean,
|};

type WithAnyTriggerProps = {|
  ...DefaultProps,
  /**
   * Any additional classNames for the trigger component
   */
  +triggerClassName?: string,
  /**
   * Is this Dropdown being used as a Nav Link?
   */
  +isNavLink?: boolean,
  /**
   * Should the trigger render a link or a buttton
   */
  +type?: "link" | "button",
  /**
   * An Icon to be displayed within the trigger
   */
  +icon?: string,
  /**
   * The trigger content
   */
  +triggerContent?: React.Node,
  /**
   * The triggers background color
   */
  +color?: string,
  /**
   * Should the trigger display an arrow toggler?
   */
  +toggle?: boolean,
|};

type WithTriggerContentProps = {|
  ...WithAnyTriggerProps,
  /**
   * The trigger content
   */
  +triggerContent: React.Node,
|};

type WithIconProps = {|
  ...WithAnyTriggerProps,
  /**
   * For a trigger to contain only an Icon
   */
  +icon: string,
|};

type AllTriggerProps = WithTriggerContentProps | WithIconProps;

type WithItemsProps = {|
  ...DefaultProps,
  ...WithAnyTriggerProps,
  +triggerContent?: React.Node,
  +items: React.Node,
  +dropdownMenuClassName?: string,
  /**
   * The DropdownMenu position
   */
  +position?: Placement,
  /**
   * Display an arrow between the trigger and menu?
   */
  +arrow?: boolean,
  /**
   * The position of the arrow between the trigger and menu
   */
  +arrowPosition?: "left" | "right",
|};

type WithItemsObjectProp = {|
  ...DefaultProps,
  ...WithAnyTriggerProps,
  /**
   * The items for this Dropdowns menu
   */
  +items?: React.Node,
  /**
   * The items for this Dropdowns menu in object form
   */
  +itemsObject: Array<{
    +icon?: string,
    +badge?: string,
    +badgeType?: string,
    +value?: string,
    +isDivider?: boolean,
    +to?: string,
    +RootComponent?: React.ElementType,
  }>,
  /**
   * Any additional classNames for the DropdownMenu
   */
  +dropdownMenuClassName?: string,
  +position?: Placement,
  +arrow?: boolean,
  +arrowPosition?: "left" | "right",
|};

type Props =
  | DefaultProps
  | AllTriggerProps
  | WithItemsProps
  | WithItemsObjectProp;

type State = {
  isOpen: boolean,
};

class Dropdown extends React.Component<Props, State> {
  state = { isOpen: false };

  static Trigger = DropdownTrigger;
  static Menu = DropdownMenu;
  static Item = DropdownItem;
  static ItemDivider = DropdownItemDivider;

  _handleTriggerOnClick = (e: SyntheticMouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState(s => ({ isOpen: !s.isOpen }));
  };

  render(): React.Node {
    const { className, children, desktopOnly, isOption }: Props = this.props;

    const classes = cn(
      {
        dropdown: true,
        "d-none": desktopOnly,
        "d-md-flex": desktopOnly,
        "card-options-dropdown": isOption,
        show: this.state.isOpen,
      },
      className
    );

    const trigger = (() => {
      if (this.props.trigger) return this.props.trigger;
      if (this.props.icon || this.props.triggerContent || this.props.toggle) {
        const {
          icon,
          triggerContent,
          isNavLink,
          type,
          triggerClassName,
          color,
          toggle,
        } = this.props;

        return (
          <Reference>
            {({ ref }: ReferenceChildrenProps) => (
              <DropdownTrigger
                rootRef={ref}
                isNavLink={isNavLink}
                icon={icon}
                type={type}
                className={triggerClassName}
                isOption={isOption}
                color={color}
                toggle={toggle}
                onClick={this._handleTriggerOnClick}
              >
                {triggerContent}
              </DropdownTrigger>
            )}
          </Reference>
        );
      }
      return null;
    })();

    const items = (() => {
      if (this.props.items) return this.props.items;
      if (this.props.itemsObject) {
        return this.props.itemsObject.map(
          (item, i) =>
            item.isDivider ? (
              <Dropdown.ItemDivider key={i} />
            ) : (
              <Dropdown.Item
                icon={item.icon}
                badge={item.badge}
                badgeType={item.badgeType}
                value={item.value}
                key={i}
                to={item.to}
                RootComponent={item.RootComponent}
              />
            )
        );
      }
      return null;
    })();

    const menu = (() => {
      if (this.props.items || this.props.itemsObject) {
        const {
          position,
          arrow,
          arrowPosition,
          dropdownMenuClassName,
        } = this.props;
        return (
          <Popper
            placement={position}
            eventsEnabled={true}
            positionFixed={false}
          >
            {({
              ref,
              style,
              placement,
              arrowProps,
              scheduleUpdate,
            }: PopperChildrenProps) => {
              scheduleUpdate();
              return (
                <DropdownMenu
                  position={placement}
                  arrow={arrow}
                  arrowPosition={arrowPosition}
                  className={dropdownMenuClassName}
                  rootRef={ref}
                  style={style}
                  show={this.state.isOpen}
                >
                  {items}
                </DropdownMenu>
              );
            }}
          </Popper>
        );
      }
      return null;
    })();

    return (
      <Manager>
        <div className={classes}>
          {trigger}
          {menu || children}
        </div>
      </Manager>
    );
  }
}

export default Dropdown;
