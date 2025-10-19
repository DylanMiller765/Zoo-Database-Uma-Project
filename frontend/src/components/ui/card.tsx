
"use client";

import React from "react";

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
};

export const CardHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={className ?? "p-4 border-b"} {...props}>
			{children}
		</div>
	);
};

export const CardContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={className ?? "p-4"} {...props}>
			{children}
		</div>
	);
};

export const CardTitle = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
	return (
		<h3 className={className} {...props}>
			{children}
		</h3>
	);
};

export default Card;
