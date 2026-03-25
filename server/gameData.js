const ORTE = [
  {
    id: 1,
    name: "Tiergarten / Zoo",
    emoji: "🦁",
    rollen: ["Löwenpfleger", "Zuckerwatteverkäufer", "Ticketschalter-Mitarbeiter", "Besucher", "Lehrer auf Ausflug", "Tierarzt", "Fotografin", "Schulkind", "Souvenirverkäufer", "Sicherheitspersonal"]
  },
  {
    id: 2,
    name: "Piratenschiff",
    emoji: "🏴‍☠️",
    rollen: ["Kapitän", "Erster Maat", "Steuermann", "Schiffskoch", "Ausguck auf dem Mast", "Gefangener", "Kartograph", "Zimmermann", "Kanonier", "Schatzmeister"]
  },
  {
    id: 3,
    name: "Bäckerei",
    emoji: "🥐",
    rollen: ["Bäckermeister", "Lehrling", "Frühkunde", "Kassiererin", "Konditor", "Brotzulieferer", "Reinigungskraft", "Stammkundin", "Café-Kellnerin", "Gesundheitsinspekteur"]
  },
  {
    id: 4,
    name: "Feuerwache",
    emoji: "🚒",
    rollen: ["Feuerwehrkommandant", "Feuerwehrmann", "Feuerwehrfrau", "Fahrerin des Löschfahrzeugs", "Leitstellen-Disponent", "Sanitäter", "Neue Rekrutin", "Mechaniker", "Pressesprecher", "Ausbildungsleiter"]
  },
  {
    id: 5,
    name: "Mittelalterliche Burg",
    emoji: "🏰",
    rollen: ["König", "Ritter", "Burgfräulein", "Hofnarr", "Schmied", "Wächter am Tor", "Stallknecht", "Köchin", "Bogenschütze", "Burgherold"]
  },
  {
    id: 6,
    name: "Krankenhaus",
    emoji: "🏥",
    rollen: ["Chirurgin", "Krankenpfleger", "Patientenaufnahme", "Röntgentechniker", "Stationsarzt", "Reinigungskraft", "Krankenhausseelsorger", "Hebamme", "Verwaltungsleiter", "Besucherin"]
  },
  {
    id: 7,
    name: "Bauernhof",
    emoji: "🐄",
    rollen: ["Bauer", "Tierärztin", "Erntehelferin", "Traktorfahrer", "Marktverkäuferin", "Käsemacher", "Landmaschinenmechanikerin", "Imker", "Praktikantin", "Großbauer"]
  },
  {
    id: 8,
    name: "Raumstation",
    emoji: "🚀",
    rollen: ["Kommandantin", "Raumfahrtingenieur", "Weltraumforscherin", "Kommunikationstechniker", "Lebenserhaltungsspezialist", "Missionskontrolle am Boden", "Geologin", "Pilot", "Medizinerin", "Robotik-Expertin"]
  },
  {
    id: 9,
    name: "Flughafen",
    emoji: "✈️",
    rollen: ["Pilotin", "Fluglotse", "Bodencrew-Mitglied", "Passagierin", "Sicherheitskontrolleur", "Zollbeamter", "Flugbegleiterin", "Gepäckabfertigerin", "Reisende im Wartebereich", "Flughafenärztin"]
  },
  {
    id: 10,
    name: "Schule",
    emoji: "🏫",
    rollen: ["Lehrerin", "Schüler", "Schuldirektor", "Hausmeister", "Schulkrankenschwester", "Mensa-Köchin", "Elternvertreter", "Sozialarbeiterin", "Praktikant", "Nachhilfelehrer"]
  },
  {
    id: 11,
    name: "Supermarkt",
    emoji: "🛒",
    rollen: ["Marktleiterin", "Kassiererin", "Einräumer", "Fleischer", "Bäckereifachkraft", "Kundin", "Sicherheitsmann", "Warenlieferant", "Promoterin", "Putzkraft"]
  },
  {
    id: 12,
    name: "Bibliothek",
    emoji: "📚",
    rollen: ["Bibliothekarin", "Leserin", "Kinderbetreuer", "Buchbinderin", "IT-Fachkraft", "Schüler mit Hausaufgaben", "Forscher", "Freiwilligenhelfer", "Veranstaltungsorganisatorin", "Auszubildender"]
  },
  {
    id: 13,
    name: "Polizeistation",
    emoji: "🚔",
    rollen: ["Kommissarin", "Streifenpolizist", "Erkennungsdienst-Spezialistin", "Verhörbeamter", "Zeuge", "Verwaltungsangestellte", "Staatsanwältin", "Detektivin", "Fahndungsspezialist", "Sozialarbeiter"]
  },
  {
    id: 14,
    name: "Restaurant",
    emoji: "🍽️",
    rollen: ["Chefkoch", "Kellnerin", "Sous-Chef", "Restaurantleiterin", "Spülkraft", "Sommelier", "Gast", "Kritikerin (inkognito)", "Lieferant", "Azubi"]
  },
  {
    id: 15,
    name: "Zirkus",
    emoji: "🎪",
    rollen: ["Zirkusdirektor", "Trapezakrobatin", "Clown", "Tierdresseur", "Seiltänzerin", "Feuerschlucker", "Musiker", "Kassiererin", "Zeltaufbauer", "Souffleuse"]
  },
  {
    id: 16,
    name: "Hafen / Fischmarkt",
    emoji: "⚓",
    rollen: ["Kapitän des Fischerboots", "Fischhändlerin", "Hafenmeister", "Seemannin", "Lastenträger", "Restaurantköchin", "Zollinspektor", "Tourist", "Bootsmechanikerin", "Marktaufsicht"]
  },
  {
    id: 17,
    name: "Gerichtsgebäude",
    emoji: "⚖️",
    rollen: ["Richterin", "Staatsanwalt", "Verteidigerin", "Angeklagter", "Zeuge", "Gerichtsschreiberin", "Wachtmeister", "Schöffe", "Dolmetscherin", "Pressereporter"]
  },
  {
    id: 18,
    name: "Skigebiet",
    emoji: "⛷️",
    rollen: ["Skilehrer", "Pistenwart", "Liftbetreiberin", "Rettungssanitäter", "Verleiherin im Skishop", "Anfängerskifahrerin", "Bergrestaurant-Kellner", "Schneepflugfahrerin", "Schüler im Skikurs", "Wettkampfläufer"]
  },
  {
    id: 19,
    name: "Autowerkstatt",
    emoji: "🔧",
    rollen: ["Meisterin", "Kfz-Mechaniker", "Lehrling", "Kundin", "TÜV-Prüfer", "Reifenspezialistin", "Kassierer", "Ersatzteillieferant", "Sachverständiger", "Pannenhilfe-Fahrer"]
  },
  {
    id: 20,
    name: "Museum",
    emoji: "🏛️",
    rollen: ["Kuratorin", "Museumsführer", "Sicherheitsbeamter", "Restauratorin", "Schulklassen-Lehrerin", "Ticketverkäufer", "Leihgeberin eines Exponats", "Fotografin", "Reinigungskraft", "Ausstellungsdesignerin"]
  },
  {
    id: 21,
    name: "Wald / Försterhaus",
    emoji: "🌲",
    rollen: ["Försterin", "Holzfäller", "Wandererin", "Wildtierbiologin", "Feuerwehrmann (Waldbrandschutz)", "Jägerin", "Pilzsammler", "Umweltschützer", "Waldarbeiter", "Schulklasse auf Exkursion"]
  },
  {
    id: 22,
    name: "Opernhaus",
    emoji: "🎭",
    rollen: ["Dirigent", "Primaballerina", "Souffleur", "Maskenbildnerin", "Bühnenbildner", "Beleuchtungstechnikerin", "Zuschauerin", "Garderobiere", "Intendant", "Korrepetitor"]
  },
  {
    id: 23,
    name: "Postamt",
    emoji: "📮",
    rollen: ["Schalterbeamtin", "Zusteller", "Paketbotin", "Wartender Kunde", "Filialleiter", "Sortiererin", "Fahrerin", "Briefträgerin", "Auszubildender", "Fremdsprachige Kundin"]
  },
  {
    id: 24,
    name: "Apotheke",
    emoji: "💊",
    rollen: ["Apothekerin", "PTA", "Kundin mit Rezept", "Botendienst-Fahrer", "Vertreterin der Pharmafirma", "Lehrling", "Ärztin am Telefon", "Kassierer", "Reinigungskraft", "Stammkunde"]
  },
  {
    id: 25,
    name: "Surfschule am Meer",
    emoji: "🏄",
    rollen: ["Surflehrer", "Anfängerin", "Rettungsschwimmerin", "Wettkampfsurferin", "Ausrüstungsverleiherin", "Strandcafé-Kellner", "Meteorologin", "Fotograf", "Elternteil am Strand", "Surfbrett-Reparateur"]
  },
  {
    id: 26,
    name: "Weinberg / Weingut",
    emoji: "🍷",
    rollen: ["Winzer", "Sommelière", "Erntehelferin", "Kellermeister", "Weintouristin", "Logistiker", "Fassküfer", "Weinprüfer", "Vermarkter", "Restaurantbesitzerin"]
  },
  {
    id: 27,
    name: "Bergwerk / Mine",
    emoji: "⛏️",
    rollen: ["Minensteiger", "Bergmann", "Sicherheitsinspektorin", "Sprengmeister", "Geologin", "Sanitäter unter Tage", "Technikerin für Grubenbahn", "Neue Minenarbeiterin", "Lüftungsspezialist", "Historikerin (Führung)"]
  },
  {
    id: 28,
    name: "Filmstudio",
    emoji: "🎬",
    rollen: ["Regisseurin", "Hauptdarsteller", "Kamerafrau", "Cutterin", "Maskenbildner", "Beleuchter", "Drehbuchautorin", "Statist", "Produktionsleiterin", "Tonmeister"]
  },
  {
    id: 29,
    name: "Jugendherberge / Hostel",
    emoji: "🛏️",
    rollen: ["Herbergsvater", "Reisende Backpackerin", "Reinigungskraft", "Rezeptionistin", "Gruppenleiter (Schulausflug)", "Koch", "Sicherheitsmann (Nachts)", "Langzeitbewohner", "Touristin", "Wartungshandwerker"]
  },
  {
    id: 30,
    name: "Botanischer Garten",
    emoji: "🌸",
    rollen: ["Botanikerin", "Gärtner", "Führerin", "Schulklassen-Lehrer", "Fotografin", "Gartenarchitektin", "Freiwillige Helferin", "Umweltpädagogin", "Pflanzenkunde-Studentin", "Gartenaufsicht"]
  },
  {
    id: 31,
    name: "Schwimmbad",
    emoji: "🏊",
    rollen: ["Bademeister", "Rettungsschwimmerin", "Schwimmlehrer", "Kassiererin", "Umkleidenkabinen-Aufsicht", "Reinigungskraft", "Schwimmerin im Wettkampf", "Elternteil mit Kind", "Kiosk-Verkäufer", "Wassergymnastik-Kursleiterin"]
  },
  {
    id: 32,
    name: "Wochenmarkt",
    emoji: "🥦",
    rollen: ["Gemüsehändler", "Käseverkäuferin", "Marktleiterin", "Blumenhändler", "Kundin", "Bio-Bäuerin", "Gewürzhändler", "Stadtreiniger", "Straßenmusikant", "Fischverkäuferin"]
  },
  {
    id: 33,
    name: "Arktisforschungsstation",
    emoji: "🧊",
    rollen: ["Expeditionsleiterin", "Klimaforscherin", "Pilotin (Versorgungsflug)", "Meteorologe", "Mechaniker", "Köchin", "Medizinerin", "Biologe", "IT-Spezialistin", "Neue Wissenschaftlerin"]
  },
  {
    id: 34,
    name: "Golfplatz",
    emoji: "⛳",
    rollen: ["Greenkeeper", "Caddie", "Pro-Spielerin", "Golflehrer", "Clubmanagerin", "Greenfeegast", "Fahrzeugvermieter (Golfcart)", "Turnierschiedsrichter", "Platzdesigner", "Kiosk-Pächter"]
  },
  {
    id: 35,
    name: "Pferderennbahn",
    emoji: "🐎",
    rollen: ["Jockei", "Trainer", "Pferdepflegerin", "Buchmacher", "Zuschauerin", "Tierärztin", "Rennbahnkommentator", "Stall-Chef", "Sponsor", "Zeitnehmer"]
  },
  {
    id: 36,
    name: "Notaufnahme",
    emoji: "🚑",
    rollen: ["Notaufnahme-Ärztin", "Triagepflegerin", "Rettungssanitäter", "Patient", "Angehörige", "Sicherheitsmann", "Röntgenassistentin", "Reinigungskraft", "Verwaltungsassistentin", "Neurologin (Konsil)"]
  },
  {
    id: 37,
    name: "Rettungsstation an der Küste",
    emoji: "🛟",
    rollen: ["Rettungsbootkapitän", "Tauchretter", "Einsatzleiterin", "Techniker (Bootswartung)", "Rettungsschwimmerin", "Meteorologin", "Funker", "Freiwilliger Helfer", "Ausbilder", "Strandwächterin"]
  },
  {
    id: 38,
    name: "Stadion",
    emoji: "🏟️",
    rollen: ["Trainer", "Spielerin", "Schiedsrichter", "Ordner", "Kommentatorin", "Sanitäter", "Fanclub-Mitglied", "Stadionsprecher", "Wurst- und Getränkeverkäufer", "Platzwart"]
  },
  {
    id: 39,
    name: "Notariat / Anwaltskanzlei",
    emoji: "📜",
    rollen: ["Notarin", "Rechtsanwältin", "Mandantin", "Rechtsfachwirtin", "Gerichtsvollzieher", "Dolmetscherin", "Auszubildender", "Immobilienmakler (Klient)", "Gerichtsbotin", "Sekretärin"]
  },
  {
    id: 40,
    name: "Jahrmarkt / Volksfest",
    emoji: "🎡",
    rollen: ["Schausteller", "Karussellbetreiberin", "Zuckerwatteverkäufer", "Losbudenmitarbeiter", "Sicherheitspersonal", "Betrunkener Besucher", "Kinderschminke-Künstlerin", "Geisterbahn-Operator", "Festzelt-Kellner", "Feuerspucker"]
  }
];

module.exports = { ORTE };
