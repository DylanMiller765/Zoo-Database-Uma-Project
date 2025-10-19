
"use client";

import React from "react";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
	asChild?: boolean;
	variant?: string;
};

export const Button = ({ asChild, children, ...props }: ButtonProps) => {
	// If asChild is true and children is a valid React element, clone it with the props.
	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement, props as any);
	}

	return (
		<button {...(props as any)}>
			{children}
		</button>
	);
};

export default Button;
