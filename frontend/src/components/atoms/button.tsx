import { PropsWithChildren } from "react";
import { Button as DaisyButton, ButtonProps } from "react-daisyui";
import style from "./button.module.css";
export const Button = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const className = ` ${style.button} ${props.className}`;
  props.className = className;
  return <DaisyButton {...props}>{children}</DaisyButton>;
};
