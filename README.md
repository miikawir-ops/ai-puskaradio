# AI Puskaradio

Klikattava konseptidemo työntekijöiden tekoälyvinkkien jakamiseen: **jaa, kokeile, arvioi, paranna**.

**Kaikki sisältö on kuvitteellista.** Demo ei ole oikea palvelu, eikä se lähetä tietoja minnekään: tekemäsi muutokset säilyvät vain omassa selaimessasi.

## Rakenne
- `index.html` – koko demo yhtenä tiedostona (CSS, JS ja kuvat upotettuina). Ei build-vaihetta.
- `fonts/` – itse isännöidyt fontit ja niiden lisenssit.
- `tools/browser-check.mjs` – selaintesti (ei julkaista sivustolle).
- `.github/workflows/pages.yml` – julkaisee `index.html`:n ja `fonts/`-kansion GitHub Pagesiin jokaisella pushilla `main`-haaraan.

## Paikallinen käyttö
Avaa `index.html` selaimessa.

## Selaintesti
Vaatii Node 22+ ja Edgen tai Chromen (polun voi antaa ympäristömuuttujalla `BROWSER_PATH`).

```powershell
node tools/browser-check.mjs                      # paikallinen kansio
node tools/browser-check.mjs https://miikawir-ops.github.io/ai-puskaradio/   # live-sivu
```

Käy läpi kaikki näkymät molemmilla ilmeillä työpöytä- (1280 px) ja mobiilileveydellä (390 px). Tarkistaa JS-virheet, vaakasuuntaisen ylivuodon, ulkoiset pyynnöt ja fonttien latautumisen. Kuvakaappaukset tallentuvat oletuksena `%TEMP%\puskaradio-check`-kansioon (tai toisena argumenttina annettuun kansioon).
