import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeCallouts from "rehype-callouts";
import rehypeHighlight from "rehype-highlight";
import { Link as LinkIcon } from "lucide-react";
import {
	isValidElement,
	useEffect,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from "react";
import "highlight.js/styles/rose-pine-dawn.css";
// @ts-ignore
import markdownPuns from "../utils/techPuns";

interface MarkdownPreviewProps {
	content: string;
}

const sanitizeSchema = {
	...defaultSchema,
	tagNames: [
		...(defaultSchema.tagNames ?? []),
		"sub",
		"sup",
		"kbd",
		"ins",
		"br",
		"hr",
	],
};

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

function headingText(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node))
		return node.map((child) => headingText(child)).join("");
	if (isValidElement<{ children?: ReactNode }>(node)) {
		return headingText(node.props.children);
	}
	return "";
}

function toHeadingId(children: ReactNode): string {
	return headingText(children)
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-");
}

function mergeClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

function Heading({
	as: Tag,
	children,
	className,
	...props
}: { as: HeadingTag; children?: ReactNode } & ComponentPropsWithoutRef<"h1">) {
	const id = toHeadingId(children);
	const href = `#${id}`;

	const handleCopyHeadingLink: ComponentPropsWithoutRef<"a">["onClick"] =
		async (event) => {
			event.preventDefault();

			if (typeof window === "undefined") return;
			const url = new URL(window.location.href);
			url.hash = id;

			if (navigator.clipboard) {
				await navigator.clipboard.writeText(url.toString());
			}

			window.history.replaceState(null, "", href);
		};

	return (
		<Tag
			id={id}
			className={mergeClassNames("group relative -ml-6 pl-6", className)}
			{...props}
		>
			<a
				href={href}
				onClick={handleCopyHeadingLink}
				aria-label={`Copy link to heading: ${headingText(children)}`}
				className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 opacity-0 transition-opacity hover:text-gray-800 focus-visible:opacity-100 group-hover:opacity-100"
			>
				<LinkIcon size={14} aria-hidden="true" />
			</a>
			{children}
		</Tag>
	);
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
	useEffect(() => {
		if (typeof window === "undefined") return;

		const scrollToHash = () => {
			const hash = window.location.hash.slice(1);
			if (!hash) return;

			const target = document.getElementById(decodeURIComponent(hash));
			if (target) {
				target.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		};

		const frame = window.requestAnimationFrame(scrollToHash);
		window.addEventListener("hashchange", scrollToHash);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("hashchange", scrollToHash);
		};
	}, [content]);

	return (
		<div className="h-full overflow-auto bg-white">
			<article className="markdown-preview prose prose-sm max-w-3xl mx-auto px-6 py-16">
				<ReactMarkdown
					remarkPlugins={[remarkGfm, remarkGemoji]}
					rehypePlugins={[
						rehypeRaw,
						[rehypeSanitize, sanitizeSchema],
						[rehypeHighlight, { detect: true, ignoreMissing: true }],
						rehypeCallouts,
					]}
					components={{
						h1: ({ children, ...props }) => (
							<Heading as="h1" {...props}>
								{children}
							</Heading>
						),
						h2: ({ children, ...props }) => (
							<Heading as="h2" {...props}>
								{children}
							</Heading>
						),
						h3: ({ children, ...props }) => (
							<Heading as="h3" {...props}>
								{children}
							</Heading>
						),
						h4: ({ children, ...props }) => (
							<Heading as="h4" {...props}>
								{children}
							</Heading>
						),
						h5: ({ children, ...props }) => (
							<Heading as="h5" {...props}>
								{children}
							</Heading>
						),
						h6: ({ children, ...props }) => (
							<Heading as="h6" {...props}>
								{children}
							</Heading>
						),
					}}
				>
					{content || `**Nothing here yet!**\n\n${markdownPuns()}`}
				</ReactMarkdown>
			</article>
		</div>
	);
}
