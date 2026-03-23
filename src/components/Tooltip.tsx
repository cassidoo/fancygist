import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, type ReactNode } from "react";

interface TooltipProps {
	label: string;
	children: ReactNode;
	delay?: number;
}

export default function Tooltip({ label, children, delay = 400 }: TooltipProps) {
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [nudge, setNudge] = useState(0);

	const show = () => {
		timeoutRef.current = setTimeout(() => setVisible(true), delay);
	};

	const hide = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setVisible(false);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	useEffect(() => {
		if (visible && tooltipRef.current) {
			const rect = tooltipRef.current.getBoundingClientRect();
			const overflow = rect.right - window.innerWidth + 8;
			if (overflow > 0) {
				setNudge(-overflow);
			} else if (rect.left < 8) {
				setNudge(8 - rect.left);
			} else {
				setNudge(0);
			}
		}
	}, [visible]);

	return (
		<div
			ref={containerRef}
			className="relative inline-flex"
			onMouseEnter={show}
			onMouseLeave={hide}
			onFocus={show}
			onBlur={hide}
		>
			{children}
			<AnimatePresence>
				{visible && (
					<motion.div
						ref={tooltipRef}
						role="tooltip"
						initial={{ opacity: 0, y: -2 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -2 }}
						transition={{ duration: 0.15 }}
						className="absolute top-full left-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
						style={{ transform: `translateX(calc(-50% + ${nudge}px))` }}
					>
						{label}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
