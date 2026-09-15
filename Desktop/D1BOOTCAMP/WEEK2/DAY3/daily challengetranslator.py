import asyncio

from googletrans import Translator

# Initialize the translator
translator = Translator()

french_words = ["Bonjour", "Au revoir", "Bienvenue", "A bientôt"]

async def translate_words():
	# Translate each word, specifying the source and target languages.
	translations = {
		word: (await translator.translate(word, src="fr", dest="en")).text
		for word in french_words
	}
	print(translations)


asyncio.run(translate_words())