import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	trigger: ReactNode;
	children: ReactNode;
	panelClassName: string;
	containerClassName?: string;
	panelPositionClassName?: string;
	panelOriginClassName?: string;
}

const SPRING = {
	type: "spring" as const,
	stiffness: 500,
	damping: 30,
};

export default function Dropdown({
	isOpen,
	onClose,
	trigger,
	children,
	panelClassName,
	containerClassName = "",
	panelPositionClassName = "sm:right-0 sm:mt-2",
	panelOriginClassName = "origin-top sm:origin-top-right",
}: DropdownProps) {
	return (
		<div className={`relative ${containerClassName}`}>
			{trigger}
			{isOpen && <div className="fixed inset-0 z-10" onClick={onClose} />}
			<div
				className={`fixed left-1/2 top-16 z-20 w-[calc(100vw-2rem)] -translate-x-1/2 sm:absolute sm:left-auto sm:top-auto sm:w-auto sm:translate-x-0 ${panelPositionClassName}`}
				style={{ perspective: 600 }}
			>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className={`${panelOriginClassName} ${panelClassName}`}
							initial={{ scale: 0.7, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.7, opacity: 0 }}
							transition={SPRING}
						>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
