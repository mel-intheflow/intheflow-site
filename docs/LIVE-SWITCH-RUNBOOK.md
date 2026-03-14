# Live Switch Runbook (beta -> production)

Ziel: `/beta` sicher auf `/` promoten, ohne Datenverlust und mit klarem Rollback.

## Voraussetzungen
- Melanie bestätigt: Inhalte in `/beta` final.
- Letzter Deploy in GitHub Actions auf `main` ist **success**.
- FTP-Zugang funktionsfähig.
- Wartungsfenster von ~15 Minuten eingeplant.

## Pfadmodell
- Aktuell live: `/`
- Kandidat: `/beta/`
- Backup-Ziel: `/backup-YYYYMMDD-HHMM/`

---

## Schritt 1 — Preflight Check
1. Prüfen, dass `/beta/` aktuell ist (stichprobenartig Seite + Bilder + Kontakt + CMS-Änderung).
2. Prüfen, dass `content/home.json` auf `/beta` den erwarteten Stand hat.
3. Health-URLs notieren:
   - `https://intheflow.at/`
   - `https://intheflow.at/impressum.html`
   - `https://intheflow.at/datenschutz.html`

## Schritt 2 — Backup der Live-Seite
1. Auf FTP anlegen: `/backup-YYYYMMDD-HHMM/`
2. Gesamten aktuellen Inhalt aus `/` nach Backup kopieren (ohne `/beta` doppelt zu verschieben).
3. Stichprobe: Backup enthält `index.html`, `assets/`, `images/`, rechtliche Seiten.

## Schritt 3 — Promote beta nach live
1. Inhalt in `/` kontrolliert ersetzen mit Inhalt aus `/beta/`.
2. **Wichtig:** `/beta` vorerst bestehen lassen (mind. 24–48h) für schnellen Vergleich/Rollback.
3. Dateirechte prüfen:
   - Verzeichnisse: `755`
   - Dateien: `644`

## Schritt 4 — Smoke Test (Pflicht)
Direkt nach Switch testen:
1. `https://intheflow.at/` lädt korrekt
2. Bilder laden korrekt
3. Navigation + Sprunglinks funktionieren
4. `impressum.html` + `datenschutz.html` erreichbar
5. Kontakt/WhatsApp-Link funktioniert

## Schritt 5 — Post-Switch Beobachtung
- In den ersten 24h auf offensichtliche Layout-/Inhaltsfehler prüfen.
- `/beta` bleibt online als Referenz.

---

## Rollback-Plan (wenn nötig)
Wenn kritischer Fehler auf Live:
1. Aktuellen `/` Stand nach `/failed-YYYYMMDD-HHMM/` sichern.
2. Backup `/backup-YYYYMMDD-HHMM/` zurück nach `/` kopieren.
3. Smoke Test erneut fahren.
4. Fehler in `/beta` beheben, erst danach neuer Promote.

---

## Verantwortlichkeiten
- Freigabe „Go Live": Mario/Melanie
- Ausführung Deploy/Promote: Kaiman
- Abnahme nach Switch: Mario + Melanie

## Done-Kriterium
- Live-Seite entspricht Beta-Inhalt
- Smoke-Test vollständig grün
- Backup + Rollback-Pfad dokumentiert
