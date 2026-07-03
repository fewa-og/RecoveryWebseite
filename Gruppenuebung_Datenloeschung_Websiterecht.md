# Gruppenübung (M231): Datenlöschung & Website-Recht
**Fallstudie: Günther & Guhner AG (Gruppe G)**

* **Einleitendes Motto:** *"OK gooners do you have problems with ARJ? - Yes we do – yeyyy!!"*

---

## 👥 Rollenaufteilung (Gruppe G)
1. **Incident Lead:** **Lele** (Verantwortlich für Vorfalls-Erklärung, betroffene Systeme, Kritikalität)
2. **Recovery Engineer:** **[Name]** (Verantwortlich für RPO/RTO, 6-Schritte-Restore, Prioritäten)
3. **Legal & Communication Officer:** **Fala** (Verantwortlich für Impressum, Disclaimer, AGB, Rechtsvergleich)
4. **Presenter / Moderator:** **[Name]** (Moderation und Q&A-Führung)

---

## 🏢 Steckbrief des Konzerns & Tochtergesellschaften
* **Mutterkonzern:** **Günther & Guhner AG**
* **Sitz / Land:** Briefkasten in Zug, Schweiz (Handelsregister: CHE-111.222.333 MWST)
* **Branche:** Internationales Online-Glücksspiel, Sportwetten, Lotterie und eGaming-Dienstleistungen.
* **Angebot & Tochtergesellschaften (Globale Plattformen):**
  1. **MoneyMaker.com** (Global / Englisch) – Flaggschiff-Online-Casino mit Slots und Live-Tischen.
  2. **CashGrabber.net** (Global / Englisch) – Online-Sportwetten, Arcade-Games und Peer-to-Peer-Turniere.
  3. **GibGeld.de** (Deutschland) – Lizenziertes deutsches Sportwettenportal nach dem Glücksspielstaatsvertrag (GlüStV).
  4. **Trallalero-Dollarla.ch** (Schweiz) – Schweizer Dialekt-Lotterie, Rubbellose und traditionelle Jass-Spiele.
  5. **Dinero-Dinero.mx** (Mexiko) – Südamerikanische Slot- und Bingo-Plattform.
  6. **PonyUp.co.uk** (Grossbritannien) – Spezialisiertes Portal für Pferderennwetten.
  7. **Fric-Frac.fr** (Frankreich) – Virtuelle Kartenspiele und Pokerräume.
  8. **KronaKicker.se** (Schweden) – Skandinavische Casino- und Jackpot-Plattform.
  9. **VinciVeloce.it** (Italien) – Italienisches Portal für Sofortgewinnspiele und Rubbellose.

* **Gemeinsames IT-Setup:** 
  Der Konzern betreibt eine zentralisierte Mandanten-Plattform (SaaS). Während der Web-Code (HTML5-Spiele, Benutzeroberfläche, Client-Grafiken) als statische Dateien auf verteilten Webservern (CDN) abgelegt ist, laufen alle kritischen Geschäftsdaten (Echtgeld-Wallets, Registrierungen, API-Schlüssel, KYC-Dokumente und Spielprotokolle) in einer zentralen, hochperformanten PostgreSQL-Datenbank im Hauptrechenzentrum in Zug.

---

## 1. Incident Summary & Kritikalität (Incident Lead: Lele)

### Kurzbeschreibung des Vorfalls
Am 3. Juli 2026 kam es bei der Günther & Guhner AG durch ein fehlerhaftes, automatisierte Skript während eines System-Updates zu einer schwerwiegenden Korruption der zentralen PostgreSQL-Datenbank. Beim anschliessenden **Restore**-Versuch stellte sich heraus, dass das automatisierte Sicherungssystem lediglich ein **File-Level Backup** der statischen Spiel-Assets und Web-Verzeichnisse der Tochterfirmen durchgeführt hatte, die eigentliche Datenbank (inklusive aller Wallets und Spieldaten) jedoch im Backup fehlte. Da kein automatisierter **Restore-Test** durchgeführt wurde und somit die **Retention**-Richtlinie für die Datenbank fehlschlug, mussten alle neun weltweiten Plattformen offline genommen werden. Das **RTO** (Wiederherstellungszeit) erhöht sich massiv, da Guthaben und Transaktionen manuell aus Caches und API-Logs rekonstruiert werden müssen, was das angestrebte **RPO** (maximal akzeptabler Datenverlust) von wenigen Sekunden verletzt.

### Welche Systeme und Daten sind betroffen?
Ohne die Datenbank und die Konfigurationsdateien sind praktisch alle geschäftskritischen Informationen vernichtet oder unzugänglich:
* **Spieler- und Kontodaten:** Logins, Passwörter (gehasht), persönliche Daten, der aktuelle KYC-Status (Identitäts- und Altersprüfung), VIP-Level und aktive Bonus-Fortschritte.
* **Finanz- und Transaktionsdaten (Das Herzstück):** Die aktuellen Kontostände (Echtgeld- und Bonus-Wallets) aller Spieler, laufende oder ausstehende Ein- und Auszahlungen sowie die komplette historische Transaktionshistorie.
* **Spielstände & Wett-Historie:** Offene Wetten (z.B. bei laufenden Sportevents), pausierte Casino-Runden, gespeicherte RNG-Logs (Zufallsgenerator-Protokolle) und der aktuelle Stand von hauseigenen progressiven Jackpots.
* **System- & API-Konfigurationen:** Die kritischen Verbindungsschlüssel (API-Keys) zu externen Spieleanbietern (wie Evolution, NetEnt), Payment-Providern (Kreditkarten, E-Wallets, Krypto) und Affiliate-Tracking-Systemen.
* **Compliance- und Audit-Logs:** Sämtliche Aufzeichnungen über Spielerverhalten, Limits (Responsible Gaming) und Finanzflüsse, die aus rechtlichen Gründen gespeichert werden müssen.

### Warum ist das kritisch?
In der Online-Glücksspielbranche ist dieser Vorfall nicht nur ein technisches Problem, sondern ein potenziell existenzvernichtendes Ereignis.
* **Massiver Vertrauensverlust & Reputationsschaden:** Im Casino-Geschäft ist Vertrauen die einzige Währung. Wenn das System nach einem Ausfall online geht und die Kontostände der Spieler auf Null stehen (oder das System tagelang down bleibt), ist der Ruf dauerhaft ruiniert. Spieler werden sofort in Foren und auf Social Media vor Ihrem Casino warnen ("Scam", "Exit Scam").
* **Finanzieller Ruin und Haftungsrisiken:** Die Spieler werden ihr Geld zurückfordern. Ohne die Datenbank wissen Sie jedoch nicht mehr, wem wie viel Geld gehört. Zahlen Sie auf Zuruf aus, öffnen Sie Betrügern Tür und Tor. Verweigern Sie die Auszahlung, riskieren Sie eine Flut an Klagen. Zudem entgehen Ihnen für jede Minute Downtime massive Umsätze.
* **Sofortiger Verlust der Glücksspiellizenz:** Regulierungsbehörden (wie die ESBK in der Schweiz, die MGA in Malta oder die UKGC) verstehen bei mangelhaftem Disaster Recovery keinen Spass. Der Verlust von Kundengeldern, Transaktionsdaten und Responsible-Gaming-Einstellungen führt in der Regel zum sofortigen Entzug der Lizenz und zu massiven Strafzahlungen.
* **Operativer Totalausfall:** Die reinen Programmdateien nützen Ihnen nichts, wenn die Anwendung nicht weiss, mit welchen APIs oder Payment-Providern sie sprechen soll. Sie können keine Spiele laden und keine Zahlungen abwickeln. Ohne die Datenbank ist Ihr Geschäftsmodell physisch nicht mehr handlungsfähig.

---

## 2. Recovery Plan (Recovery Engineer)

### RPO / RTO definieren
* **RPO (Recovery Point Objective):**  
  Da ständig neue Spieler:innendaten in der Datenbank gespeichert werden, hat unsere Firma eine sehr kurze RPO von wenigen Minuten. In diesem Vorfall können wir aber nur das letzte Datenbankbackup nutzen, was mehrere Wochen alt ist.
* **RTO (Recovery Time Objective):**  
  Die Downtime ist so kurz wie möglich zu halten. Jede Minute zählt. Basierend darauf, ob noch alte Backups, Logs, Caches bestehen und wiederhergestellt werden können, müssen wir leider mit **1-2 Tagen** rechnen.

### Schritt-für-Schritt Plan (Recovery Steps)
1. **Überprüfen, ob noch versteckte Backups, Replicas, Snapshots vorhanden sind:**  
   Vielleicht gibt es noch Caches in Redis oder anderen Services aus denen noch Daten geholt werden können. Die Datenbank Logs (PostgreSQL) können Informationen zum Datenbankschema und wiederherstellbaren Daten geben. Vielleicht haben Programmierer:innen noch eine lokale Kopie der Datenbank.
2. **Datenbankschema wiederherstellen:**  
   Aus Backend-Code (& SQL-Skripte) und ERDs/ERMs kann versucht werden, das Datenbankschema wiederherzustellen. Da unsere Software EF nutzt, kann der Database Context und Migrations genutzt werden.
3. **Daten wiederherstellen:**  
   Aus Logs und Caches kann versucht werden noch Daten zu retten. Da unsere Software PostgreSQL nutzt können die WAL (Write-Ahead Logs) durchsucht werden nach Daten. Unsere User:innen können sich neu registrieren und uns so helfen, ihre Kontodaten wiederherzustellen.
4. **Datenbank neu erstellen:**  
   Schema erstellen, Daten einfügen, Integrität überprüfen.
5. **Applikationsverbindung überprüfen:**  
   Die neu erstellte Datenbank wird zuerst in einer Sandboxumgebung in der Applikation getestet, bevor sie in die Produktion deployed wird.
6. **Post-Recovery:**  
   Wiederhergestellte Daten werden mit dem letzten bekannten Stand verglichen (letzte bekannte Userdaten, Kontostände...). Backup-Skripts anpassen und einen Datenbank-Dump (pg_dump) machen.

### Prioritätenliste
1. **Kontodaten:** Username, Passwort, Geburtsjahr, AHV-Nr., Blutgruppe...
2. **Finanzdaten:** Kreditkartenangaben, Banküberweisungen...
3. **In-Game Guthaben:** Letzte Slotmachine Resultate, offene Wetten, Jackpotstände...
4. **Logs und Audit Trails:** Für die Systemüberwachung, aber nicht kritisch für den unmittelbaren Betrieb.

---

## 3. Öffentliches Statement (Legal & Communication Officer: Fala)

> **Wichtige Information der Günther & Guhner AG für alle unsere Spieler**
>
> Aufgrund einer technischen Störung unserer Datenbankinfrastruktur sind die Webseiten unserer Plattformen (u.a. MoneyMaker.com, CashGrabber.net, GibGeld.de, Trallalero-Dollarla.ch) vorübergehend nicht erreichbar. Wir versichern Ihnen, dass Ihre Guthaben und persönlichen Daten absolut sicher sind. Es liegt kein Hackerangriff oder unbefugter Zugriff von aussen vor.
>
> **Was Sie wissen müssen:**
> * **Ihre Guthaben:** Alle Echtgeldkonten werden derzeit in Zusammenarbeit mit unseren Zahlungsdienstleistern lückenlos verifiziert und wiederhergestellt.
> * **Auszahlungen:** Laufende Auszahlungen verzögern sich um bis zu 48 Stunden.
>
> Sie müssen nicht aktiv werden. Wir informieren Sie auf unserer Statusseite stündlich über den Fortschritt. Wir danken Ihnen aufrichtig für Ihr Verständnis.

*(Wortanzahl: 104 Wörter)*

---

## 4. Website Legal Pack (Legal & Communication Officer: Fala)

### 4A. Impressum (Vollständige Version)
* **Herausgeberin:** Günther & Guhner AG
* **Adresse:** Poststrasse 12, 6300 Zug, Schweiz
* **Sitz / Rechtsform:** Zug, Aktiengesellschaft (AG) nach Schweizer Recht
* **Kontakt:** compliance@guenther-guhner.ch | Tel: +41 41 555 11 22
* **Vertretung:** Femi Ogunsola (CEO & Verwaltungsrat)
* **Konzessionsbehörde:** Eidgenössische Spielbankenkommission (ESBK), Schweiz
* **Konzessionsnummer:** Nr. 516-123-01
* **Handelsregister-Eintrag:** Kanton Zug, Firmennummer: CHE-111.222.333 MWST
* **Gerichtsstand:** Zug, Schweiz

### 4B. Disclaimer (Haftungsausschluss)
**Haftungsausschluss bei Spielunterbrechungen, Systemfehlern und Datenverlust**
Die Günther & Guhner AG sowie ihre Tochtergesellschaften bemühen sich um eine bestmögliche Verfügbarkeit der angebotenen Glücksspieldienste. Dennoch können technische Störungen, Wartungsarbeiten oder Leitungsunterbrüche zu temporären Systemausfällen führen.
Jegliche Haftung für entgangene Spielgewinne, hypothetische Wettgewinne oder Schäden, die aus abgebrochenen Spielrunden und unvollständigen Datenbankeinträgen entstehen, wird im gesetzlich zulässigen Rahmen (Art. 100 OR) wegbedungen. Im Falle von Systemfehlern oder Fehlfunktionen des Zufallsgenerators (RNG) werden alle betroffenen Spielrunden als ungültig ("void") erklärt und die Einsätze dem Spielerkonto zurückerstattet.

### 4C. AGB: 3 Klauseln
* **Klausel 1: Stornierung bei Software- und Systemstörungen ("Void in Event of Malfunction")**  
  Eine Fehlfunktion der Spielsoftware, des Zufallsgenerators (RNG), des Netzwerks oder ein Datenbankausfall macht alle laufenden Spielrunden und Gewinne ungültig. In solchen Fällen wird der ursprüngliche Einsatz der betroffenen Runde dem Spielerkonto gutgeschrieben. Weitergehende Ansprüche auf hypothetische Gewinne oder Folgeschäden sind ausgeschlossen.
* **Klausel 2: Saldenprüfung & massgebende Transaktionsdaten**  
  Die Anzeige des Guthabens im Web-Browser des Spielers ist unverbindlich. Im Falle von Abweichungen, die durch Verbindungsunterbrüche oder Datenbankstörungen entstehen, sind ausschliesslich die auf den zentralen Backup- und Audit-Servern der Günther & Guhner AG verifizierten Transaktionsdaten massgebend. Unstimmigkeiten müssen innert 7 Tagen schriftlich gerügt werden.
* **Klausel 3: Spielerschutz & Kontosicherheit**  
  Der Spieler ist verpflichtet, seine Zugangsdaten geheim zu halten. Die Günther & Guhner AG empfiehlt zur Erhöhung der Sicherheit dringend die Aktivierung der Zwei-Faktor-Authentisierung (2FA). Das Spielerkonto darf nur durch die registrierte Person genutzt werden. Wir behalten uns vor, Konten bei Verdacht auf Fremdnutzung oder Verletzung der Responsible-Gaming-Richtlinien temporär zu sperren.

---

## 5. Vergleich CH vs. DE/EU (Legal & Communication Officer: Fala)

| Thema | Schweiz (DSG / Geldspielgesetz BGS) | Deutschland / EU (DSGVO / GlüStV / BGB) | Bedeutung für unseren Fall (Günther & Guhner AG) |
| :--- | :--- | :--- | :--- |
| **Impressumspflicht** | Geregelt nach Art. 3 Abs. 1 lit. s UWG sowie durch ESBK-Auflagen. Zwingende Angabe der Schweizer Konzessionsnummer erforderlich. | Sehr streng nach § 5 DDG und den Vorgaben des Glücksspielstaatsvertrags (GlüStV). Verstösse führen zu hohen Bussgeldern und Abmahnungen. | Da die Tochterfirma `GibGeld.de` deutsche Spieler anspricht, muss das Impressum dieser Domain zwingend den strengen deutschen Vorgaben und dem GlüStV genügen. |
| **Disclaimer & Haftung** | Haftungsausschluss für Systemausfälle und entgangene Gewinne ist gemäss Art. 100 OR weitgehend zulässig (Ausschluss für leichte/mittlere Fahrlässigkeit). | Klauselkontrolle nach § 307 BGB. Ein pauschaler Ausschluss bei Datenverlust oder ungültigen Spielrunden kann als unangemessene Benachteiligung unwirksam sein. | Der "Void-Disclaimer" schützt uns in der Schweiz gut. Für deutsche Spieler auf `GibGeld.de` müssen wir sicherstellen, dass die Rückerstattung der Einsätze explizit garantiert ist, um die Klauselkontrolle in der EU zu bestehen. |
| **AGB / Gerichtsstand** | Gerichtsstand kann im B2B- und bedingt im B2C-Bereich am Sitz des Anbieters (Zug) vereinbart werden. Es gilt Schweizer Recht und das BGS. | Im Verbraucherrecht der EU sind Gerichtsstandsklauseln in AGB gegenüber Verbrauchern unwirksam; es gilt der Wohnsitz des Spielers. | Wenn EU-Spieler auf den Portalen zugelassen sind, können wir den Gerichtsstand Zug nicht standardmässig durchsetzen. Für `GibGeld.de` gilt deutsches Recht, für `Trallalero-Dollarla.ch` gilt Schweizer Recht. |
