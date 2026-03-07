import { gemoji } from "gemoji";

export interface EmojiOption {
	alias: string;
	emoji: string;
	description: string;
	searchTokens: string[];
}

const emojiByAlias = new Map<string, EmojiOption>();

for (const item of gemoji) {
	const searchTokens = [...item.names, ...item.tags, item.description]
		.map((token) => token.toLowerCase())
		.filter(Boolean);

	for (const alias of item.names) {
		if (!emojiByAlias.has(alias)) {
			emojiByAlias.set(alias, {
				alias,
				emoji: item.emoji,
				description: item.description,
				searchTokens,
			});
		}
	}
}

const emojiOptions = Array.from(emojiByAlias.values()).sort((a, b) =>
	a.alias.localeCompare(b.alias),
);

export function searchEmojiOptions(query: string, limit = 20): EmojiOption[] {
	const normalized = query.trim().toLowerCase();

	if (!normalized) {
		return emojiOptions.slice(0, limit);
	}

	return emojiOptions
		.filter(
			(option) =>
				option.alias.includes(normalized) ||
				option.searchTokens.some((token) => token.includes(normalized)),
		)
		.slice(0, limit);
}
