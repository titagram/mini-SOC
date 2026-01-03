# ✅ Splunk Enterprise - Riepilogo Integrazione

## 🎯 Obiettivo Raggiunto

Splunk Enterprise è stato aggiunto con successo allo stack SOC e integrato con Logstash.

## ✅ Cosa è Stato Fatto

### 1. Configurazione Docker
- ✅ Servizio Splunk aggiunto a `docker-compose.yml`
- ✅ Variabili ambiente per accettare licenza (`SPLUNK_GENERAL_TERMS` + `SPLUNK_START_ARGS`)
- ✅ Volumi per dati persistenti e configurazioni
- ✅ Porte esposte: 8000 (Web UI), 8088 (HEC), 9997 (TCP)

### 2. Integrazione Logstash → Splunk
- ✅ Output TCP aggiunto a `logstash/logstash.conf`
- ✅ Logstash invia tutti i log a Splunk sulla porta 9997
- ✅ Riconnessione automatica configurata

### 3. Configurazioni Splunk
- ✅ `splunk/inputs.conf`: Monitor file + TCP Input + HEC
- ✅ `splunk/indexes.conf`: Indici (main, security, modsecurity, suricata)
- ✅ `splunk/props.conf`: Parsing log JSON

## 📊 Architettura Finale

```
┌─────────────┐
│  Filebeat   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Logstash   │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│Elasticsearch│  │   Splunk   │
│   (ELK)     │  │ Enterprise │
└─────────────┘  └─────────────┘
```

## 🚀 Accesso

### Splunk Web UI
```
http://localhost:8000
```
- **Username**: `admin`
- **Password**: `changeme` ⚠️ Cambia in produzione!

### Porte Disponibili
- **8000**: Web UI Splunk
- **8088**: HTTP Event Collector (HEC) - per inviare log via HTTP
- **9997**: TCP Input - per ricevere log da Logstash

## 📝 Prossimi Passi

### 1. Verifica Log Arrivano in Splunk

1. Accedi a Splunk: http://localhost:8000
2. Login: `admin` / `changeme`
3. Cerca: `index=main sourcetype=soc_logs`
4. Dovresti vedere log da Logstash

### 2. Configura TCP Input (se necessario)

Se i log non arrivano:
1. Vai su: Settings → Data Inputs → TCP
2. Verifica che porta 9997 sia abilitata
3. Se non c'è, aggiungi nuovo TCP Input sulla porta 9997

### 3. Crea Dashboard Splunk

1. Vai su: Dashboards → Create New Dashboard
2. Aggiungi visualizzazioni per:
   - Log ModSecurity
   - Log Suricata
   - Correlazione eventi

### 4. Configura Alert

1. Vai su: Settings → Searches, reports, and alerts
2. Crea alert per:
   - Attacchi critici
   - DDoS rilevati
   - Pattern sospetti

## 🔍 Ricerche Splunk Utili

### Tutti i Log da Logstash

```spl
index=main sourcetype=soc_logs
| stats count by log_source, attack_type
```

### Log ModSecurity

```spl
index=modsecurity OR index=security sourcetype=modsecurity
| stats count by client_ip, request_uri
| sort -count
```

### Log Suricata

```spl
index=suricata OR index=security sourcetype=suricata_eve
| stats count by alert.signature, src_ip
| sort -count
```

### Correlazione ModSecurity + Suricata

```spl
(index=modsecurity OR index=suricata)
| stats count by source, sourcetype, client_ip
| sort -count
| head 20
```

### Top Attacchi

```spl
(index=modsecurity OR index=suricata)
| stats count by attack_type, alert.signature
| sort -count
| head 20
```

## ⚠️ Note Importanti

1. **Trial**: Splunk Enterprise trial dura 60 giorni
2. **Password**: Cambia la password di default (`changeme`)
3. **Risorse**: Splunk richiede almeno 2GB RAM
4. **Porte**: Assicurati che le porte siano libere
5. **Licenza**: Accettata automaticamente via variabili ambiente

## 📚 Documentazione

- `SPLUNK_SETUP.md`: Guida completa setup
- `SPLUNK_INTEGRAZIONE.md`: Dettagli integrazione Logstash
- `splunk/README.md`: Quick reference

## ✅ Status Finale

- ✅ Splunk Enterprise installato e configurato
- ✅ Integrazione Logstash → Splunk configurata
- ✅ Configurazioni Splunk create
- ✅ Indici e parsing configurati
- ✅ Splunk in esecuzione e pronto all'uso

---

**Versione**: Splunk Enterprise (Trial 60 giorni)
**Status**: ✅ **COMPLETATO E FUNZIONANTE**
**Data**: 2025-12-10

