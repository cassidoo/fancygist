import { type ReactNode } from "react";
import Tooltip from "./Tooltip";

interface IconButtonProps {
	icon: ReactNode;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "default" | "primary";
	className?: string;
	forceExpanded?: boolean;
}

export default function IconButton({
	icon,
	label,
	onClick,
	disabled = false,
	variant = "default",
	className = "",
}: IconButtonProps) {
	const baseClasses =
		"inline-flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

	const variantClasses =
		variant === "primary"
			? "bg-lime-600 text-white hover:bg-lime-700"
			: "text-gray-700 hover:bg-gray-100";

	return (
		<Tooltip label={label}>
			<button
				className={`${baseClasses} ${variantClasses} ${className}`}
				onClick={onClick}
				disabled={disabled}
				aria-label={label}
			>
				<span className="flex items-center justify-center w-9 h-9">
					{icon}
				</span>
			</button>
		</Tooltip>
	);
}
