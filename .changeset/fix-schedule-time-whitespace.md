---
'@eventuras/scribo': patch
---

Fix schedule item handling for trailing whitespace in time values. The editor now trims time strings before storing them, exported markdown removes extra whitespace around the time, and legacy schedule entries with a space before the closing `**` are still parsed correctly.
