/**
 * Static city data for local landing pages.
 *
 * Each entry contains SEO copy and local context that is unique per city.
 * Adding a new city is as simple as adding an entry to this array.
 */

export interface StadLandingData {
  /** URL-safe slug, e.g. "amsterdam" */
  slug: string;
  /** Display name, e.g. "Amsterdam" */
  naam: string;
  /** Province slug matching the `provincies` table */
  provincieSlug: string;
  /** Province display name */
  provincieNaam: string;
  /** Population (approximate, for display) */
  inwoners: number;
  /** Meta title (max ~60 chars) */
  metaTitle: string;
  /** Meta description (max ~155 chars) */
  metaDescription: string;
  /** H1 heading */
  h1: string;
  /** Intro paragraph below the H1 */
  intro: string;
  /** Local context: oil tank-related facts about this city/region */
  lokaleContext: string;
  /** Local context: municipality-specific regulations or tips */
  gemeenteInfo: string;
  /** FAQ items specific to this city */
  faq: { vraag: string; antwoord: string }[];
  /** Nearby city slugs for internal linking */
  nabijeStedenSlugs: string[];
}

export const STEDEN: StadLandingData[] = [
  {
    slug: "amsterdam",
    naam: "Amsterdam",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 921000,
    metaTitle: "Olietankverwijdering Amsterdam - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Amsterdam. Vergelijk BRL SIKB 7000 bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Amsterdam",
    intro:
      "Amsterdam telt duizenden panden van voor 1994 waar een olietank in de grond kan zitten. Van grachtenpanden tot naoorlogse flats in Nieuw-West en Noord: overal kan olietanks voorkomen in dakbeschot, vloertegels of isolatiemateriaal. Vergelijk hieronder gecertificeerde olietankverwijderaars die actief zijn in Amsterdam en omgeving.",
    lokaleContext:
      "De gemeente Amsterdam heeft speciale regels voor olietankverwijdering bij monumentale panden. Bij verbouwingen van panden gebouwd voor 1994 is een bodemonderzoek verplicht. Vooral in wijken als De Pijp, Oud-West en Amsterdam-Noord zijn veel woningen uit de risicoperiode (1950-1985). Het stadsdeel heeft een meldpunt voor olietankvondsten.",
    gemeenteInfo:
      "Bij de gemeente Amsterdam kun je terecht bij het Omgevingsloket voor vergunningaanvragen rondom olietankverwijdering. Voor sloop- of verbouwprojecten waarbij een olietank wordt verwijderd, is een sloopmelding via het Omgevingsloket verplicht. De melding moet minimaal 4 weken voor aanvang worden ingediend.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Amsterdam?",
        antwoord:
          "De kosten voor olietankverwijdering in Amsterdam liggen gemiddeld tussen de 15 en 40 euro per m2, afhankelijk van het type olietank en de bereikbaarheid. Door de hogere parkeer- en logistieke kosten in de binnenstad kunnen prijzen iets hoger uitvallen dan in de regio.",
      },
      {
        vraag: "Heb ik een vergunning nodig voor olietankverwijdering in Amsterdam?",
        antwoord:
          "Voor olietankverwijdering zelf heb je geen vergunning nodig, maar wel een sloopmelding via het Omgevingsloket van de gemeente Amsterdam. Deze moet minimaal 4 weken van tevoren worden ingediend. Bij monumentale panden gelden aanvullende regels.",
      },
      {
        vraag: "Waar kan ik een olietank laten afvoeren in Amsterdam?",
        antwoord:
          "Particulieren kunnen kleine hoeveelheden (niet-hechtgebonden) afval gratis inleveren bij het Afvalbrengstation van de gemeente Amsterdam. Voor grotere hoeveelheden of bovengrondse olietank is een gecertificeerd bedrijf verplicht.",
      },
    ],
    nabijeStedenSlugs: ["haarlem", "zaanstad", "almere", "haarlemmermeer", "amstelveen", "hilversum", "purmerend"],
  },
  {
    slug: "rotterdam",
    naam: "Rotterdam",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 656000,
    metaTitle: "Olietankverwijdering Rotterdam - Gecertificeerde bedrijven",
    metaDescription:
      "Vergelijk gecertificeerde olietankverwijderaars in Rotterdam. Bekijk reviews, certificeringen en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Rotterdam",
    intro:
      "Rotterdam is na het bombardement van 1940 grotendeels herbouwd in de naoorlogse periode, precies de tijd waarin olietanks op grote schaal werden geplaatst. Veel woningen in wijken als Kralingen, Hillegersberg en Rotterdam-Zuid bevatten olietankhoudende materialen. Vergelijk hieronder gecertificeerde olietankverwijderaars in Rotterdam.",
    lokaleContext:
      "Door de grote wederopbouw na WOII bevat Rotterdam relatief veel olietankhoudende bebouwing uit de jaren '50 tot '80. Vooral in sociale huurwoningen en utiliteitsgebouwen komt olietanks veelvuldig voor. De gemeente Rotterdam heeft een actief olietankbeleid en werkt samen met woningcorporaties aan sanering.",
    gemeenteInfo:
      "De gemeente Rotterdam verwerkt sloopmelding via het landelijke Omgevingsloket. Voor woningen van voor 1994 is bij verbouwing of sloop altijd een bodemonderzoek nodig. Rotterdam heeft meerdere erkende afvalpunten waar particulieren klein olietankafval kunnen inleveren.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Rotterdam?",
        antwoord:
          "In Rotterdam liggen de kosten voor olietankverwijdering tussen de 12 en 35 euro per m2. De prijs hangt af van het type materiaal, de hoeveelheid en de bereikbaarheid. Vraag altijd meerdere offertes aan om te vergelijken.",
      },
      {
        vraag: "Zijn er veel woningen met olietanks in Rotterdam?",
        antwoord:
          "Ja, Rotterdam heeft relatief veel woningen uit de wederopbouwperiode (1945-1985) waar olietanks aanwezig kunnen zijn. Denk aan dakplaten, gevelplaten, vloertegels en isolatiemateriaal. Bij twijfel is een bodemonderzoek aan te raden.",
      },
    ],
    nabijeStedenSlugs: ["den-haag", "breda", "leiden", "schiedam", "dordrecht", "delft"],
  },
  {
    slug: "den-haag",
    naam: "Den Haag",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 552000,
    metaTitle: "Olietankverwijdering Den Haag - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Den Haag. Vergelijk bedrijven met BRL SIKB 7000 certificering en vraag gratis een offerte aan.",
    h1: "Olietankverwijdering in Den Haag",
    intro:
      "Den Haag kent een gevarieerd woningbestand met veel vooroorlogse en naoorlogse woningen waar een olietank in de grond kan zitten. Van de herenhuizen in het Statenkwartier tot de flats in de Schilderswijk en Mariahoeve: olietanks komen in veel vormen voor. Vergelijk gecertificeerde olietankverwijderaars in Den Haag.",
    lokaleContext:
      "In Den Haag zijn veel woningen uit de periode 1945-1994 te vinden, de periode waarin olietanks volop werden geplaatst. De gemeente heeft samen met woningcorporaties al grote saneringstrajecten uitgevoerd in wijken als Moerwijk en Zuidwest. Toch bevatten nog veel particuliere woningen olietanks.",
    gemeenteInfo:
      "De gemeente Den Haag vereist een sloopmelding via het Omgevingsloket bij olietankverwijdering. Bij grotere projecten moet een gecertificeerd inventarisatiebureau eerst een bodemonderzoekrapport (type A of B) opstellen. De Haagse milieustraat accepteert klein particulier olietankafval onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Den Haag?",
        antwoord:
          "De kosten variëren van 12 tot 38 euro per m2, afhankelijk van het type olietank en de situatie. In de binnenstad kunnen logistieke kosten iets hoger zijn. Vergelijk altijd meerdere offertes.",
      },
      {
        vraag: "Moet ik olietanks in mijn woning in Den Haag laten verwijderen?",
        antwoord:
          "Een olietank die in goede staat verkeert en niet beschadigd is, hoeft niet direct verwijderd te worden. Bij verbouwing, renovatie of sloop is verwijdering door een gecertificeerd bedrijf wel verplicht. Laat bij twijfel een inventarisatie uitvoeren.",
      },
    ],
    nabijeStedenSlugs: ["rotterdam", "leiden", "haarlemmermeer", "delft", "zoetermeer"],
  },
  {
    slug: "utrecht",
    naam: "Utrecht",
    provincieSlug: "utrecht",
    provincieNaam: "Utrecht",
    inwoners: 361000,
    metaTitle: "Olietankverwijdering Utrecht - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Utrecht. Vergelijk prijzen, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Utrecht",
    intro:
      "De stad Utrecht groeit snel en er wordt veel verbouwd en gerenoveerd. Bij woningen gebouwd voor 1994 komt regelmatig een olietank aan het licht. Van de wijken Overvecht en Kanaleneiland tot oudere delen van De Uithof: gecertificeerde olietankverwijdering is vaak nodig. Vergelijk hieronder de beste bedrijven in de regio Utrecht.",
    lokaleContext:
      "Utrecht kent veel naoorlogse woningbouw in wijken als Overvecht, Hoograven en Kanaleneiland waar olietanks veelvuldig is toegepast. Door de grote bouwactiviteit (Leidsche Rijn, stationsgebied) worden ook regelmatig oudere panden gesloopt waarbij een olietank wordt verwijderd.",
    gemeenteInfo:
      "De gemeente Utrecht handhaaft streng op olietankverwijdering zonder melding. Een sloopmelding is verplicht bij het verwijderen van olietankhoudende materialen. De gemeente biedt via haar website informatie over de juiste procedure en verwijst naar het landelijke Omgevingsloket.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Utrecht?",
        antwoord:
          "In Utrecht kun je rekenen op kosten tussen de 13 en 35 euro per m2 voor olietankverwijdering. De exacte prijs hangt af van het type materiaal, de omvang en de bereikbaarheid. Vergelijk altijd meerdere offertes.",
      },
      {
        vraag: "Waar kan ik olietanks inleveren in Utrecht?",
        antwoord:
          "Bij de gemeentelijke afvalscheidingsstations in Utrecht kun je als particulier kleine hoeveelheden olietankafval gratis inleveren. Het materiaal moet verpakt zijn in stevig, afgesloten plastic. Neem contact op met de gemeente voor de actuele voorwaarden.",
      },
    ],
    nabijeStedenSlugs: ["amersfoort", "amsterdam", "arnhem", "hilversum", "veenendaal"],
  },
  {
    slug: "eindhoven",
    naam: "Eindhoven",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 238000,
    metaTitle: "Olietankverwijdering Eindhoven - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Eindhoven en omgeving. Vergelijk bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Eindhoven",
    intro:
      "Eindhoven en omgeving kennen veel naoorlogse woningen en voormalige industriepanden waar olietanks aanwezig kunnen zijn. De stad groeit en er wordt volop gerenoveerd, waardoor olietankverwijdering aan de orde van de dag is. Vergelijk hieronder gecertificeerde olietankverwijderaars in de regio Eindhoven.",
    lokaleContext:
      "De regio Eindhoven heeft een mix van naoorlogse woonwijken en voormalige Philips-complexen waar olietanks veelvuldig voorkwamen. Bij de herontwikkeling van Strijp-S en andere industrieterreinen is grootschalige olietanksanering uitgevoerd. In particuliere woningen uit de jaren '60 tot '80 komt olietanks nog regelmatig voor.",
    gemeenteInfo:
      "De gemeente Eindhoven verwerkt sloopmelding via het Omgevingsloket. Bij verbouwing van woningen van voor 1994 is een bodemonderzoek verplicht. Het Milieustraat Eindhoven accepteert klein olietankafval van particulieren onder strikte voorwaarden (dubbel verpakt in plastic).",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Eindhoven?",
        antwoord:
          "De kosten liggen in Eindhoven gemiddeld tussen de 10 en 30 euro per m2. De regio Brabant is over het algemeen iets goedkoper dan de Randstad. Vraag meerdere offertes aan voor de beste prijs.",
      },
      {
        vraag: "Zit er olietanks in Philips-woningen in Eindhoven?",
        antwoord:
          "Veel van de voormalige Philips-woningen zijn gebouwd in de periode dat olietanks gangbaar waren. Vooral in dakbeschot, gevelplaten en rondom cv-leidingen kan olietanks voorkomen. Laat een inventarisatie uitvoeren als je gaat verbouwen.",
      },
    ],
    nabijeStedenSlugs: ["tilburg", "den-bosch", "breda", "helmond"],
  },
  {
    slug: "groningen",
    naam: "Groningen",
    provincieSlug: "groningen",
    provincieNaam: "Groningen",
    inwoners: 234000,
    metaTitle: "Olietankverwijdering Groningen - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Groningen. Vergelijk BRL SIKB 7000 bedrijven en vraag direct gratis offertes aan.",
    h1: "Olietankverwijdering in Groningen",
    intro:
      "In de provincie Groningen speelt olietanks een extra grote rol door de aardbevingsproblematiek. Veel woningen en boerderijen bevatten olietanks die door trillingen kan beschadigen. Daarnaast kent de stad Groningen veel naoorlogse wijken met olietankhoudende materialen. Vergelijk hier de beste gecertificeerde bedrijven.",
    lokaleContext:
      "Groningen is uniek door de combinatie van aardbevingsschade en olietankproblematiek. Door gaswinning-gerelateerde trillingen kan olietankhoudend materiaal beschadigen en vezels vrijgeven. De Nationaal Coordinater Groningen (NCG) biedt in sommige gevallen vergoeding voor olietankverwijdering bij aardbevingsschade.",
    gemeenteInfo:
      "De gemeente Groningen volgt het landelijke beleid voor sloopmelding. Bijzonder voor de regio is dat de NCG (Nationaal Coördinator Groningen) bij aardbevingsschade-gerelateerde olietankproblematiek kan bijspringen met vergoedingen. Neem contact op met de NCG voor de actuele regelingen.",
    faq: [
      {
        vraag: "Wordt olietankverwijdering vergoed bij aardbevingsschade in Groningen?",
        antwoord:
          "In sommige gevallen vergoedt de NCG (Nationaal Coördinator Groningen) olietankverwijdering als onderdeel van aardbevingsschade-herstel. Dit geldt wanneer een olietank is beschadigd als direct gevolg van aardbevingen. Neem contact op met de NCG voor een beoordeling.",
      },
      {
        vraag: "Wat kost olietankverwijdering in Groningen?",
        antwoord:
          "In de regio Groningen liggen de kosten voor olietankverwijdering tussen de 10 en 30 euro per m2. Voor boerderijen met olietankdaken kunnen de totale kosten flink oplopen vanwege de grote oppervlaktes.",
      },
    ],
    nabijeStedenSlugs: ["zwolle", "enschede", "amsterdam"],
  },
  {
    slug: "tilburg",
    naam: "Tilburg",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 224000,
    metaTitle: "Olietankverwijdering Tilburg - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Tilburg. Vergelijk bedrijven, bekijk certificeringen en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Tilburg",
    intro:
      "Tilburg heeft als voormalige textielstad veel industrieel erfgoed waar olietanks aanwezig kunnen zijn. Ook in de naoorlogse woonwijken komt olietanks veelvuldig voor. Bij renovatie of sloop is professionele olietankverwijdering vaak nodig. Vergelijk hieronder gecertificeerde bedrijven in Tilburg en omgeving.",
    lokaleContext:
      "De voormalige textielindustrie heeft in Tilburg een erfenis achtergelaten van industriële panden met olietankhoudende materialen. Bij herontwikkeling van fabriekslocaties zoals in het Veemarktkwartier en de Spoorzone is olietanksanering onderdeel van het proces. Ook particuliere woningen uit de jaren '50-'80 bevatten regelmatig olietanks.",
    gemeenteInfo:
      "De gemeente Tilburg volgt het landelijke Omgevingsloket voor sloopmelding. Het Milieustraat Tilburg accepteert klein olietankafval van particulieren. Neem altijd contact op voor de actuele voorwaarden en inleverprocedure.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Tilburg?",
        antwoord:
          "In Tilburg en omgeving liggen de kosten tussen de 10 en 30 euro per m2. Noord-Brabant is gemiddeld iets voordeliger dan de Randstad. Vergelijk altijd meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["eindhoven", "breda", "den-bosch"],
  },
  {
    slug: "almere",
    naam: "Almere",
    provincieSlug: "flevoland",
    provincieNaam: "Flevoland",
    inwoners: 218000,
    metaTitle: "Olietankverwijdering Almere - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Almere. Vergelijk bedrijven en vraag gratis offertes aan voor olietankverwijdering.",
    h1: "Olietankverwijdering in Almere",
    intro:
      "Almere is een relatief jonge stad, maar de eerste wijken (Almere-Haven, Almere-Stad) zijn gebouwd in de late jaren '70 en '80 - precies de periode dat olietanks nog veel werden geplaatst. Bij renovatie van deze woningen komt regelmatig een olietank aan het licht. Vergelijk hieronder gecertificeerde bedrijven.",
    lokaleContext:
      "Hoewel Almere een jonge stad is, bevatten de eerste woonwijken uit de late jaren '70 en '80 regelmatig olietankhoudende materialen. Vooral in Almere-Haven en de oudere delen van Almere-Stad is olietanks in dakbeschot, gevelplaten en rondom leidingen te vinden.",
    gemeenteInfo:
      "De gemeente Almere verwerkt sloopmelding via het Omgevingsloket. Bij de milieustraat van Almere kunnen particulieren onder voorwaarden klein olietankafval inleveren. Neem contact op met de gemeente voor de actuele regels.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Almere?",
        antwoord:
          "Woningen in Almere gebouwd voor 1994 kunnen een olietank bevatten, met name in Almere-Haven en de oudere delen van Almere-Stad. Bij twijfel is een bodemonderzoek aan te raden, zeker als je gaat verbouwen.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "amersfoort", "utrecht"],
  },
  {
    slug: "breda",
    naam: "Breda",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 185000,
    metaTitle: "Olietankverwijdering Breda - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Breda en omgeving. Vergelijk bedrijven, bekijk reviews en vraag gratis een offerte aan.",
    h1: "Olietankverwijdering in Breda",
    intro:
      "Breda kent zowel een historische binnenstad als naoorlogse uitbreidingswijken waar olietanks veel is toegepast. Bij verbouwingen en renovaties is professionele olietankverwijdering regelmatig nodig. Vergelijk hier de gecertificeerde olietankverwijderaars in Breda en omgeving.",
    lokaleContext:
      "In Breda komt olietanks voor in naoorlogse woningbouw in wijken als Brabantpark, Hoge Vucht en Bavel. De stad heeft ook voormalige industrieterreinen die herontwikkeld worden, waar olietanksanering onderdeel is van het proces.",
    gemeenteInfo:
      "De gemeente Breda verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation van Breda accepteert klein olietankafval van particulieren onder voorwaarden. Raadpleeg de gemeentewebsite voor actuele informatie.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Breda?",
        antwoord:
          "In Breda en omgeving liggen de kosten tussen de 10 en 30 euro per m2. Vergelijk altijd meerdere offertes voor de beste prijs-kwaliteitverhouding.",
      },
    ],
    nabijeStedenSlugs: ["tilburg", "rotterdam", "eindhoven", "den-bosch"],
  },
  {
    slug: "nijmegen",
    naam: "Nijmegen",
    provincieSlug: "gelderland",
    provincieNaam: "Gelderland",
    inwoners: 177000,
    metaTitle: "Olietankverwijdering Nijmegen - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Nijmegen. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Nijmegen",
    intro:
      "Nijmegen, de oudste stad van Nederland, heeft een divers woningbestand. De naoorlogse wederopbouwwijken bevatten regelmatig olietanks. Bij verbouwing of sloop is professionele verwijdering verplicht. Vergelijk hieronder de beste gecertificeerde bedrijven in de regio Nijmegen.",
    lokaleContext:
      "Na de verwoestingen in WOII is Nijmegen grotendeels herbouwd in de periode dat olietanks veel werden geplaatst. Wijken als Hatert, Dukenburg en Lindenholt bevatten veel woningen uit de risicoperiode. Ook de Waalsprong heeft deels oudere bebouwing die gesloopt wordt.",
    gemeenteInfo:
      "De gemeente Nijmegen verwerkt sloopmelding via het Omgevingsloket. Bijzonder is dat de regio Gelderland soms provinciale regelingen kent voor olietanksanering, met name voor agrarische daken. Informeer bij de provincie Gelderland naar actuele subsidies.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Nijmegen?",
        antwoord:
          "In de regio Nijmegen liggen de kosten tussen de 10 en 30 euro per m2. De prijs hangt af van het type olietank en de bereikbaarheid. Vergelijk meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["arnhem", "den-bosch", "utrecht"],
  },
  {
    slug: "arnhem",
    naam: "Arnhem",
    provincieSlug: "gelderland",
    provincieNaam: "Gelderland",
    inwoners: 164000,
    metaTitle: "Olietankverwijdering Arnhem - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Arnhem. Vergelijk bedrijven met BRL SIKB 7000 certificering en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Arnhem",
    intro:
      "Arnhem werd zwaar getroffen tijdens de Slag om Arnhem en is daarna herbouwd in de periode dat olietanks volop werden geplaatst. De naoorlogse wijken bevatten regelmatig olietankhoudende materialen. Vergelijk hieronder gecertificeerde olietankverwijderaars in Arnhem en omgeving.",
    lokaleContext:
      "De wederopbouw na WOII heeft Arnhem veel woningen opgeleverd uit de risicoperiode voor olietanks. Wijken als Presikhaaf, Malburgen en Geitenkamp bevatten veel woningbouw uit de jaren '50 tot '80. De provincie Gelderland heeft in het verleden subsidies aangeboden voor olietanksdaksanering.",
    gemeenteInfo:
      "De gemeente Arnhem volgt het landelijke beleid via het Omgevingsloket. De milieustraat Arnhem accepteert klein olietankafval van particulieren. Informeer bij de provincie Gelderland naar eventuele subsidies voor olietankdaken.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Arnhem?",
        antwoord:
          "In Arnhem en omgeving liggen de kosten tussen de 10 en 32 euro per m2. De provincie Gelderland bood in het verleden subsidies aan, informeer naar de actuele stand van zaken.",
      },
    ],
    nabijeStedenSlugs: ["nijmegen", "apeldoorn", "amersfoort", "utrecht"],
  },
  {
    slug: "haarlem",
    naam: "Haarlem",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 162000,
    metaTitle: "Olietankverwijdering Haarlem - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Haarlem. Vergelijk bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Haarlem",
    intro:
      "Haarlem heeft een mix van historische binnenstad en naoorlogse uitbreidingswijken. In veel woningen uit de jaren '50 tot '80 is olietanks aanwezig. Bij renovatie is professionele olietankverwijdering vaak nodig. Vergelijk hier de beste gecertificeerde bedrijven in Haarlem.",
    lokaleContext:
      "Haarlem kent in wijken als Schalkwijk en de Slachthuisbuurt veel naoorlogse woningbouw waar olietanks aanwezig kunnen zijn. Bij renovaties van de historische binnenstad wordt ook regelmatig olietanks aangetroffen in later toegevoegde isolatie en beplating.",
    gemeenteInfo:
      "De gemeente Haarlem verwerkt sloopmelding via het Omgevingsloket. Bij het gemeentelijke afvalbrengpunt kunnen particulieren onder voorwaarden klein olietankafval inleveren. Raadpleeg de website van de gemeente voor actuele regels.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Haarlem?",
        antwoord:
          "In Haarlem liggen de kosten tussen de 14 en 35 euro per m2, vergelijkbaar met Amsterdam en omgeving. Vergelijk meerdere offertes voor de beste prijs.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "haarlemmermeer", "zaanstad", "leiden"],
  },
  {
    slug: "enschede",
    naam: "Enschede",
    provincieSlug: "overijssel",
    provincieNaam: "Overijssel",
    inwoners: 160000,
    metaTitle: "Olietankverwijdering Enschede - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Enschede. Vergelijk bedrijven en vraag gratis offertes aan voor olietankverwijdering.",
    h1: "Olietankverwijdering in Enschede",
    intro:
      "Enschede heeft als voormalige textielstad veel industrieel erfgoed en naoorlogse woningbouw waar olietanks aanwezig kunnen zijn. Na de vuurwerkramp van 2000 is veel ervaring opgebouwd met olietanksanering. Vergelijk hier gecertificeerde olietankverwijderaars in Enschede en Twente.",
    lokaleContext:
      "De textielindustrie heeft in Enschede net als in Tilburg een erfenis van olietankhoudende industriepanden. Na de vuurwerkramp in de wijk Roombeek is op grote schaal olietanks gesaneerd. In naoorlogse wijken als Wesselerbrink en Helmerhoek wordt bij renovatie regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Enschede verwerkt sloopmelding via het Omgevingsloket. Het brengpunt Enschede accepteert klein olietankafval van particulieren. De regio Twente heeft diverse gecertificeerde bedrijven actief.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Enschede?",
        antwoord:
          "In Enschede en de regio Twente liggen de kosten tussen de 10 en 28 euro per m2. De regio is gemiddeld voordeliger dan de Randstad.",
      },
    ],
    nabijeStedenSlugs: ["zwolle", "apeldoorn", "arnhem", "nijmegen"],
  },
  {
    slug: "apeldoorn",
    naam: "Apeldoorn",
    provincieSlug: "gelderland",
    provincieNaam: "Gelderland",
    inwoners: 165000,
    metaTitle: "Olietankverwijdering Apeldoorn - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Apeldoorn. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Apeldoorn",
    intro:
      "Apeldoorn kent veel woningbouw uit de naoorlogse periode en een landelijke omgeving met agrarische gebouwen waar olietankdaken veelvuldig voorkomen. Vergelijk hieronder gecertificeerde olietankverwijderaars in Apeldoorn en omgeving op de Veluwe.",
    lokaleContext:
      "De gemeente Apeldoorn heeft een groot buitengebied met agrarische bedrijven waar olietankdaken (golfplaten) veel voorkomen. In de bebouwde kom bevatten naoorlogse wijken als Zevenhuizen en Orden regelmatig olietankhoudende materialen. De provincie Gelderland stimuleerde de sanering van olietankdaken.",
    gemeenteInfo:
      "De gemeente Apeldoorn volgt het landelijke beleid voor sloopmelding. Het afvalbrengstation van Apeldoorn accepteert klein olietankafval. Informeer bij de provincie Gelderland naar subsidiemogelijkheden voor olietanksdaksanering.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Apeldoorn?",
        antwoord:
          "In Apeldoorn en de Veluwe liggen de kosten tussen de 10 en 30 euro per m2. Voor grote olietankdaken op boerderijen kan de totale prijs flink oplopen.",
      },
    ],
    nabijeStedenSlugs: ["arnhem", "zwolle", "amersfoort", "enschede"],
  },
  {
    slug: "amersfoort",
    naam: "Amersfoort",
    provincieSlug: "utrecht",
    provincieNaam: "Utrecht",
    inwoners: 160000,
    metaTitle: "Olietankverwijdering Amersfoort - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Amersfoort. Vergelijk BRL SIKB 7000 bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Amersfoort",
    intro:
      "Amersfoort groeit snel en er wordt veel verbouwd. De naoorlogse wijken bevatten regelmatig olietanks die bij renovatie moet worden verwijderd. Vergelijk hieronder gecertificeerde olietankverwijderaars in Amersfoort en omgeving.",
    lokaleContext:
      "Amersfoort heeft veel woningbouw uit de jaren '60 en '70 in wijken als Liendert, Rustenburg en Schuilenburg waar olietanks regelmatig voorkomt. Bij de grote nieuwbouwontwikkeling Vathorst zijn ook oudere panden gesloopt waarbij olietanks moest worden gesaneerd.",
    gemeenteInfo:
      "De gemeente Amersfoort verwerkt sloopmelding via het Omgevingsloket. Het brengstation van de gemeente accepteert klein olietankafval onder strikte voorwaarden. Raadpleeg de website van de gemeente voor de actuele procedure.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Amersfoort?",
        antwoord:
          "In Amersfoort liggen de kosten tussen de 12 en 33 euro per m2, vergelijkbaar met de regio Utrecht. Vergelijk altijd meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["utrecht", "apeldoorn", "almere", "arnhem"],
  },
  {
    slug: "zaanstad",
    naam: "Zaanstad",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 157000,
    metaTitle: "Olietankverwijdering Zaanstad - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Zaanstad (Zaandam). Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Zaanstad",
    intro:
      "Zaanstad, met de kern Zaandam, kent een rijke industriële geschiedenis. In voormalige fabrieken en naoorlogse woonwijken is veel olietanks aanwezig. Vergelijk hier gecertificeerde olietankverwijderaars in Zaanstad en de Zaanstreek.",
    lokaleContext:
      "De Zaanstreek heeft als voormalig industriegebied (cacao, hout, chemie) een erfenis van olietankhoudende bedrijfspanden. In woonwijken als Poelenburg en Peldersveld komt olietanks voor in naoorlogse woningbouw. Bij herontwikkeling van industrieterreinen is olietanksanering vaak nodig.",
    gemeenteInfo:
      "De gemeente Zaanstad verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengpunt Zaanstad accepteert klein olietankafval. Raadpleeg de gemeentewebsite voor de actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Zaanstad?",
        antwoord:
          "In Zaanstad liggen de kosten tussen de 13 en 35 euro per m2, vergelijkbaar met de regio Amsterdam. Vergelijk altijd meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "haarlem", "haarlemmermeer"],
  },
  {
    slug: "den-bosch",
    naam: "'s-Hertogenbosch",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 158000,
    metaTitle: "Olietankverwijdering Den Bosch - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Den Bosch. Vergelijk bedrijven, bekijk certificeringen en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in 's-Hertogenbosch",
    intro:
      "Den Bosch heeft een historische binnenstad en naoorlogse uitbreidingswijken waar olietanks is toegepast. Bij verbouwing of sloop is gecertificeerde olietankverwijdering verplicht. Vergelijk hieronder de beste bedrijven in Den Bosch en omgeving.",
    lokaleContext:
      "In 's-Hertogenbosch komt olietanks voor in naoorlogse wijken als De Kruiskamp, Hambaken en Maaspoort. De stad heeft ook voormalige industrieterreinen waar bij herontwikkeling olietanksanering nodig is. Het landelijk gebied rondom Den Bosch kent veel boerderijen met olietankdaken.",
    gemeenteInfo:
      "De gemeente 's-Hertogenbosch verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Den Bosch?",
        antwoord:
          "In Den Bosch en omgeving liggen de kosten tussen de 10 en 30 euro per m2. Noord-Brabant is gemiddeld iets voordeliger dan de Randstad.",
      },
    ],
    nabijeStedenSlugs: ["eindhoven", "tilburg", "nijmegen", "breda"],
  },
  {
    slug: "haarlemmermeer",
    naam: "Haarlemmermeer",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 157000,
    metaTitle: "Olietankverwijdering Haarlemmermeer - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Haarlemmermeer (Hoofddorp). Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Haarlemmermeer",
    intro:
      "De gemeente Haarlemmermeer, met Hoofddorp als grootste kern, kent zowel agrarische bebouwing als naoorlogse wijken waar olietanks in voorkomt. Vergelijk hier gecertificeerde olietankverwijderaars in Haarlemmermeer en omgeving.",
    lokaleContext:
      "Haarlemmermeer heeft een mix van agrarische gebouwen met olietankdaken en naoorlogse woningbouw in kernen als Hoofddorp en Nieuw-Vennep. Door de groei van Schiphol en de omgeving worden regelmatig oudere panden gesloopt waarbij een olietank wordt verwijderd.",
    gemeenteInfo:
      "De gemeente Haarlemmermeer verwerkt sloopmelding via het Omgevingsloket. Het milieupark accepteert klein olietankafval van particulieren onder voorwaarden. Informeer bij de gemeente voor de actuele regels.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Haarlemmermeer?",
        antwoord:
          "In Haarlemmermeer liggen de kosten tussen de 13 en 35 euro per m2. Door de ligging nabij Amsterdam zijn de prijzen vergelijkbaar met de Randstad.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "haarlem", "leiden", "zaanstad"],
  },
  {
    slug: "zwolle",
    naam: "Zwolle",
    provincieSlug: "overijssel",
    provincieNaam: "Overijssel",
    inwoners: 131000,
    metaTitle: "Olietankverwijdering Zwolle - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Zwolle. Vergelijk bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Zwolle",
    intro:
      "Zwolle kent naoorlogse uitbreidingswijken en een landelijke omgeving met agrarische gebouwen waar olietanks veelvuldig voorkomt. Vergelijk hier gecertificeerde olietankverwijderaars in Zwolle en omgeving.",
    lokaleContext:
      "In Zwolle komt olietanks voor in naoorlogse wijken als Aa-landen, Westenholte en Holtenbroek. Het landelijke gebied rondom Zwolle kent veel boerderijen en schuren met olietankdaken. Overijssel heeft als agrarische provincie relatief veel olietankdaken.",
    gemeenteInfo:
      "De gemeente Zwolle verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de website van de gemeente voor actuele informatie en voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Zwolle?",
        antwoord:
          "In Zwolle en omgeving liggen de kosten tussen de 10 en 28 euro per m2. Voor olietankdaken op boerderijen kan het totaalbedrag aanzienlijk hoger zijn.",
      },
    ],
    nabijeStedenSlugs: ["apeldoorn", "enschede", "groningen", "amersfoort"],
  },
  {
    slug: "leiden",
    naam: "Leiden",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 126000,
    metaTitle: "Olietankverwijdering Leiden - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Leiden. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Leiden",
    intro:
      "Leiden heeft als universiteitsstad een mix van historische en naoorlogse bebouwing. In veel woningen uit de jaren '50 tot '80 is olietanks aanwezig. Vergelijk hier de gecertificeerde olietankverwijderaars in Leiden en omgeving.",
    lokaleContext:
      "In Leiden komt olietanks voor in naoorlogse wijken als de Stevenshof, Meerburg en de Kooi. De universiteitsgebouwen uit die periode zijn grotendeels gesaneerd, maar in particuliere woningen wordt bij renovatie nog regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Leiden verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation Leiden accepteert klein olietankafval van particulieren onder voorwaarden. Raadpleeg de website van de gemeente voor de actuele procedure.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Leiden?",
        antwoord:
          "In Leiden liggen de kosten tussen de 13 en 35 euro per m2, vergelijkbaar met de regio Zuid-Holland. Vergelijk altijd meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["den-haag", "haarlem", "rotterdam", "haarlemmermeer"],
  },
  {
    slug: "maastricht",
    naam: "Maastricht",
    provincieSlug: "limburg",
    provincieNaam: "Limburg",
    inwoners: 121000,
    metaTitle: "Olietankverwijdering Maastricht - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Maastricht. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Maastricht",
    intro:
      "Maastricht kent als oudste stad van Nederland veel historische bebouwing en naoorlogse wijken waar olietanks is verwerkt. Bij renovatie van woningen uit de jaren '50 tot '80 wordt regelmatig olietanks aangetroffen. Vergelijk hier gecertificeerde olietankverwijderaars in Maastricht en Zuid-Limburg.",
    lokaleContext:
      "In Maastricht en omgeving komt olietanks voor in naoorlogse wijken als Mariaberg, Caberg en Malpertuis. Door de vele mergelpanden en kelders spelen olietanks hier een andere rol dan in de rest van het land. De voormalige industriegebieden (Sphinx, ENCI) zijn grotendeels gesaneerd, maar in particuliere woningen wordt nog regelmatig olietanks gevonden.",
    gemeenteInfo:
      "De gemeente Maastricht verwerkt sloopmelding via het Omgevingsloket. Het milieupark Maastricht accepteert klein olietankafval van particulieren onder voorwaarden. Raadpleeg de gemeentewebsite voor actuele regels.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Maastricht?",
        antwoord:
          "In Maastricht en Zuid-Limburg liggen de kosten tussen de 10 en 30 euro per m2. Vergelijk altijd meerdere offertes voor de beste prijs.",
      },
      {
        vraag: "Zit er olietanks in mergelpanden in Maastricht?",
        antwoord:
          "Mergelpanden zelf bevatten geen olietank, maar latere toevoegingen (isolatie, dakbeschot, cv-leidingen) uit de periode voor 1994 kunnen wel olietankhoudend zijn. Laat een inventarisatie uitvoeren bij renovatie.",
      },
    ],
    nabijeStedenSlugs: ["eindhoven", "den-bosch"],
  },
  {
    slug: "zoetermeer",
    naam: "Zoetermeer",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 126000,
    metaTitle: "Olietankverwijdering Zoetermeer - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Zoetermeer. Vergelijk bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Zoetermeer",
    intro:
      "Zoetermeer groeide in de jaren '60 tot '80 explosief als groeikern. Veel woningen uit die periode bevatten olietankhoudende materialen. Bij renovatie of sloop is professionele olietankverwijdering vaak noodzakelijk. Vergelijk hier gecertificeerde bedrijven in Zoetermeer.",
    lokaleContext:
      "Als groeikern uit de jaren '60-'80 heeft Zoetermeer een grote voorraad woningen uit precies de periode dat olietanks volop werden geplaatst. In wijken als Palenstein, Meerzicht en Buytenwegh wordt bij renovatie regelmatig olietanks aangetroffen in dakbeschot, gevelplaten en rondom cv-leidingen.",
    gemeenteInfo:
      "De gemeente Zoetermeer verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation Zoetermeer accepteert klein olietankafval van particulieren. Raadpleeg de website van de gemeente voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Zoetermeer?",
        antwoord:
          "Zoetermeer is grotendeels gebouwd in de jaren '60-'80, precies de periode waarin olietanks veelvuldig werden geplaatst. De kans op olietanks in woningen uit die tijd is aanzienlijk. Laat altijd een inventarisatie uitvoeren voor verbouwing.",
      },
    ],
    nabijeStedenSlugs: ["den-haag", "leiden", "rotterdam"],
  },
  {
    slug: "dordrecht",
    naam: "Dordrecht",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 119000,
    metaTitle: "Olietankverwijdering Dordrecht - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Dordrecht. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Dordrecht",
    intro:
      "Dordrecht is een van de oudste steden van Holland met veel historische bebouwing en naoorlogse woonwijken. Bij verbouwingen wordt regelmatig olietanks aangetroffen. Vergelijk hier gecertificeerde olietankverwijderaars in Dordrecht en de Drechtsteden.",
    lokaleContext:
      "In Dordrecht en de Drechtsteden komt olietanks voor in naoorlogse wijken als Wielwijk, Crabbehof en Sterrenburg. De scheepsbouwindustrie heeft ook bijgedragen aan olietanksgebruik in de regio. Bij herontwikkeling van oude industrieterreinen is olietanksanering vaak onderdeel van het proces.",
    gemeenteInfo:
      "De gemeente Dordrecht verwerkt sloopmelding via het Omgevingsloket. Het milieubrengstation accepteert klein olietankafval van particulieren onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Dordrecht?",
        antwoord:
          "In Dordrecht en de Drechtsteden liggen de kosten tussen de 12 en 32 euro per m2, vergelijkbaar met de regio Zuid-Holland.",
      },
    ],
    nabijeStedenSlugs: ["rotterdam", "breda", "den-haag"],
  },
  {
    slug: "leeuwarden",
    naam: "Leeuwarden",
    provincieSlug: "friesland",
    provincieNaam: "Friesland",
    inwoners: 124000,
    metaTitle: "Olietankverwijdering Leeuwarden - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Leeuwarden en Friesland. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Leeuwarden",
    intro:
      "Leeuwarden en Friesland kennen veel agrarische bebouwing met olietankdaken. Ook in de naoorlogse woonwijken van de Friese hoofdstad is olietanks aanwezig. Vergelijk hier gecertificeerde olietankverwijderaars in Leeuwarden en omgeving.",
    lokaleContext:
      "Friesland is een van de provincies met relatief veel olietankdaken, vooral op boerderijen en schuren. In Leeuwarden zelf komt olietanks voor in naoorlogse wijken als Camminghaburen, Aldlan en Bilgaard. De provincie stimuleert actief de verwijdering van olietankdaken via subsidieregelingen.",
    gemeenteInfo:
      "De gemeente Leeuwarden verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengpunt accepteert klein olietankafval van particulieren. Informeer naar provinciale subsidiemogelijkheden voor het verwijderen van olietankdaken.",
    faq: [
      {
        vraag: "Is er subsidie voor olietanksdak verwijdering in Friesland?",
        antwoord:
          "De provincie Friesland heeft in het verleden subsidieregelingen gehad voor het verwijderen van olietankdaken, vaak gekoppeld aan het plaatsen van zonnepanelen. Raadpleeg de website van de provincie voor actuele regelingen.",
      },
      {
        vraag: "Wat kost olietankverwijdering in Leeuwarden?",
        antwoord:
          "In Leeuwarden en Friesland liggen de kosten tussen de 8 en 25 euro per m2. Voor grote agrarische daken kunnen de totaalkosten flink oplopen.",
      },
    ],
    nabijeStedenSlugs: ["groningen", "zwolle"],
  },
  {
    slug: "middelburg",
    naam: "Middelburg",
    provincieSlug: "zeeland",
    provincieNaam: "Zeeland",
    inwoners: 49000,
    metaTitle: "Olietankverwijdering Middelburg - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Middelburg en Zeeland. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Middelburg",
    intro:
      "Middelburg en Zeeland kennen veel naoorlogse bebouwing en agrarische gebouwen waar olietanks in voorkomt. Vergelijk hier gecertificeerde olietankverwijderaars in Middelburg en de rest van Zeeland.",
    lokaleContext:
      "In Zeeland speelt olietankproblematiek vooral bij agrarische gebouwen en de naoorlogse wederopbouw. Na de watersnoodramp van 1953 zijn veel gebouwen herbouwd met materialen die een olietank bevatten. Dit maakt Zeeland een provincie waar extra aandacht voor olietanks nodig is bij renovatie.",
    gemeenteInfo:
      "De gemeente Middelburg verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor de actuele procedure en voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in wederopbouwwoningen in Zeeland?",
        antwoord:
          "Veel woningen in Zeeland die na de Watersnoodramp van 1953 zijn herbouwd, bevatten olietankhoudende materialen. Dit geldt voor dakbeschot, gevelplaten en isolatie. Laat een inventarisatie uitvoeren voor verbouwing.",
      },
      {
        vraag: "Wat kost olietankverwijdering in Zeeland?",
        antwoord:
          "In Zeeland liggen de kosten tussen de 9 en 28 euro per m2. Door het relatief beperkte aanbod van bedrijven in de regio kan het lonen om ook bedrijven uit Brabant of Zuid-Holland te vergelijken.",
      },
    ],
    nabijeStedenSlugs: ["breda", "dordrecht", "rotterdam"],
  },
  {
    slug: "emmen",
    naam: "Emmen",
    provincieSlug: "drenthe",
    provincieNaam: "Drenthe",
    inwoners: 107000,
    metaTitle: "Olietankverwijdering Emmen - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Emmen en Drenthe. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Emmen",
    intro:
      "Emmen en Drenthe kennen veel agrarische bebouwing met olietankdaken en naoorlogse woonwijken. Bij renovatie of sloop is professionele olietankverwijdering vaak nodig. Vergelijk hier gecertificeerde bedrijven in Emmen en omgeving.",
    lokaleContext:
      "Drenthe is als agrarische provincie een van de regio's met relatief veel olietankdaken op boerderijen en schuren. In Emmen zelf komt olietanks voor in naoorlogse wijken als Angelslo en Emmerhout. De veenkoloniale bebouwing in de omgeving bevat ook regelmatig olietankhoudende materialen.",
    gemeenteInfo:
      "De gemeente Emmen verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Informeer bij de gemeente naar de actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Emmen en Drenthe?",
        antwoord:
          "In Emmen en Drenthe liggen de kosten tussen de 8 en 25 euro per m2. Voor grote agrarische daken kunnen de totaalkosten aanzienlijk hoger uitvallen.",
      },
    ],
    nabijeStedenSlugs: ["groningen", "zwolle", "enschede"],
  },
  {
    slug: "delft",
    naam: "Delft",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 104000,
    metaTitle: "Olietankverwijdering Delft - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Delft. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Delft",
    intro:
      "Delft is een historische stad met veel vooroorlogse en naoorlogse bebouwing waar een olietank in de grond kan zitten. Vooral in de woonwijken uit de jaren '50 tot '80 rondom de oude binnenstad wordt bij renovatie regelmatig olietanks aangetroffen. Vergelijk hier gecertificeerde olietankverwijderaars in Delft.",
    lokaleContext:
      "In Delft komt olietanks voor in naoorlogse wijken als Voorhof, Buitenhof en Tanthof. De TU Delft campus heeft al grootschalige saneringen achter de rug, maar in particuliere woningen en studentenhuizen wordt nog regelmatig olietanks gevonden bij verbouwingen.",
    gemeenteInfo:
      "De gemeente Delft verwerkt sloopmelding via het Omgevingsloket. Een bodemonderzoek is verplicht bij woningen van voor 1994. Het afvalbrengstation Delft accepteert klein olietankafval van particulieren onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Delft?",
        antwoord:
          "In Delft liggen de kosten tussen de 13 en 36 euro per m2, vergelijkbaar met de regio Zuid-Holland. Vergelijk altijd meerdere offertes.",
      },
      {
        vraag: "Zit er olietanks in studentenhuizen in Delft?",
        antwoord:
          "Veel studentenhuizen in Delft zijn gevestigd in oudere panden uit de risicoperiode. Bij verbouwing of kamerverdeling is een bodemonderzoek verplicht als het pand van voor 1994 is.",
      },
    ],
    nabijeStedenSlugs: ["den-haag", "rotterdam", "zoetermeer", "leiden"],
  },
  {
    slug: "alkmaar",
    naam: "Alkmaar",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 110000,
    metaTitle: "Olietankverwijdering Alkmaar - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Alkmaar. Vergelijk bedrijven, bekijk reviews en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Alkmaar",
    intro:
      "Alkmaar en de regio Noord-Holland Noord kennen veel naoorlogse woonwijken en agrarische bebouwing waar olietanks is verwerkt. Bij verbouwing of sloop is professionele olietankverwijdering vaak nodig. Vergelijk hier gecertificeerde bedrijven in Alkmaar en omgeving.",
    lokaleContext:
      "In Alkmaar komt olietanks voor in naoorlogse wijken als De Mare, Overdie en Huiswaard. De omliggende agrarische gebieden in de Noordkop hebben veel olietankdaken op schuren en bedrijfsgebouwen. De gemeente werkt actief aan bewustwording over olietanksrisico's.",
    gemeenteInfo:
      "De gemeente Alkmaar verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Alkmaar?",
        antwoord:
          "In Alkmaar en Noord-Holland Noord liggen de kosten tussen de 12 en 32 euro per m2. Voor agrarische daken in de omgeving kunnen de totaalkosten hoger uitvallen.",
      },
    ],
    nabijeStedenSlugs: ["haarlem", "zaanstad", "amsterdam"],
  },
  {
    slug: "deventer",
    naam: "Deventer",
    provincieSlug: "overijssel",
    provincieNaam: "Overijssel",
    inwoners: 101000,
    metaTitle: "Olietankverwijdering Deventer - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Deventer. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Deventer",
    intro:
      "Deventer heeft een historische binnenstad en uitgestrekte naoorlogse woonwijken waar een olietank in de grond kan zitten. De stad kent ook veel voormalige industriepanden waar olietanksanering nodig is. Vergelijk hier gecertificeerde olietankverwijderaars in Deventer en omgeving.",
    lokaleContext:
      "In Deventer wordt olietanks aangetroffen in naoorlogse wijken als Keizerslanden, Borgele en Colmschate. De voormalige industrieterreinen langs de IJssel bevatten ook regelmatig olietankhoudende materialen. Bij de herbestemming van oude fabriekspanden is bodemonderzoek standaard.",
    gemeenteInfo:
      "De gemeente Deventer verwerkt sloopmelding via het Omgevingsloket. Bij woningen van voor 1994 is een bodemonderzoek verplicht bij verbouwing. Het gemeentelijke afvalbrengstation accepteert klein olietankafval onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Deventer?",
        antwoord:
          "In Deventer liggen de kosten tussen de 10 en 30 euro per m2. Overijssel is over het algemeen iets goedkoper dan de Randstad.",
      },
    ],
    nabijeStedenSlugs: ["zwolle", "apeldoorn", "enschede"],
  },
  {
    slug: "hilversum",
    naam: "Hilversum",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 92000,
    metaTitle: "Olietankverwijdering Hilversum - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Hilversum. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Hilversum",
    intro:
      "Hilversum, de mediastad in het Gooi, kent veel villa's en woonwijken uit de eerste helft van de 20e eeuw. In woningen gebouwd voor 1994 kan olietanks voorkomen. Vergelijk hier gecertificeerde olietankverwijderaars in Hilversum en het Gooi.",
    lokaleContext:
      "Het Gooi kent veel karakteristieke woningen uit de jaren '20 tot '80 waar olietanks in dakbeschot, gevelplaten en isolatie kan zitten. De omroepgebouwen in het Mediapark zijn grotendeels gesaneerd, maar in particuliere woningen wordt bij verbouwing nog regelmatig olietanks gevonden.",
    gemeenteInfo:
      "De gemeente Hilversum verwerkt sloopmelding via het Omgevingsloket. Bij verbouwing van woningen van voor 1994 is een bodemonderzoek verplicht. Het afvalbrengstation accepteert klein olietankafval onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Hilversum?",
        antwoord:
          "In Hilversum en het Gooi liggen de kosten tussen de 14 en 38 euro per m2. Door de hogere vastgoedwaarde en veel monumentale panden kunnen extra kosten gelden.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "amersfoort", "utrecht"],
  },
  {
    slug: "hengelo",
    naam: "Hengelo",
    provincieSlug: "overijssel",
    provincieNaam: "Overijssel",
    inwoners: 81000,
    metaTitle: "Olietankverwijdering Hengelo - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Hengelo. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Hengelo",
    intro:
      "Hengelo heeft als voormalige industriestad een rijk verleden met Stork en andere fabrieken waar olietanks veelvuldig werd gebruikt. Ook in de naoorlogse woonwijken komen olietanks voor. Vergelijk hier gecertificeerde olietankverwijderaars in Hengelo en Twente.",
    lokaleContext:
      "De industriële geschiedenis van Hengelo heeft geleid tot veel olietankhoudende bebouwing. Bij de herontwikkeling van het Hart van Zuid (voormalig Stork-terrein) is grootschalige olietanksanering uitgevoerd. In particuliere woningen uit de jaren '50 tot '80 wordt nog regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Hengelo verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor de actuele procedure.",
    faq: [
      {
        vraag: "Zit er olietanks in oude fabriekswoningen in Hengelo?",
        antwoord:
          "Veel arbeiderswoningen in Hengelo zijn gebouwd in de jaren '50-'70, de periode dat olietanks veelvuldig werden geplaatst. Vooral in dakbeschot en rondom cv-leidingen kan olietanks voorkomen.",
      },
    ],
    nabijeStedenSlugs: ["enschede", "deventer", "zwolle", "apeldoorn"],
  },
  {
    slug: "helmond",
    naam: "Helmond",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 93000,
    metaTitle: "Olietankverwijdering Helmond - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Helmond. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Helmond",
    intro:
      "Helmond is een voormalige textielstad met veel naoorlogse woonwijken en industriepanden waar olietanks aanwezig kunnen zijn. Door de groei en renovatie van de stad is olietankverwijdering een belangrijk thema. Vergelijk hier gecertificeerde olietankverwijderaars in Helmond.",
    lokaleContext:
      "In Helmond komt olietanks voor in naoorlogse wijken als Helmond-West, Brouwhuis en Rijpelberg. De voormalige textielfabrieken waar olietanks als isolatiemateriaal werd gebruikt, zijn grotendeels gesaneerd. In particuliere woningen wordt bij renovatie nog regelmatig olietanks gevonden.",
    gemeenteInfo:
      "De gemeente Helmond verwerkt sloopmelding via het Omgevingsloket. Het milieubrengstation accepteert klein olietankafval van particulieren onder voorwaarden. Raadpleeg de gemeentewebsite voor actuele informatie.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Helmond?",
        antwoord:
          "In Helmond en de regio Oost-Brabant liggen de kosten tussen de 10 en 28 euro per m2. Vergelijk altijd meerdere offertes voor de beste prijs.",
      },
    ],
    nabijeStedenSlugs: ["eindhoven", "den-bosch", "tilburg"],
  },
  {
    slug: "oss",
    naam: "Oss",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 93000,
    metaTitle: "Olietankverwijdering Oss - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Oss. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Oss",
    intro:
      "Oss kent als voormalige industriestad veel bebouwing waar olietanks aanwezig kunnen zijn. Van de farmaceutische industrie tot naoorlogse woonwijken: olietanks komen in diverse vormen voor. Vergelijk hier gecertificeerde olietankverwijderaars in Oss en omgeving.",
    lokaleContext:
      "De industriële historie van Oss (Organon, Zwanenberg) heeft bijgedragen aan veel olietankhoudende bebouwing. Bij herontwikkeling van oude bedrijfsterreinen is olietanksanering een vast onderdeel. In naoorlogse woonwijken als Ruwaard en Schadewijk wordt bij renovatie regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Oss verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor de actuele procedure.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Oss?",
        antwoord:
          "In Oss en de regio Brabant liggen de kosten tussen de 10 en 30 euro per m2. Vergelijk meerdere offertes voor de beste prijs.",
      },
    ],
    nabijeStedenSlugs: ["den-bosch", "nijmegen", "eindhoven"],
  },
  {
    slug: "schiedam",
    naam: "Schiedam",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 79000,
    metaTitle: "Olietankverwijdering Schiedam - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Schiedam. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Schiedam",
    intro:
      "Schiedam heeft als voormalige jeneverstad veel historische panden en naoorlogse woonwijken waar olietanks voorkomt. Door de ligging naast Rotterdam zijn er veel gecertificeerde bedrijven in de buurt. Vergelijk hier olietankverwijderaars in Schiedam.",
    lokaleContext:
      "In Schiedam komt olietanks voor in naoorlogse wijken als Groenoord, Nieuwland en Woudhoek. De voormalige industrie langs de Nieuwe Waterweg heeft ook bijgedragen aan olietankhoudende bebouwing. Door de stedelijke vernieuwingsprojecten wordt regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Schiedam verwerkt sloopmelding via het Omgevingsloket. Het gemeentelijke afvalbrengstation accepteert klein olietankafval van particulieren onder strikte voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Schiedam?",
        antwoord:
          "In Schiedam liggen de kosten tussen de 13 en 35 euro per m2, vergelijkbaar met de regio Rotterdam. Vergelijk altijd meerdere offertes.",
      },
    ],
    nabijeStedenSlugs: ["rotterdam", "den-haag", "delft", "dordrecht"],
  },
  {
    slug: "venlo",
    naam: "Venlo",
    provincieSlug: "limburg",
    provincieNaam: "Limburg",
    inwoners: 102000,
    metaTitle: "Olietankverwijdering Venlo - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Venlo en Noord-Limburg. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Venlo",
    intro:
      "Venlo en Noord-Limburg kennen veel naoorlogse bebouwing en logistieke bedrijfspanden waar olietanks aanwezig kunnen zijn. De grensligging zorgt ervoor dat er ook Duitse olietankregels kunnen spelen bij grensoverschrijdende projecten. Vergelijk hier gecertificeerde olietankverwijderaars in Venlo.",
    lokaleContext:
      "In Venlo wordt olietanks aangetroffen in naoorlogse wijken als Blerick, Tegelen en Belfeld. De logistieke sector in de regio heeft veel bedrijfshallen uit de jaren '60-'80 waar olietankhoudende dakplaten zijn gebruikt. Bij herontwikkeling van deze terreinen is olietanksanering vaak vereist.",
    gemeenteInfo:
      "De gemeente Venlo verwerkt sloopmelding via het Omgevingsloket. Het milieubrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Venlo?",
        antwoord:
          "In Venlo en Noord-Limburg liggen de kosten tussen de 10 en 28 euro per m2. Door het grotere aanbod van bedrijven in Brabant kan het lonen om ook daar te vergelijken.",
      },
    ],
    nabijeStedenSlugs: ["maastricht", "nijmegen", "eindhoven"],
  },
  {
    slug: "lelystad",
    naam: "Lelystad",
    provincieSlug: "flevoland",
    provincieNaam: "Flevoland",
    inwoners: 81000,
    metaTitle: "Olietankverwijdering Lelystad - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Lelystad en Flevoland. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Lelystad",
    intro:
      "Lelystad is grotendeels gebouwd in de jaren '60 tot '80, precies de periode waarin olietanks op grote schaal werden geplaatst in de bouw. Veel woningen en bedrijfspanden bevatten olietankhoudende materialen. Vergelijk hier gecertificeerde olietankverwijderaars in Lelystad en Flevoland.",
    lokaleContext:
      "Als stad uit de jaren '60-'80 heeft Lelystad een groot aandeel woningen uit de olietankperiode. In wijken als Zuiderzeewijk, Kempenaar en Waterwijk wordt bij renovatie regelmatig olietanks aangetroffen. Ook de agrarische bedrijfsgebouwen in de Flevopolder bevatten vaak olietankdaken.",
    gemeenteInfo:
      "De gemeente Lelystad verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor de actuele procedure en voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Lelystad?",
        antwoord:
          "Lelystad is grotendeels gebouwd in de periode dat olietanks gangbaar waren (jaren '60-'80). De kans op olietanks in woningen uit die tijd is aanzienlijk, vooral in dakplaten, gevelplaten en rondom cv-leidingen.",
      },
    ],
    nabijeStedenSlugs: ["almere", "zwolle", "amsterdam"],
  },
  {
    slug: "roosendaal",
    naam: "Roosendaal",
    provincieSlug: "noord-brabant",
    provincieNaam: "Noord-Brabant",
    inwoners: 77000,
    metaTitle: "Olietankverwijdering Roosendaal - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Roosendaal. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Roosendaal",
    intro:
      "Roosendaal en West-Brabant kennen veel naoorlogse woonwijken en agrarische bebouwing waar olietanks aanwezig kunnen zijn. Als knooppuntstad heeft Roosendaal ook veel bedrijfspanden uit de olietankperiode. Vergelijk hier gecertificeerde olietankverwijderaars.",
    lokaleContext:
      "In Roosendaal komt olietanks voor in naoorlogse wijken als Kroeven, Langdonk en Tolberg. De agrarische omgeving van West-Brabant heeft veel schuren en bedrijfsgebouwen met olietankdaken. Bij renovatie en sloop is professionele olietankverwijdering vrijwel altijd nodig.",
    gemeenteInfo:
      "De gemeente Roosendaal verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren onder voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Roosendaal?",
        antwoord:
          "In Roosendaal en West-Brabant liggen de kosten tussen de 10 en 28 euro per m2. Vergelijk meerdere offertes voor de beste prijs.",
      },
    ],
    nabijeStedenSlugs: ["breda", "tilburg", "dordrecht"],
  },
  {
    slug: "vlaardingen",
    naam: "Vlaardingen",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 74000,
    metaTitle: "Olietankverwijdering Vlaardingen - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Vlaardingen. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Vlaardingen",
    intro:
      "Vlaardingen heeft als voormalige haringstad veel naoorlogse woonwijken en havengebieden waar olietanks is verwerkt. Door stedelijke vernieuwing wordt regelmatig olietanks aangetroffen. Vergelijk hier gecertificeerde olietankverwijderaars in Vlaardingen.",
    lokaleContext:
      "In Vlaardingen komt olietanks veelvuldig voor in naoorlogse wijken als Holy, Westwijk en Ambacht. De scheepvaart- en havenindustrie hebben ook bijgedragen aan olietankhoudende bebouwing in het havengebied. Bij renovatieprojecten is bodemonderzoek standaard.",
    gemeenteInfo:
      "De gemeente Vlaardingen verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren onder strikte voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Vlaardingen?",
        antwoord:
          "In Vlaardingen liggen de kosten tussen de 13 en 35 euro per m2, vergelijkbaar met de regio Rijnmond.",
      },
    ],
    nabijeStedenSlugs: ["rotterdam", "schiedam", "delft"],
  },
  {
    slug: "alphen-aan-den-rijn",
    naam: "Alphen aan den Rijn",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 112000,
    metaTitle: "Olietankverwijdering Alphen aan den Rijn - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Alphen aan den Rijn. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Alphen aan den Rijn",
    intro:
      "Alphen aan den Rijn groeide sterk in de jaren '60 tot '80 als forensenstad. Veel woningen uit die periode bevatten olietankhoudende materialen. Vergelijk hier gecertificeerde olietankverwijderaars in Alphen aan den Rijn en het Groene Hart.",
    lokaleContext:
      "Als groeikern uit de jaren '60-'80 heeft Alphen aan den Rijn veel woningen uit precies de olietankperiode. In wijken als Ridderveld, Kerk en Zanen en De Baronie wordt bij renovatie regelmatig olietanks aangetroffen in dakbeschot, gevelplaten en vloertegels.",
    gemeenteInfo:
      "De gemeente Alphen aan den Rijn verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Alphen aan den Rijn?",
        antwoord:
          "Veel woningen in Alphen aan den Rijn zijn gebouwd in de jaren '60-'80, de piek van het olietankgebruik in Nederland. De kans op olietanks is aanzienlijk bij verbouwing van woningen uit die periode.",
      },
    ],
    nabijeStedenSlugs: ["leiden", "zoetermeer", "den-haag"],
  },
  {
    slug: "amstelveen",
    naam: "Amstelveen",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 91000,
    metaTitle: "Olietankverwijdering Amstelveen - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Amstelveen. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Amstelveen",
    intro:
      "Amstelveen groeide in de naoorlogse periode fors als woonplaats voor forensen. Veel woningen uit de jaren '50 tot '80 bevatten olietankhoudende materialen. Vergelijk hier gecertificeerde olietankverwijderaars in Amstelveen.",
    lokaleContext:
      "In Amstelveen komt olietanks voor in naoorlogse wijken als Bankras-Kostverloren, Middenhoven en Groenelaan. Door de hoge vastgoedwaarde wordt er veel gerenoveerd, waarbij olietankverwijdering regelmatig aan de orde is. De gemeente heeft actief beleid op olietanksbewustwording.",
    gemeenteInfo:
      "De gemeente Amstelveen verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation Amstelveen accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor de actuele procedure.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Amstelveen?",
        antwoord:
          "In Amstelveen liggen de kosten tussen de 14 en 38 euro per m2. Door de hogere vastgoedwaarde en veel verbouwingen is er een goed aanbod van gecertificeerde bedrijven in de regio.",
      },
    ],
    nabijeStedenSlugs: ["amsterdam", "haarlem", "haarlemmermeer"],
  },
  {
    slug: "gouda",
    naam: "Gouda",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 74000,
    metaTitle: "Olietankverwijdering Gouda - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Gouda. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Gouda",
    intro:
      "Gouda heeft naast haar beroemde binnenstad veel naoorlogse woonwijken waar olietanks aanwezig kunnen zijn. Bij renovatie van woningen uit de jaren '50 tot '80 wordt regelmatig olietanks aangetroffen. Vergelijk hier gecertificeerde olietankverwijderaars in Gouda.",
    lokaleContext:
      "In Gouda komt olietanks voor in naoorlogse wijken als Goverwelle, Bloemendaal en Plaswijck. De stad heeft ook veel rijtjeshuizen uit de jaren '60-'70 waar olietanks in dakbeschot en rondom leidingen kan zitten. Bij grootschalige renovatieprojecten van woningcorporaties is olietanksanering standaard.",
    gemeenteInfo:
      "De gemeente Gouda verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Gouda?",
        antwoord:
          "In Gouda liggen de kosten tussen de 12 en 33 euro per m2, vergelijkbaar met de regio Midden-Holland.",
      },
    ],
    nabijeStedenSlugs: ["zoetermeer", "rotterdam", "alphen-aan-den-rijn", "utrecht"],
  },
  {
    slug: "ede",
    naam: "Ede",
    provincieSlug: "gelderland",
    provincieNaam: "Gelderland",
    inwoners: 119000,
    metaTitle: "Olietankverwijdering Ede - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Ede en de Veluwe. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Ede",
    intro:
      "Ede is een uitgestrekte gemeente op de Veluwe met zowel stedelijke bebouwing als veel agrarische gebouwen. In beide typen komt olietanks veelvuldig voor. Vergelijk hier gecertificeerde olietankverwijderaars in Ede en omgeving.",
    lokaleContext:
      "De gemeente Ede omvat naast de kern ook dorpen als Bennekom, Lunteren en Ederveen. Vooral in de agrarische sector zijn veel schuren en stallen met olietankdaken. In de naoorlogse woonwijken van Ede-stad wordt bij renovatie ook regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Ede verwerkt sloopmelding via het Omgevingsloket. Informeer bij de provincie Gelderland naar subsidiemogelijkheden voor het verwijderen van olietankdaken op agrarische gebouwen.",
    faq: [
      {
        vraag: "Is er subsidie voor olietanksdak verwijdering in Gelderland?",
        antwoord:
          "De provincie Gelderland heeft in het verleden subsidieregelingen gehad voor het verwijderen van olietankdaken, vaak gekoppeld aan verduurzaming. Raadpleeg de website van de provincie voor actuele regelingen.",
      },
    ],
    nabijeStedenSlugs: ["arnhem", "apeldoorn", "amersfoort", "nijmegen"],
  },
  {
    slug: "purmerend",
    naam: "Purmerend",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 81000,
    metaTitle: "Olietankverwijdering Purmerend - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Purmerend. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Purmerend",
    intro:
      "Purmerend groeide als groeikern explosief in de jaren '70 en '80. Veel woningen uit die periode bevatten olietankhoudende materialen. Vergelijk hier gecertificeerde olietankverwijderaars in Purmerend en Waterland.",
    lokaleContext:
      "Als groeikern uit de jaren '70-'80 heeft Purmerend een groot aandeel woningen uit de olietankperiode. In wijken als Wheermolen, Overwhere en De Gors wordt bij renovatie regelmatig olietanks aangetroffen. Woningcorporaties in de regio voeren actief saneringsprojecten uit.",
    gemeenteInfo:
      "De gemeente Purmerend verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren onder voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Purmerend?",
        antwoord:
          "Purmerend is grotendeels gebouwd in de jaren '70-'80, een periode waarin olietanks nog veelvuldig werd gebruikt. Vooral in dakbeschot, gevelpanelen en rondom leidingen kan olietanks voorkomen.",
      },
    ],
    nabijeStedenSlugs: ["zaanstad", "amsterdam", "alkmaar"],
  },
  {
    slug: "sittard-geleen",
    naam: "Sittard-Geleen",
    provincieSlug: "limburg",
    provincieNaam: "Limburg",
    inwoners: 92000,
    metaTitle: "Olietankverwijdering Sittard-Geleen - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Sittard-Geleen. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Sittard-Geleen",
    intro:
      "Sittard-Geleen kent als voormalige mijnstreek veel industriële en naoorlogse bebouwing waar olietanks aanwezig kunnen zijn. De chemische industrie (Chemelot) heeft extra bijgedragen aan olietanksgebruik in de regio. Vergelijk hier gecertificeerde olietankverwijderaars.",
    lokaleContext:
      "De mijnbouwgeschiedenis en chemische industrie (DSM/Chemelot) hebben geleid tot veel olietankhoudende bebouwing in Sittard-Geleen. In mijnwerkerswoningen uit de jaren '20-'60 en naoorlogse wijken wordt bij renovatie regelmatig olietanks aangetroffen. Het Chemelot-terrein heeft uitgebreide olietanksanering ondergaan.",
    gemeenteInfo:
      "De gemeente Sittard-Geleen verwerkt sloopmelding via het Omgevingsloket. Het milieubrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in mijnwerkerswoningen in Limburg?",
        antwoord:
          "Veel mijnwerkerswoningen in Zuid-Limburg zijn gebouwd in de periode dat olietanks gangbaar waren. Vooral in isolatie, dakbeschot en rondom verwarmingsleidingen kan olietanks voorkomen. Laat een inventarisatie uitvoeren voor verbouwing.",
      },
    ],
    nabijeStedenSlugs: ["maastricht", "venlo"],
  },
  {
    slug: "hoofddorp",
    naam: "Hoofddorp",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 77000,
    metaTitle: "Olietankverwijdering Hoofddorp - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Hoofddorp. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Hoofddorp",
    intro:
      "Hoofddorp en de Haarlemmermeer groeide sterk vanaf de jaren '60. Veel bedrijfspanden rond Schiphol en woningen uit die periode bevatten olietanks. Vergelijk hier gecertificeerde olietankverwijderaars in Hoofddorp.",
    lokaleContext:
      "In Hoofddorp en de Haarlemmermeer komt olietanks voor in woningen uit de jaren '60-'80 en in de vele bedrijfspanden en kantoren rondom Schiphol. Bij herontwikkeling van bedrijventerreinen is olietanksanering vaak onderdeel van het sloopproces.",
    gemeenteInfo:
      "De gemeente Haarlemmermeer verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Hoofddorp?",
        antwoord:
          "In Hoofddorp en de Haarlemmermeer liggen de kosten tussen de 13 en 35 euro per m2, vergelijkbaar met de regio Amsterdam.",
      },
    ],
    nabijeStedenSlugs: ["haarlem", "amsterdam", "amstelveen", "leiden"],
  },
  {
    slug: "spijkenisse",
    naam: "Spijkenisse",
    provincieSlug: "zuid-holland",
    provincieNaam: "Zuid-Holland",
    inwoners: 73000,
    metaTitle: "Olietankverwijdering Spijkenisse - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Spijkenisse. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Spijkenisse",
    intro:
      "Spijkenisse groeide als groeikern vanaf de jaren '70 explosief. Veel woningen uit die periode bevatten olietankhoudende materialen. Door de nabijheid van Rotterdam zijn er veel gecertificeerde bedrijven beschikbaar. Vergelijk hier olietankverwijderaars in Spijkenisse.",
    lokaleContext:
      "Als groeikern uit de jaren '70-'80 heeft Spijkenisse een groot aandeel woningen uit de olietankperiode. In de Vogelaarwijken en andere naoorlogse buurten wordt bij renovatie regelmatig olietanks aangetroffen. Woningcorporatie Woonbron voert actief saneringsprojecten uit.",
    gemeenteInfo:
      "De gemeente Nissewaard (waaronder Spijkenisse) verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren onder voorwaarden.",
    faq: [
      {
        vraag: "Zit er olietanks in woningen in Spijkenisse?",
        antwoord:
          "Spijkenisse is grotendeels gebouwd in de jaren '70-'80. Veel woningen uit die tijd bevatten olietanks in dakbeschot, gevelpanelen en rondom cv-leidingen. Bij verbouwing is een bodemonderzoek verplicht.",
      },
    ],
    nabijeStedenSlugs: ["rotterdam", "dordrecht", "schiedam"],
  },
  {
    slug: "den-helder",
    naam: "Den Helder",
    provincieSlug: "noord-holland",
    provincieNaam: "Noord-Holland",
    inwoners: 55000,
    metaTitle: "Olietankverwijdering Den Helder - Gecertificeerde bedrijven",
    metaDescription:
      "Vind gecertificeerde olietankverwijderaars in Den Helder. Vergelijk BRL SIKB 7000 bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Den Helder",
    intro:
      "Den Helder kent als marinestad veel naoorlogse bebouwing en defensiegebouwen waar olietanks aanwezig kunnen zijn. De marine-basis en havengebieden hebben een rijke historie met olietankhoudende materialen. Vergelijk hier gecertificeerde olietankverwijderaars in Den Helder.",
    lokaleContext:
      "De marine-basis en scheepsbouwindustrie in Den Helder hebben geleid tot veel olietankhoudende bebouwing. In naoorlogse woonwijken als Nieuw Den Helder en De Schooten wordt bij renovatie regelmatig olietanks aangetroffen. De gemeente heeft een actief sloopbeleid voor oude marinewoningen.",
    gemeenteInfo:
      "De gemeente Den Helder verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Door het beperkte aanbod in de Noordkop kan het lonen om bedrijven uit de bredere regio te vergelijken.",
    faq: [
      {
        vraag: "Zit er olietanks in marinewoningen in Den Helder?",
        antwoord:
          "Veel voormalige marinewoningen in Den Helder zijn gebouwd in de jaren '50-'70 en bevatten regelmatig olietanks. Bij renovatie of sloop is een bodemonderzoek verplicht.",
      },
    ],
    nabijeStedenSlugs: ["alkmaar", "haarlem"],
  },
  {
    slug: "veenendaal",
    naam: "Veenendaal",
    provincieSlug: "utrecht",
    provincieNaam: "Utrecht",
    inwoners: 68000,
    metaTitle: "Olietankverwijdering Veenendaal - Gecertificeerde bedrijven",
    metaDescription:
      "Gecertificeerde olietankverwijderaars in Veenendaal. Vergelijk bedrijven en vraag gratis offertes aan.",
    h1: "Olietankverwijdering in Veenendaal",
    intro:
      "Veenendaal groeide sterk in de naoorlogse periode als industriestadje. De textiel- en tabaksindustrie plaatsten olietanks op grote schaal. Ook in woonwijken uit die tijd wordt regelmatig olietanks gevonden. Vergelijk hier gecertificeerde olietankverwijderaars.",
    lokaleContext:
      "In Veenendaal komt olietanks voor in naoorlogse wijken en voormalige fabrieksgebouwen. De textielindustrie die lang het gezicht van Veenendaal bepaalde, had olietanks als isolatiemateriaal. Bij verbouwing van woningen uit de jaren '50-'80 wordt regelmatig olietanks aangetroffen.",
    gemeenteInfo:
      "De gemeente Veenendaal verwerkt sloopmelding via het Omgevingsloket. Het afvalbrengstation accepteert klein olietankafval van particulieren. Raadpleeg de gemeentewebsite voor actuele voorwaarden.",
    faq: [
      {
        vraag: "Wat kost olietankverwijdering in Veenendaal?",
        antwoord:
          "In Veenendaal liggen de kosten tussen de 11 en 32 euro per m2, vergelijkbaar met de regio Midden-Nederland.",
      },
    ],
    nabijeStedenSlugs: ["utrecht", "amersfoort", "ede", "arnhem"],
  },
];

/** Look up a city by its slug */
export function getStadBySlug(slug: string): StadLandingData | undefined {
  return STEDEN.find((s) => s.slug === slug);
}

/** Look up cities by province slug */
export function getStedenByProvincie(provincieSlug: string): StadLandingData[] {
  return STEDEN.filter((s) => s.provincieSlug === provincieSlug);
}

/** Get all unique province entries from the cities list */
export function getProvincies(): { slug: string; naam: string }[] {
  const seen = new Set<string>();
  const result: { slug: string; naam: string }[] = [];
  for (const stad of STEDEN) {
    if (!seen.has(stad.provincieSlug)) {
      seen.add(stad.provincieSlug);
      result.push({ slug: stad.provincieSlug, naam: stad.provincieNaam });
    }
  }
  return result;
}

/** Get nearby cities with full data, for internal linking */
export function getNabijSteden(
  stadSlug: string,
): StadLandingData[] {
  const stad = getStadBySlug(stadSlug);
  if (!stad) return [];
  return stad.nabijeStedenSlugs
    .map((s) => getStadBySlug(s))
    .filter((s): s is StadLandingData => s !== undefined);
}
