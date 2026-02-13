import { motion } from "framer-motion";
import { useRef, useState, useEffect, type ReactNode } from "react";

interface IconButtonProps {
	icon: ReactNode;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "default" | "primary";
	className?: string;
}

const ICON_SIZE = 36;
const GAP = 6;
const PAD_RIGHT = 10;

export default function IconButton({
	icon,
	label,
	onClick,
	disabled = false,
	variant = "default",
	className = "",
}: IconButtonProps) {
	const [hovered, setHovered] = useState(false);
	const labelRef = useRef<HTMLSpanElement>(null);
	const [labelWidth, setLabelWidth] = useState(0);

	useEffect(() => {
		if (labelRef.current) {
			setLabelWidth(labelRef.current.scrollWidth);
		}
	}, [label]);

	const expanded = hovered && !disabled;
	const targetWidth = expanded
		? ICON_SIZE + GAP + labelWidth + PAD_RIGHT
		: ICON_SIZE;

	const baseClasses =
		"inline-flex items-center h-9 rounded-full cursor-pointer overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

	const variantClasses =
		variant === "primary"
			? "bg-lime-600 text-white hover:bg-lime-700"
			: "text-gray-700 hover:bg-gray-100";

	const spring = { type: "spring" as const, stiffness: 500, damping: 30 };

	return (
		<motion.button
			className={`${baseClasses} ${variantClasses} ${className}`}
			onClick={onClick}
			disabled={disabled}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setHovered(true)}
			onBlur={() => setHovered(false)}
			title={label}
			animate={{ width: targetWidth }}
			transition={spring}
			style={{ minWidth: ICON_SIZE }}
		>
			<span className="flex-shrink-0 flex items-center justify-center w-9 h-9">
				{icon}
			</span>
			<motion.span
				ref={labelRef}
				className="text-sm font-medium"
				animate={{ opacity: expanded ? 1 : 0 }}
				transition={{ duration: expanded ? 0.15 : 0.1 }}
			>
				{label}
			</motion.span>
		</motion.button>
	);
}
