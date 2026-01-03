# 📊 Dashboard Kibana - Riepilogo Completo

## ✅ Cosa Ho Creato

Ho preparato una **guida completa** per creare una dashboard Kibana didattica per il tuo corso di sicurezza.

---

## 📁 File Creati

1. **`DASHBOARD_KIBANA_GUIDA.md`** ⭐
   - Guida passo-passo completa
   - Istruzioni per creare 8 visualizzazioni
   - Configurazione filtri interattivi
   - Query KQL utili per il corso

2. **`kibana/create_dashboard.py`**
   - Script Python per creazione automatica (opzionale)
   - Richiede API Kibana

3. **`kibana/IMPORT_DASHBOARD.md`**
   - Metodi di import rapido
   - Query predefinite

---

## 🎯 Dashboard Include

### Visualizzazioni Principali

1. **📈 Timeline Eventi di Sicurezza**
   - Eventi nel tempo da tutte le sorgenti
   - Breakdown per sorgente log

2. **🎯 Distribuzione Tipi di Minaccia**
   - Pie chart con tutti i tipi di attacco
   - Filtro per escludere "No Attack Detected"

3. **🔍 Sorgente Log**
   - Donut chart: Suricata vs ModSecurity
   - Percentuale eventi per sorgente

4. **🌐 Top IP Sorgenti**
   - Bar chart orizzontale
   - Top 10 IP che generano più eventi

5. **📊 Codici Risposta HTTP**
   - Analisi pattern di risposta
   - Identificazione errori 4xx/5xx

6. **🔗 Top URI Attaccate**
   - Endpoint più targetizzati
   - Solo URI con attacchi rilevati

7. **📋 Tabella Eventi Dettagliata**
   - Tutti i dettagli degli eventi
   - Colonne: timestamp, sorgente, tipo attacco, IP, URI, metodo, codice risposta

8. **🚨 Alert Suricata per Categoria**
   - Alert Suricata raggruppati per categoria
   - Scansioni, DDoS, ecc.

### Filtri Interattivi

- ✅ **Tipo di Minaccia**: Dropdown con tutti i tipi
- ✅ **Sorgente Log**: Suricata / ModSecurity
- ✅ **IP Sorgente**: Filtro per IP specifico

---

## 🎓 Utilizzo Didattico

### Dimostrazione 1: Attacchi Web (ModSecurity)
1. Filtra: `log_source: modsecurity`
2. Mostra distribuzione tipi di minaccia
3. Analizza top URI attaccate
4. Esamina tabella eventi

### Dimostrazione 2: Traffico di Rete (Suricata)
1. Filtra: `log_source: suricata`
2. Mostra alert per categoria
3. Analizza scansioni e DDoS
4. Correla con timeline

### Dimostrazione 3: Correlazione Multi-Sorgente
1. Rimuovi filtri
2. Mostra timeline con breakdown
3. Identifica pattern temporali
4. Correla eventi da entrambe le sorgenti

---

## 📊 Tipi di Minaccia Rilevati

### ModSecurity WAF
- ✅ SQL Injection
- ✅ Cross-Site Scripting (XSS)
- ✅ Local File Inclusion
- ✅ Remote File Inclusion
- ✅ Brute Force / Rate Limiting
- ✅ Security Scanner Detected
- ✅ Directory Enumeration
- ✅ E altri...

### Suricata IDS
- ✅ Port Scans
- ✅ Nmap Scans
- ✅ SYN Flood (DDoS)
- ✅ UDP Flood (DDoS)
- ✅ ICMP Flood (DDoS)
- ✅ High Connection Rate
- ✅ HTTP Attacks (SQLi, XSS, Directory Traversal)
- ✅ Suspicious User-Agents

---

## 🚀 Prossimi Passi

1. **Crea le Data Views** (vedi Step 1 in `DASHBOARD_KIBANA_GUIDA.md`)
2. **Crea le visualizzazioni** (segui guida passo-passo)
3. **Assembla la dashboard** con tutti i pannelli
4. **Configura i filtri** interattivi
5. **Testa con dati reali** generando traffico di test

---

## 📚 Documentazione

- **Guida Completa**: `DASHBOARD_KIBANA_GUIDA.md`
- **Import Rapido**: `kibana/IMPORT_DASHBOARD.md`
- **Script Automatico**: `kibana/create_dashboard.py`

---

## 💡 Suggerimenti per il Corso

1. **Prepara scenari di test** prima della lezione
2. **Genera traffico di attacco** durante la demo
3. **Usa i filtri** per mostrare casi specifici
4. **Correla eventi** tra Suricata e ModSecurity
5. **Mostra la timeline** per pattern temporali

---

**Status**: ✅ Guida completa pronta
**Prossimo Step**: Segui `DASHBOARD_KIBANA_GUIDA.md` per creare la dashboard

