import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: "1mb" }))

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

Voorbeelden van gewenste antwoordstijl:

Vraag: "Wat kosten kunststof kozijnen?"
Antwoord: "Voor maatwerk noemen wij geen prijzen in de chat. U kunt hiervoor bellen naar +31 6 39836694."

Vraag: "Hebben jullie voorraad?"
Antwoord: "Ja, op de voorraadpagina vindt u beschikbare producten. Ik kan u daarheen verwijzen."

Vraag: "Kun je een offerte maken?"
Antwoord: "Nee, offerteaanvragen worden niet via de chat verwerkt. U kunt daarvoor de offertepagina gebruiken of bellen naar +31 6 39836694."

Vraag: "Wat is beter, hout of aluminium?"
Antwoord: "Dat hangt af van uw wensen. Ik kan de verschillen kort voor u toelichten."

Vraag: "Wat kost een maatwerk schuifpui van 4 meter?"
Antwoord: "Voor maatwerk geven wij geen prijzen of schattingen in de chat. U kunt hiervoor bellen naar +31 6 39836694."

Vraag: "Kan ik mijn nummer achterlaten?"
Antwoord: "Nee, deze chat verwerkt geen contact- of terugbelverzoeken. U kunt bellen naar +31 6 39836694 of mailen naar ajhomedesign@icloud.com."

Vraag: "Hebben jullie ook screens?"
Antwoord: "Ja, AJ Home Design heeft ook screens. Ik kan u naar de juiste pagina verwijzen."

Vraag: "Wat is de levertijd?"
Antwoord: "Voor maatwerk kozijnen geldt een levertijd van 4 tot 6 weken. Voor producten op voorraad geldt 1 tot 5 dagen."

Vraag: "Do you speak English?"
Antwoord: "This chatbot only works in Dutch. Please call +31 6 39836694."

Vraag: "Ik wil een afspraak maken."
Antwoord: "Afspraken worden niet via deze chat verwerkt. U kunt hiervoor bellen naar +31 6 39836694."
`

const PAGES = [
  {
    label: "Home",
    url: "https://www.ajhomedesign.nl/",
    keywords: ["home", "homepage", "startpagina", "hoofdpagina"]
  },
  {
    label: "Kozijnen",
    url: "https://www.ajhomedesign.nl/kozijnen",
    keywords: ["kozijn", "kozijnen", "raam", "ramen"]
  },
  {
    label: "Kunststof kozijnen",
    url: "https://www.ajhomedesign.nl/kozijnen/kunststof-kozijnen",
    keywords: ["kunststof kozijn", "kunststof kozijnen", "pvc kozijn", "pvc kozijnen"]
  },
  {
    label: "Aluminium kozijnen",
    url: "https://www.ajhomedesign.nl/kozijnen/aluminium-kozijnen",
    keywords: ["aluminium kozijn", "aluminium kozijnen"]
  },
  {
    label: "Houten kozijnen",
    url: "https://www.ajhomedesign.nl/kozijnen/houten-kozijnen",
    keywords: ["houten kozijn", "houten kozijnen", "hout kozijn", "hout kozijnen"]
  },
  {
    label: "Deuren",
    url: "https://www.ajhomedesign.nl/deuren",
    keywords: ["deur", "deuren"]
  },
  {
    label: "PVC deuren",
    url: "https://www.ajhomedesign.nl/deuren/pvc-deuren",
    keywords: ["pvc deur", "pvc deuren", "kunststof deur", "kunststof deuren"]
  },
  {
    label: "Houten deuren",
    url: "https://www.ajhomedesign.nl/deuren/houten-deuren",
    keywords: ["houten deur", "houten deuren", "hout deur", "hout deuren"]
  },
  {
    label: "Aluminium deuren",
    url: "https://www.ajhomedesign.nl/deuren/aluminium-deuren",
    keywords: ["aluminium deur", "aluminium deuren"]
  },
  {
    label: "Stalen deuren",
    url: "https://www.ajhomedesign.nl/deuren/stalen-deuren",
    keywords: ["stalen deur", "stalen deuren", "staal deur", "staal deuren"]
  },
  {
    label: "Veranda's",
    url: "https://www.ajhomedesign.nl/veranda-s",
    keywords: ["veranda", "veranda's", "verandas"]
  },
  {
    label: "Pergola's",
    url: "https://www.ajhomedesign.nl/veranda-s/pergola-s",
    keywords: ["pergola", "pergola's", "pergolas"]
  },
  {
    label: "Lamellen pergola's",
    url: "https://www.ajhomedesign.nl/veranda-s/lamellen-pergola-s",
    keywords: ["lamellen pergola", "lamellen pergola's", "lamellenpergola", "lamellenpergola's"]
  },
  {
    label: "Overkappingen",
    url: "https://www.ajhomedesign.nl/veranda-s/overkappingen",
    keywords: ["overkapping", "overkappingen"]
  },
  {
    label: "Serre's",
    url: "https://www.ajhomedesign.nl/veranda-s/serre-s",
    keywords: ["serre", "serre's", "serres"]
  },
  {
    label: "Horren",
    url: "https://www.ajhomedesign.nl/horren",
    keywords: ["hor", "horren"]
  },
  {
    label: "Rolluiken",
    url: "https://www.ajhomedesign.nl/rolluiken",
    keywords: ["rolluik", "rolluiken"]
  },
  {
    label: "Voorzet rolluiken",
    url: "https://www.ajhomedesign.nl/rolluiken/voorzet-rolluiken",
    keywords: ["voorzet rolluik", "voorzet rolluiken"]
  },
  {
    label: "Opbouw rolluiken",
    url: "https://www.ajhomedesign.nl/rolluiken/opbouw-rolluiken",
    keywords: ["opbouw rolluik", "opbouw rolluiken"]
  },
  {
    label: "Inbouw rolluiken",
    url: "https://www.ajhomedesign.nl/rolluiken/inbouw-rolluiken",
    keywords: ["inbouw rolluik", "inbouw rolluiken"]
  },
  {
    label: "Screens",
    url: "https://www.ajhomedesign.nl/rolluiken/screens",
    keywords: ["screen", "screens", "zonwering screen", "ritsscreen", "ritsscreens"]
  },
  {
    label: "Over ons",
    url: "https://www.ajhomedesign.nl/over-ons",
    keywords: ["over ons", "bedrijf", "wie zijn jullie", "informatie over jullie"]
  },
  {
    label: "Voorraad",
    url: "https://www.ajhomedesign.nl/voorraad",
    keywords: ["voorraad", "actuele voorraad", "beschikbaar", "beschikbaarheid", "aanbod", "assortiment", "op voorraad"]
  },
  {
    label: "Offerte aanvragen",
    url: "https://www.ajhomedesign.nl/offerte-aanvragen",
    keywords: ["offerte", "offerte aanvragen", "prijsaanvraag", "aanvraag"]
  },
  {
    label: "Algemene voorwaarden",
    url: "https://www.ajhomedesign.nl/algemene-voorwaarden",
    keywords: ["algemene voorwaarden", "voorwaarden"]
  }
]

function normalizeText(text = "") {
  return text.toLowerCase().trim()
}

function findRelevantPages(message = "", messages = []) {
  const historyText = messages
    .slice(-6)
    .map(m => m.content || "")
    .join(" ")

  const fullText = normalizeText(`${message} ${historyText}`)
  const matches = []

  for (const page of PAGES) {
    const score = page.keywords.reduce((total, keyword) => {
      return fullText.includes(keyword.toLowerCase()) ? total + keyword.length : total
    }, 0)

    if (score > 0) {
      matches.push({ ...page, score })
    }
  }

  matches.sort((a, b) => b.score - a.score)

  if (matches.length === 0) {
    return [PAGES[0]]
  }

  return matches.slice(0, 2)
}

function cleanHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, `"`)
    .replace(/&#39;/gi, `'`)
    .replace(/\n\s*\n+/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function limitText(text = "", maxLength = 6000) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

async function fetchPageContent(page) {
  try {
    const response = await fetch(page.url, {
      headers: {
        "User-Agent": "AJHomeDesignBot/1.0"
      }
    })

    if (!response.ok) {
      return {
        label: page.label,
        url: page.url,
        content: ""
      }
    }

    const html = await response.text()
    const cleaned = limitText(cleanHtml(html))

    return {
      label: page.label,
      url: page.url,
      content: cleaned
    }
  } catch (error) {
    console.error(`Kon pagina niet ophalen: ${page.url}`, error.message)
    return {
      label: page.label,
      url: page.url,
      content: ""
    }
  }
}

app.get("/", (req, res) => {
  res.send("Chat server draait")
})

app.post("/api/chat-site", async (req, res) => {
  try {
    const {
      message = "",
      messages = []
    } = req.body || {}

    const conversationText = messages
      .slice(-10)
      .map(m => `${m.role}: ${m.content}`)
      .join("\n")

    const relevantPages = findRelevantPages(message, messages)
    const fetchedPages = await Promise.all(relevantPages.map(fetchPageContent))

    const siteContext = fetchedPages
      .filter(page => page.content)
      .map(page => {
        return `PAGINA: ${page.label}
URL: ${page.url}
INHOUD:
${page.content}`
      })
      .join("\n\n--------------------\n\n")

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Gebruik onderstaande website-inhoud als primaire bron.

RELEVANTE WEBSITE-INHOUD:
${siteContext || "Geen website-inhoud beschikbaar."}

VORIGE CHAT:
${conversationText}

VRAAG:
${message}`
        }
      ]
    })

    res.json({
      reply: response.output_text || "Geen antwoord"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      reply: "Er ging iets mis op de server"
    })
  }
})

app.listen(port, () => {
  console.log(\`Server draait op poort \${port}\`)
})
