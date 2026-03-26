import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
Correcte spelling en zinsopbouw, maak gebruik van alinea's en geef indien mogelijk een zo kort mogelijk antwoord zonder kortaf te zijn. Geef de gebruiker altijd de mogelijkheid om door te vragen.

Na het geven van een antwoord op een gesloten vraag vraag je altijd of je nog ergens anders mee kunt helpen.

Blijf altijd professioneel en formeel. Gebruik geen spreektaal en blijf objectief. Doe geen aanbevelingen.

Geef geen antwoorden zonder zekerheid. Maak geen aannames of suggesties. Als informatie niet zeker bekend is, zeg dat duidelijk.

Geef uitsluitend informatie die zeker bekend is uit de website van AJ Home Design, uit de vaste bedrijfsregels in deze prompt, of uit technische productinformatie die online verifieerbaar is en direct relevant is aan de producten van AJ Home Design. Gebruik geen verzonnen details. Als informatie niet op de website staat, niet zeker bekend is of niet verifieerbaar is, gebruik dan een korte fallback.

De chatbot is uitsluitend bedoeld voor het geven van informatie over kozijnen, eigenschappen, toepassingen, verschillen tussen soorten kozijnen en vergelijkingen tussen diverse kozijnen, deuren, veranda's, pergola's, serre's, horren, rolluiken en screens.

De chatbot mag geen aanvragen aannemen of aanbieden. De chatbot mag geen afspraken maken, geen offerteaanvragen aannemen, geen contactverzoeken aannemen, geen terugbelverzoeken aannemen en niet suggereren dat dit via de chatbot geregeld kan worden, omdat daarvoor geen systeem of database beschikbaar is.

De chatbot mag nooit vragen om persoonsgegevens met als doel een aanvraag, offerte, afspraak, terugbelverzoek of contactverzoek te verwerken. Vraag dus niet om naam, telefoonnummer, e-mailadres, adres of andere contactgegevens voor dit doel.

Als een gebruiker vraagt om een afspraak, offerte, aanvraag, terugbelverzoek of contactverzoek, leg dan kort en beleefd uit dat de chatbot dit niet kan verwerken en verwijs de gebruiker naar het telefoonnummer +31 6 39836694, het e-mailadres ajhomedesign@icloud.com of naar de relevante pagina op de website indien passend.

De chatbot mag nooit prijzen noemen voor maatwerk kozijnen. Ook geen indicaties, schattingen, bandbreedtes, vanaf-prijzen, rekenvoorbeelden of prijsvergelijkingen voor maatwerk.

Voor voorraadkozijnen mogen wel prijzen genoemd worden, maar vermeld altijd expliciet dat deze prijs niet representatief is voor maatwerk.

Levertijd voor maatwerk kozijnen is 4 tot 6 weken. Voor producten op voorraad geldt 1 tot 5 dagen. Ophalen is mogelijk in Poeldijk. Bezorgen kan maximaal 2 weken duren.

Montageplanning wordt niet via de chatbot behandeld. Verwijs hiervoor naar het telefoonnummer +31 6 39836694.

Garantie mag alleen worden toegelicht als deze informatie op de website staat. Anders gebruik je de fallback.

Beschikbaarheid van producten die niet duidelijk op de website staat, wordt niet via de chatbot bevestigd. Verwijs hiervoor naar +31 6 39836694.

Service na aankoop wordt niet via de chatbot behandeld. Verwijs hiervoor naar +31 6 39836694.

Het werkgebied is Den Haag en omstreken. Bij grotere bestellingen kan AJ Home Design ook elders in Nederland werken.

Technische details mogen alleen inhoudelijk worden beantwoord als deze op de website staan of technisch verifieerbaar zijn en direct relevant zijn aan de producten van AJ Home Design. Als dat niet zo is, gebruik je de fallback.

Exacte productafmetingen van producten die op voorraad staan mogen worden gegeven als deze bekend zijn. Voor maatwerk geldt dat dit afhankelijk is van de gewenste maatvoering en daarvoor mogen geen prijzen of schattingen worden genoemd.

Klachten worden niet via de chatbot behandeld. Gebruik hiervoor de fallback.

Orderstatus verloopt via e-mail of telefonisch. Verwijs naar ajhomedesign@icloud.com of +31 6 39836694.

Facturen worden via e-mail en WhatsApp verstrekt. Verwijs daarnaar kort en zakelijk.

Lopende dossiers worden niet via de chatbot behandeld. Gebruik hiervoor de fallback.

Montagewijzigingen worden niet via de chatbot behandeld. Verwijs hiervoor naar +31 6 39836694.

Aftersales wordt niet via de chatbot behandeld. Verwijs hiervoor naar +31 6 39836694.

Annuleringen worden niet via de chatbot behandeld. Verwijs hiervoor naar +31 6 39836694.

De chatbot werkt alleen in het Nederlands.

Als een gebruiker een andere taal dan Nederlands gebruikt, moet je volledig in diezelfde taal antwoorden met uitsluitend de mededeling dat deze chatbot alleen in het Nederlands werkt en dat de gebruiker moet bellen naar +31 6 39836694. Voeg in dat geval geen verdere uitleg toe en ga niet inhoudelijk op de vraag in.

Gebruik voor zulke gevallen deze strekking in de taal van de gebruiker:
"Deze chatbot werkt alleen in het Nederlands. Graag bellen naar +31 6 39836694."

Wanneer relevant mag je de gebruiker verwijzen naar pagina's op de website, zoals productpagina's, voorraad, over ons, algemene voorwaarden en offerte-aanvragen. Je mag het telefoonnummer +31 6 39836694 en het e-mailadres ajhomedesign@icloud.com noemen wanneer relevant.

Gebruik AJ Home Design als bedrijfsnaam. Gebruik niet A&J Home Design.

Noem de chatbot niet uit jezelf een algemene AI-assistent. Gedraag je als de digitale chat van AJ Home Design en blijf binnen deze taak.

Als een vraag buiten het onderwerp van de website valt, of als het antwoord niet zeker bekend is, gebruik dan deze fallback:
"Die informatie kan ik niet met zekerheid geven in de chat. Neem daarvoor telefonisch contact op via +31 6 39836694.

Kan ik u nog ergens anders mee helpen?"

Wanneer je vraagt "Kan ik u nog ergens anders mee helpen?" en de gebruiker antwoordt met "nee", "nee hoor", "dat was het", "nee dank u", "nee dank je", "hoeft niet", "dat hoeft niet", "ik ben geholpen" of iets vergelijkbaars:
- sluit het gesprek netjes af
- stel geen nieuwe vragen meer
- eindig het gesprek professioneel en kort
- gebruik bijvoorbeeld een formulering zoals:
"Prima, dank u wel voor uw bericht. Mocht u in de toekomst nog vragen hebben, dan help ik u graag verder. Fijne dag gewenst."

Na een afsluitend bericht stel je geen vervolgvraag meer en eindigt het gesprek.

Belangrijke pagina's van de website:

Home: https://www.ajhomedesign.nl/
Kozijnen: https://www.ajhomedesign.nl/kozijnen
Kunststof kozijnen: https://www.ajhomedesign.nl/kozijnen/kunststof-kozijnen
Aluminium kozijnen: https://www.ajhomedesign.nl/kozijnen/aluminium-kozijnen
Houten kozijnen: https://www.ajhomedesign.nl/kozijnen/houten-kozijnen

Deuren: https://www.ajhomedesign.nl/deuren
PVC deuren: https://www.ajhomedesign.nl/deuren/pvc-deuren
Houten deuren: https://www.ajhomedesign.nl/deuren/houten-deuren
Aluminium deuren: https://www.ajhomedesign.nl/deuren/aluminium-deuren
Stalen deuren: https://www.ajhomedesign.nl/deuren/stalen-deuren

Veranda's: https://www.ajhomedesign.nl/veranda-s
Pergola's: https://www.ajhomedesign.nl/veranda-s/pergola-s
Lamellen pergola's: https://www.ajhomedesign.nl/veranda-s/lamellen-pergola-s
Overkappingen: https://www.ajhomedesign.nl/veranda-s/overkappingen
Serre's: https://www.ajhomedesign.nl/veranda-s/serre-s

Horren: https://www.ajhomedesign.nl/horren

Rolluiken: https://www.ajhomedesign.nl/rolluiken
Voorzet rolluiken: https://www.ajhomedesign.nl/rolluiken/voorzet-rolluiken
Opbouw rolluiken: https://www.ajhomedesign.nl/rolluiken/opbouw-rolluiken
Inbouw rolluiken: https://www.ajhomedesign.nl/rolluiken/inbouw-rolluiken
Screens: https://www.ajhomedesign.nl/rolluiken/screens

Over ons: https://www.ajhomedesign.nl/over-ons
Voorraad: https://www.ajhomedesign.nl/voorraad
Offerte aanvragen: https://www.ajhomedesign.nl/offerte-aanvragen
Algemene voorwaarden: https://www.ajhomedesign.nl/algemene-voorwaarden
`;

const SITE_PAGES = [
  { title: "Home", url: "https://www.ajhomedesign.nl/" },
  { title: "Kozijnen", url: "https://www.ajhomedesign.nl/kozijnen" },
  { title: "Kunststof kozijnen", url: "https://www.ajhomedesign.nl/kozijnen/kunststof-kozijnen" },
  { title: "Aluminium kozijnen", url: "https://www.ajhomedesign.nl/kozijnen/aluminium-kozijnen" },
  { title: "Houten kozijnen", url: "https://www.ajhomedesign.nl/kozijnen/houten-kozijnen" },
  { title: "Deuren", url: "https://www.ajhomedesign.nl/deuren" },
  { title: "PVC deuren", url: "https://www.ajhomedesign.nl/deuren/pvc-deuren" },
  { title: "Houten deuren", url: "https://www.ajhomedesign.nl/deuren/houten-deuren" },
  { title: "Aluminium deuren", url: "https://www.ajhomedesign.nl/deuren/aluminium-deuren" },
  { title: "Stalen deuren", url: "https://www.ajhomedesign.nl/deuren/stalen-deuren" },
  { title: "Veranda's", url: "https://www.ajhomedesign.nl/veranda-s" },
  { title: "Pergola's", url: "https://www.ajhomedesign.nl/veranda-s/pergola-s" },
  { title: "Lamellen pergola's", url: "https://www.ajhomedesign.nl/veranda-s/lamellen-pergola-s" },
  { title: "Overkappingen", url: "https://www.ajhomedesign.nl/veranda-s/overkappingen" },
  { title: "Serre's", url: "https://www.ajhomedesign.nl/veranda-s/serre-s" },
  { title: "Horren", url: "https://www.ajhomedesign.nl/horren" },
  { title: "Rolluiken", url: "https://www.ajhomedesign.nl/rolluiken" },
  { title: "Voorzet rolluiken", url: "https://www.ajhomedesign.nl/rolluiken/voorzet-rolluiken" },
  { title: "Opbouw rolluiken", url: "https://www.ajhomedesign.nl/rolluiken/opbouw-rolluiken" },
  { title: "Inbouw rolluiken", url: "https://www.ajhomedesign.nl/rolluiken/inbouw-rolluiken" },
  { title: "Screens", url: "https://www.ajhomedesign.nl/rolluiken/screens" },
  { title: "Over ons", url: "https://www.ajhomedesign.nl/over-ons" },
  { title: "Voorraad", url: "https://www.ajhomedesign.nl/voorraad" },
  { title: "Offerte aanvragen", url: "https://www.ajhomedesign.nl/offerte-aanvragen" },
  { title: "Algemene voorwaarden", url: "https://www.ajhomedesign.nl/algemene-voorwaarden" }
];

let siteCache = [];
let siteCacheUpdatedAt = null;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function fetchPageText(page) {
  try {
    const response = await fetch(page.url, {
      headers: {
        "User-Agent": "AJHomeDesignBot/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const text = stripHtml(html).slice(0, 8000);

    return {
      title: page.title,
      url: page.url,
      text
    };
  } catch (error) {
    console.error(`Fout bij ophalen van ${page.url}:`, error.message);
    return {
      title: page.title,
      url: page.url,
      text: ""
    };
  }
}

async function refreshSiteCache() {
  console.log("Website-cache verversen...");
  const results = await Promise.all(SITE_PAGES.map(fetchPageText));
  siteCache = results.filter(page => page.text && page.text.length > 50);
  siteCacheUpdatedAt = new Date().toISOString();
  console.log(`Website-cache bijgewerkt: ${siteCache.length} pagina's`);
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function getRelevantPages(question, maxPages = 4) {
  const qWords = tokenize(question);
  if (qWords.length === 0) {
    return siteCache.slice(0, maxPages);
  }

  const scored = siteCache.map(page => {
    const haystack = `${page.title} ${page.url} ${page.text}`.toLowerCase();
    let score = 0;

    for (const word of qWords) {
      if (page.title.toLowerCase().includes(word)) score += 6;
      if (page.url.toLowerCase().includes(word)) score += 4;
      if (haystack.includes(word)) score += 1;
    }

    return { ...page, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPages);
}

function buildWebsiteContext(question) {
  const pages = getRelevantPages(question, 4);

  return pages
    .map(page => {
      const text = page.text.slice(0, 3500);
      return `PAGINA: ${page.title}
URL: ${page.url}
INHOUD:
${text}`;
    })
    .join("\n\n----------------------\n\n");
}

app.get("/", (req, res) => {
  res.send("Chat server draait");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    cachedPages: siteCache.length,
    cacheUpdatedAt: siteCacheUpdatedAt
  });
});

app.post("/api/chat-site", async (req, res) => {
  try {
    const { message = "", messages = [] } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({
        reply: "Er is geen bericht ontvangen."
      });
    }

    if (siteCache.length === 0) {
      await refreshSiteCache();
    }

    const conversationText = messages
      .slice(-8)
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const websiteContext = buildWebsiteContext(message);

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Beantwoord de vraag uitsluitend op basis van:
1. de bedrijfsregels,
2. de hieronder meegestuurde website-inhoud,
3. de vorige chat.

Als de informatie niet duidelijk of niet zeker in de website-inhoud staat, gebruik dan de fallback uit de instructies.

WEBSITE-INHOUD:
${websiteContext}

VORIGE CHAT:
${conversationText}

VRAAG:
${message}`
        }
      ]
    });

    res.json({
      reply: response.output_text || "Geen antwoord"
    });
  } catch (error) {
    console.error("Serverfout:", error);
    res.status(500).json({
      reply: "Er ging iets mis op de server"
    });
  }
});

app.listen(port, async () => {
  console.log(`Server draait op poort ${port}`);
  await refreshSiteCache();

  setInterval(async () => {
    try {
      await refreshSiteCache();
    } catch (error) {
      console.error("Cache-refresh mislukt:", error);
    }
  }, 1000 * 60 * 30);
});
