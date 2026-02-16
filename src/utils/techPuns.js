function markdownPuns() {
	const puns = [
		"Why do programmers prefer dark mode? Because light attracts bugs!",
		"Why was the JavaScript developer sad? Because they didn't know how to 'null' their feelings.",
		"Why do programmers hate nature? It has too many bugs.",
		"Why do programmers prefer using Java? Because they can't C#.",
		"What did the async function say to their love? I Promise I'll await for you!",
		"How do trees access the internet? They log in!",
		"A programmer I once knew decided to quit because they didn't get arrays.",
		"What's the object-oriented way to become wealthy? Inheritance.",
		"Why did the programmer go broke? Because they used up all their cache.",
		"Why was the programmer upset with the tester? The tester was mocking their code.",
	];
	return puns[Math.floor(Math.random() * puns.length)];
}

export default markdownPuns;
