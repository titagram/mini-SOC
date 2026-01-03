# 📊 Guida Creazione Dashboard Kibana - Security SOC

## 🎯 Obiettivo

Creare una dashboard Kibana completa e didattica per visualizzare:
- ✅ **Suricata IDS**: Alert di rete, scansioni, DDoS
- ✅ **ModSecurity WAF**: Attacchi web (SQLi, XSS, Brute Force)
- ✅ **Filtri interattivi**: Tipo di minaccia, sorgente log, IP
- ✅ **Visualizzazioni didattiche**: Per uso in corso

---

## 📋 Prerequisiti

1. ✅ Kibana accessibile su http://localhost:5601
2. ✅ Elasticsearch con dati (Suricata e ModSecurity)
3. ✅ Data Views create (vedi Step 1)

---

## 🚀 Step 1: Creare Data Views

### Data View Unificata (Consigliata)

1. Vai su **Stack Management** → **Data Views** → **Create data view**
2. Compila:
   - **Name**: `Security SOC`
   - **Index pattern**: `suricata-logs-*,modsec-logs-*`
   - **Timestamp field**: `@timestamp`
3. Clicca **Save data view to Kibana**

### Data View Separate (Opzionale)

**Suricata Logs**:
- **Name**: `Suricata Logs`
- **Index pattern**: `suricata-logs-*`
- **Timestamp**: `@timestamp`

**ModSecurity Logs**:
- **Name**: `ModSecurity Logs`
- **Index pattern**: `modsec-logs-*`
- **Timestamp**: `@timestamp`

---

## 📊 Step 2: Creare Visualizzazioni

### 1. 📈 Timeline Eventi di Sicurezza

**Scopo**: Mostrare eventi nel tempo da tutte le sorgenti

1. Vai su **Analytics** → **Visualize Library** → **Create visualization**
2. Seleziona **Lens**
3. Seleziona data view **Security SOC**
4. Configura:
   - **X-axis**: Trascina `@timestamp` → Seleziona **Date Histogram**
   - **Y-axis**: Automatico (Count)
   - **Breakdown**: Trascina `log_source.keyword` → Seleziona **Top 5 values**
5. Clicca **Save** → Nome: `Timeline Eventi di Sicurezza`

---

### 2. 🎯 Distribuzione Tipi di Minaccia

**Scopo**: Mostrare quali attacchi sono più frequenti

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Pie chart**
   - **Slice by**: `attack_type.keyword`
   - **Size by**: Count
   - **Filter**: `attack_type.keyword: * AND NOT attack_type.keyword: "No Attack Detected" AND NOT attack_type.keyword: "Unknown/Analyst Review"`
4. Clicca **Save** → Nome: `Distribuzione Tipi di Minaccia`

---

### 3. 🔍 Sorgente Log (Suricata vs ModSecurity)

**Scopo**: Mostrare da dove arrivano gli eventi

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Donut chart**
   - **Slice by**: `log_source.keyword`
   - **Size by**: Count
4. Clicca **Save** → Nome: `Sorgente Log`

---

### 4. 🌐 Top IP Sorgenti

**Scopo**: Identificare IP che generano più eventi

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Bar chart horizontal**
   - **X-axis**: Count
   - **Y-axis**: `client_ip.keyword` (Top 10)
   - **Filter**: `client_ip.keyword: *`
4. Clicca **Save** → Nome: `Top IP Sorgenti`

---

### 5. 📊 Codici Risposta HTTP

**Scopo**: Analizzare pattern di risposta

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Bar chart**
   - **X-axis**: `response_code.keyword`
   - **Y-axis**: Count
   - **Filter**: `response_code.keyword: *`
4. Clicca **Save** → Nome: `Codici Risposta HTTP`

---

### 6. 🔗 Top URI Attaccate

**Scopo**: Vedere quali endpoint sono più targetizzati

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Bar chart horizontal**
   - **X-axis**: Count
   - **Y-axis**: `request_uri.keyword` (Top 10)
   - **Filter**: `request_uri.keyword: * AND attack_type.keyword: * AND NOT attack_type.keyword: "No Attack Detected"`
4. Clicca **Save** → Nome: `Top URI Attaccate`

---

### 7. 📋 Tabella Eventi Dettagliata

**Scopo**: Tabella con tutti i dettagli degli eventi

1. **Create visualization** → **Lens**
2. Seleziona **Security SOC**
3. Configura:
   - **Chart type**: **Table**
   - **Columns**: 
     - `@timestamp`
     - `log_source.keyword`
     - `attack_type.keyword`
     - `client_ip.keyword`
     - `request_uri.keyword`
     - `http_method.keyword`
     - `response_code.keyword`
   - **Filter**: `attack_type.keyword: * AND NOT attack_type.keyword: "No Attack Detected"`
4. Clicca **Save** → Nome: `Tabella Eventi Dettagliata`

---

### 8. 🚨 Alert Suricata per Categoria

**Scopo**: Visualizzare alert Suricata per tipo

1. **Create visualization** → **Lens**
2. Seleziona **Suricata Logs**
3. Configura:
   - **Chart type**: **Bar chart**
   - **X-axis**: `alert.category.keyword`
   - **Y-axis**: Count
   - **Filter**: `event_type: alert AND alert.category.keyword: *`
4. Clicca **Save** → Nome: `Alert Suricata per Categoria`

---

## 🎨 Step 3: Creare la Dashboard

1. Vai su **Analytics** → **Dashboards** → **Create dashboard**
2. Clicca **Add panels** → **Add existing visualization**
3. Aggiungi tutte le visualizzazioni create:
   - Timeline Eventi di Sicurezza
   - Distribuzione Tipi di Minaccia
   - Sorgente Log
   - Top IP Sorgenti
   - Codici Risposta HTTP
   - Top URI Attaccate
   - Tabella Eventi Dettagliata
   - Alert Suricata per Categoria

4. **Ridimensiona e posiziona** i pannelli:
   ```
   [Filtri Superiori - Full Width]
   [Timeline] [Distribuzione Minacce]
   [Sorgente] [Top IP] [Codici Risposta]
   [Top URI] [Tabella Eventi]
   [Alert Suricata - Full Width]
   ```

5. **Aggiungi Filtri Interattivi**:
   - Clicca **Add filter** in alto
   - Crea filtri per:
     - `attack_type.keyword` → **Tipo di Minaccia**
     - `log_source.keyword` → **Sorgente Log**
     - `client_ip.keyword` → **IP Sorgente**

6. **Configura Time Range**:
   - Imposta default: **Last 24 hours**
   - Abilita **Auto-refresh**: 30 secondi

7. Clicca **Save** → Nome: `🛡️ Security SOC Dashboard`

---

## 🎯 Step 4: Filtri Avanzati per il Corso

### Filtro per Tipo di Minaccia

Crea filtri predefiniti per dimostrazioni:

1. **SQL Injection**:
   ```
   attack_type.keyword: "SQL Injection"
   ```

2. **Cross-Site Scripting**:
   ```
   attack_type.keyword: "Cross-Site Scripting"
   ```

3. **Brute Force**:
   ```
   attack_type.keyword: "Brute Force / Rate Limiting" OR attack_type.keyword: "Potential Brute Force"
   ```

4. **Security Scanner**:
   ```
   attack_type.keyword: "Security Scanner Detected" OR log_source.keyword: "suricata" AND alert.signature: *nmap*
   ```

5. **DDoS (Suricata)**:
   ```
   log_source.keyword: "suricata" AND alert.category: "Attempted Denial of Service"
   ```

---

## 📚 Query KQL Utili per il Corso

### Tutti gli Attacchi
```kql
attack_type.keyword: * AND NOT attack_type.keyword: "No Attack Detected" AND NOT attack_type.keyword: "Unknown/Analyst Review"
```

### Solo Alert Critici
```kql
(attack_type.keyword: "SQL Injection" OR attack_type.keyword: "Cross-Site Scripting" OR attack_type.keyword: "Remote Code Execution") AND log_source.keyword: "modsecurity"
```

### Eventi da IP Specifico
```kql
client_ip.keyword: "192.168.1.100"
```

### Scansioni di Porte (Suricata)
```kql
log_source.keyword: "suricata" AND alert.signature: *Scan*
```

### DDoS Rilevati
```kql
log_source.keyword: "suricata" AND (alert.signature: *Flood* OR alert.signature: *DDoS*)
```

### Richieste con Errori 4xx/5xx
```kql
response_code.keyword: >= 400 AND attack_type.keyword: *
```

---

## 🎓 Utilizzo Didattico

### Dimostrazione 1: Analisi Attacchi Web
1. Applica filtro: `log_source.keyword: "modsecurity"`
2. Mostra "Distribuzione Tipi di Minaccia"
3. Filtra per tipo specifico (es. SQL Injection)
4. Analizza "Top URI Attaccate" e "Tabella Eventi"

### Dimostrazione 2: Analisi Traffico di Rete
1. Applica filtro: `log_source.keyword: "suricata"`
2. Mostra "Alert Suricata per Categoria"
3. Filtra per scansioni o DDoS
4. Analizza timeline e IP sorgenti

### Dimostrazione 3: Correlazione Multi-Sorgente
1. Rimuovi tutti i filtri
2. Mostra "Timeline Eventi" con breakdown per sorgente
3. Identifica pattern temporali
4. Correla eventi Suricata e ModSecurity

---

## 🔧 Troubleshooting

### Non vedo dati nella dashboard
1. Verifica time range (imposta "Last 24 hours" o più)
2. Controlla che i container siano attivi:
   ```bash
   docker-compose ps
   ```
3. Verifica che ci siano dati in Elasticsearch:
   ```bash
   curl "http://localhost:9200/_cat/indices?v" | grep -E "suricata|modsec"
   ```

### Visualizzazioni vuote
1. Verifica che i campi esistano nei dati
2. Controlla i filtri applicati
3. Prova a rimuovere i filtri temporaneamente

### Filtri non funzionano
1. Verifica che i campi siano di tipo `keyword` (non `text`)
2. Ricarica la dashboard
3. Controlla la sintassi KQL

---

## ✅ Checklist Finale

- [ ] Data Views create
- [ ] 8 visualizzazioni create
- [ ] Dashboard creata con tutti i pannelli
- [ ] Filtri interattivi configurati
- [ ] Time range impostato
- [ ] Auto-refresh abilitato
- [ ] Dashboard salvata e accessibile

---

## 🎯 Risultato Finale

Avrai una dashboard completa con:
- ✅ Panoramica temporale degli eventi
- ✅ Analisi per tipo di minaccia
- ✅ Identificazione IP e URI sospetti
- ✅ Filtri interattivi per analisi approfondite
- ✅ Visualizzazioni didattiche per il corso

**URL Dashboard**: http://localhost:5601/app/dashboards#/view/security-soc-dashboard

---

**Data Creazione**: 2025-12-10
**Versione Kibana**: 8.13.0
**Status**: ✅ Pronto per uso didattico

