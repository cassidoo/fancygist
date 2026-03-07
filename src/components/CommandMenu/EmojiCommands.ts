import { searchEmojiOptions } from "../../utils/emoji";
import type { SlashCommand } from "./SlashCommands";

export function getEmojiCommands(searchQuery: string): SlashCommand[] {
	return searchEmojiOptions(searchQuery).map((option) => ({
		label: `:${option.alias}:`,
		description: `${option.emoji} ${option.description}`,
		content: `:${option.alias}:`,
		inline: true,
	}));
}
