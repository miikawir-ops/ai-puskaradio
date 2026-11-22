# AI Puskaradio – projektin säännöt

Nämä säännöt täydentävät globaaleja sääntöjä (`~/.claude/CLAUDE.md`). Siltä osin kuin tämä tiedosto on tarkempi, se voittaa.

## Mikä tämä on
- Klikattava **konseptidemo** työntekijöiden tekoälyvinkkien jakamiseen: **jaa, kokeile, arvioi, paranna**.
- Ei oikea palvelu. Oikea MVP tehdään myöhemmin organisaation M365 / Copilot Studio -ympäristöön.
- Julkaistaan GitHub Pagesissa (julkinen repo, GitHub Actions -workflow `.github/workflows/pages.yml`, julkaisee `index.html`:n ja `fonts/`-kansion jokaisella pushilla `main`-haaraan).

## Sisältö
- **Organisaation (Vero) saa mainita** nimeltä.
- **Henkilöt, tiimit ja vinkit ovat keksittyjä.** Ei oikeita henkilöitä eikä asiakkaita, eikä organisaation sisäisiä tietoja (lukuja, järjestelmiä, dokumentteja).
- **Yksiköistä käytetään vain nimiä Yksikkö 1, Yksikkö 2 jne.** (sekä "Oma yksikkö" / "Oma yksikkösi" katsojan omalle yksikölle). Ei keksittyjä eikä oikeita yksikkönimiä.
- Repo on julkinen: kaikki mitä committaat, on heti julkista.

## Tekninen rakenne
- **Sivusto = `index.html` + `fonts/`.** `index.html` sisältää CSS:n, JS:n ja kuvat upotettuina (kuvat base64-data-URI:na). Ei build-vaihetta, ei riippuvuuksia, ei npm:ää.
- **Ei ulkoisia latauksia** (ei CDN:iä, ei Google Fontsia, ei analytiikkaa). Fontit isännöidään itse kansiossa `fonts/` (woff2, osajoukot latin + latin-ext, `@font-face` index.html:n `<style>`-osiossa). Lisenssit: `fonts/LICENSES.md` ja `fonts/licenses/`. Uuden fontin saa lisätä vain, jos sen lisenssi sallii uudelleenjakelun ja lisenssiteksti lisätään samalla.
- Workflow julkaisee vain `index.html`:n ja `fonts/`-kansion; muut repon tiedostot (CLAUDE.md, README) eivät näy sivustolla.
- **Käyttöliittymä suomeksi.**
- **Tila vain katsojan selaimessa**: `localStorage`, jokainen luku ja kirjoitus `try/catch`-suojattuna. Sivun pitää toimia myös, kun tallennus on estetty. Ei palvelinta, ei analytiikkaa, ei evästeitä.
- Tallennusavain `ai-puskaradio-demo-v1`. Jos tallennetun tilan rakenne muuttuu yhteensopimattomasti, nosta versionumeroa.

## Ilme
- Oletuksena **Neon 86**: 80-luvun Miami-estetiikka, **25.5 FM** -radioteema (neonvalot, auringonlasku, palmut).
- Käyttäjä voi vaihtaa **asialliseen ilmeeseen**; molempien ilmeiden pitää toimia ja täyttää saavutettavuusvaatimukset.
- **Ilmettä ei tummenneta.** Korostukset tehdään vaaleammilla sävyillä (esim. vaaleampi tausta tai neonkehys), ei tummentamalla.
- **EI** pelien tai elokuvien logoja, fontteja, hahmoja tai tunnistettavia fraaseja.
- **EI** rikos- tai poliisiteemaa (esim. poliisiautoja, -helikoptereita, aseita, rikoskuvastoa).

## Periaatteet (eivät jousta)
- **Jakaminen on aina turvallista.**
- **Arviot ovat nimettömiä** ja näkyvät jakajalle **vain koosteena**.
- **Heikko vinkki ei saa negatiivista merkintää**: se pitää neutraalin statuksen ja jää vain järjestyksessä taka-alalle. Vanhentunut-status tulee työkalun muuttumisesta, yli 6 kuukauden tauosta kokeiluissa tai useamman käyttäjän ilmoituksesta, ei koskaan heikoista arvioista.
- **Pisteitä ei voi menettää.**
- **Yksilöiden pisteet näkyvät vain itselle** (Oma Puskaradio). Julkisilla listoilla näkyy vain kärki ja oma sijoitus; kukaan ei jää julkisesti häntäpäähän, ja nimen voi piilottaa.

## Kannustimet, feed ja nimettömyys
- **Puskaradio-feed kertoo vain myönteisiä tapahtumia** (jako, kokeilu, parannus, tasonnousu, status, kisan kärki). **Kokeilun tulosta ei kerrota koskaan** (ei "toimi" / "ei toiminut"); tulokset näkyvät vain koosteina (status, taso, kausimerkki).
- Nimensä piilottaneet näkyvät feedissä **nimettöminä** ("Nimetön kollega"). Käyttäjän omat toiminnot lisätään feediin heti.
- Feedissä ja muualla **ei pelien tai elokuvien tunnistettavia fraaseja**. Neon-ilmeessä feed on radiojuontajan sävyinen, asiallisessa ilmeessä hillitty.
- **Hyödyllinen kommentti:** vain jakaja voi merkitä oman vinkkinsä kommentin hyödylliseksi; kommentoija saa +2 kerran per kommentti. Nimettömän kommentoijan henkilöllisyys ei paljastu jakajalle.
- **Kiitos kokeilijoille:** ei pisteitä, menee kaikille kokeilijoille paljastamatta heitä jakajalle.
- **Ensimmäinen vinkki:** kertaluonteinen merkki ja +5, ei koskaan toista kertaa.
- **Jatkuva kunnia:** parannetun version kokeilusta ketjun alkuperäinen tekijä saa +1.

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
- **Ulkoasumuutokset tarkistetaan ennen pushia** skriptillä `node tools/browser-check.mjs` (työpöytä 1280 px ja mobiili 390 px, molemmat ilmeet) ja katsomalla kuvakaappaukset. Tehtäväkohtaiset tarkistukset tehdään saman skriptin `withPage`-apufunktiolla. Pushin jälkeen sama ajo live-osoitteeseen.
- Muut globaalit säännöt pätevät edelleen: näytä koko tiedosto ennen muokkausta, tarkista toimivuus ennen kuin sanot valmiiksi, ja varmista pushin jälkeen, että Actions-ajo on vihreä ja live-sivu vastaa.
- Commit-viestit englanniksi muodossa `type: what changed`.
