# AI Puskaradio – projektin säännöt

Nämä säännöt täydentävät globaaleja sääntöjä (`~/.claude/CLAUDE.md`). Siltä osin kuin tämä tiedosto on tarkempi, se voittaa.

## Mikä tämä on
- Klikattava **konseptidemo** työntekijöiden tekoälyvinkkien jakamiseen: **jaa, kokeile, arvioi, paranna**.
- Ei oikea palvelu. Oikea MVP tehdään myöhemmin organisaation M365 / Copilot Studio -ympäristöön.
- Julkaistaan GitHub Pagesissa (julkinen repo, GitHub Actions -workflow `.github/workflows/pages.yml`, julkaisee juurikansion jokaisella pushilla `main`-haaraan).

## Sisältö
- **Kaikki sisältö on kuvitteellista**: ei oikeita henkilöitä, asiakkaita eikä organisaation tietoja (ei sisäisiä nimiä, lukuja, järjestelmiä tai dokumentteja).
- Repo on julkinen: kaikki mitä committaat, on heti julkista.

## Tekninen rakenne
- **Yksi itsenäinen `index.html`**: CSS, JS ja kuvat upotettuina (kuvat base64-data-URI:na). Ei build-vaihetta, ei riippuvuuksia, ei npm:ää.
- Ainoa ulkoinen lataus on Google Fonts -tyylitiedosto; jokaisella fontilla on järjestelmäfontti varalla, joten sivu toimii ilman sitä.
- **Käyttöliittymä suomeksi.**
- **Tila vain katsojan selaimessa**: `localStorage`, jokainen luku ja kirjoitus `try/catch`-suojattuna. Sivun pitää toimia myös, kun tallennus on estetty. Ei palvelinta, ei analytiikkaa, ei evästeitä.
- Tallennusavain `ai-puskaradio-demo-v1`. Jos tallennetun tilan rakenne muuttuu yhteensopimattomasti, nosta versionumeroa.

## Ilme
- Oletuksena **Neon 86**: 80-luvun Miami-estetiikka, **25.5 FM** -radioteema (neonvalot, auringonlasku, palmut).
- Käyttäjä voi vaihtaa **asialliseen ilmeeseen**; molempien ilmeiden pitää toimia ja täyttää saavutettavuusvaatimukset.
- **EI** pelien tai elokuvien logoja, fontteja, hahmoja tai tunnistettavia fraaseja.
- **EI** rikos- tai poliisiteemaa (esim. poliisiautoja, -helikoptereita, aseita, rikoskuvastoa).

## Periaatteet (eivät jousta)
- **Jakaminen on aina turvallista.**
- **Arviot ovat nimettömiä** ja näkyvät jakajalle **vain koosteena**.
- **Heikko vinkki ei saa negatiivista merkintää**: se pitää neutraalin statuksen ja jää vain järjestyksessä taka-alalle. Vanhentunut-status tulee vain työkalun muuttumisesta, ei koskaan heikoista arvioista.
- **Pisteitä ei voi menettää.**
- **Yksilöiden pisteet näkyvät vain itselle** (Oma Puskaradio). Julkisilla listoilla näkyy vain kärki ja oma sijoitus; kukaan ei jää julkisesti häntäpäähän, ja nimen voi piilottaa.

## Tasonimet
Rookie → Tekijä → Velho → Mestari → Final boss

## Saavutettavuus: WCAG 2.1 AA
- Status ja tila myös **tekstinä**, ei pelkkänä värinä tai ikonina.
- Kaikki toimii **näppäimistöllä**; näkyvä fokus; modaalit sulkeutuvat Escillä ja palauttavat fokuksen.
- **Kontrastit** AA-tasolla molemmissa ilmeissä.
- **Liikkeen voi pysäyttää** (esim. ticker), ja `prefers-reduced-motion` poistaa animaatiot.

## Työtapa
- **Committaa ja pushaa muutokset suoraan `main`-haaraan**, jotta ne näkyvät heti livenä.
- Tämä on tarkoituksellinen poikkeus globaaleista säännöistä (hyväksyntä ennen committia ulkoasu-, teksti- ja live-muutoksille): **tämän projektin sääntö ohittaa ne, koska demo sisältää vain kuvitteellista sisältöä.**
- Muut globaalit säännöt pätevät edelleen: näytä koko tiedosto ennen muokkausta, tarkista toimivuus ennen kuin sanot valmiiksi, ja varmista pushin jälkeen, että Actions-ajo on vihreä ja live-sivu vastaa.
- Commit-viestit englanniksi muodossa `type: what changed`.
