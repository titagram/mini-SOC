# ✅ Splunk Enterprise - Integrazione Completata

## 🔧 Configurazione Applicata

### 1. Docker Compose
- ✅ Servizio Splunk aggiunto
- ✅ Variabili ambiente per accettare licenza
- ✅ Volumi per log e configurazioni
- ✅ Porte esposte: 8000 (Web UI), 8088 (HEC), 9997 (TCP)

### 2. Logstash → Splunk
- ✅ Output TCP aggiunto a `logstash/logstash.conf`
- ✅ Logstash invia log a Splunk sulla porta 9997
- ✅ Riconnessione automatica configurata

### 3. Configurazioni Splunk
- ✅ `inputs.conf`: Monitor file + TCP Input + HEC
- ✅ `indexes.conf`: Indici (main, security, modsecurity, suricata)
- ✅ `props.conf`: Parsing log JSON

## 📊 Flusso Dati

```
Filebeat → Logstash → Elasticsearch (ELK Stack)
                    ↓
                  Splunk (porta 9997 TCP)
```

## 🚀 Accesso

### Web UI
```
http://localhost:8000
```
- **Username**: `admin`
- **Password**: `changeme` ⚠️ Cambia in produzione!

### Porte
- **8000**: Web UI
- **8088**: HTTP Event Collector (HEC)
- **9997**: TCP Input (per Logstash)

## 🔍 Verifica Integrazione

### 1. Verifica Splunk è Avviato

```bash
docker-compose ps splunk
docker logs splunk --tail 20
```

Cerca: `Splunk started successfully` o `Listening on port 8000`

### 2. Verifica Logstash Connesso

```bash
docker logs logstash --tail 30 | grep -i splunk
```

Dovresti vedere connessioni TCP alla porta 9997.

### 3. Verifica Log in Splunk

1. Accedi a Splunk: http://localhost:8000
2. Login: `admin` / `changeme`
3. Cerca: `index=main sourcetype=soc_logs`
4. Dovresti vedere log da Logstash

## 📝 Ricerche Splunk Utili

### Tutti i Log da Logstash

```spl
index=main sourcetype=soc_logs
| stats count by log_source, attack_type
```

### Log ModSecurity

```spl
index=modsecurity OR index=security sourcetype=modsecurity
| stats count by client_ip, request_uri
```

### Log Suricata

```spl
index=suricata OR index=security sourcetype=suricata_eve
| stats count by alert.signature, src_ip
```

### Correlazione ModSecurity + Suricata

```spl
(index=modsecurity OR index=suricata)
| stats count by source, sourcetype, client_ip
| sort -count
```

## ⚠️ Note Importanti

1. **Licenza**: Splunk Enterprise trial dura 60 giorni
2. **Password**: Cambia la password di default (`changeme`)
3. **Risorse**: Splunk richiede almeno 2GB RAM
4. **Porte**: Assicurati che le porte 8000, 8088, 9997 siano libere

## 🔧 Troubleshooting

### Splunk Non Si Avvia

```bash
# Verifica log
docker logs splunk --tail 50

# Verifica variabili ambiente
docker exec splunk env | grep SPLUNK
```

### Logstash Non Si Connette a Splunk

```bash
# Verifica Splunk è raggiungibile
docker exec logstash ping -c 2 splunk

# Verifica porta TCP
docker exec splunk netstat -tlnp | grep 9997

# Verifica log Logstash
docker logs logstash | grep -i "splunk\|tcp\|9997"
```

### Log Non Arrivano in Splunk

1. Verifica TCP Input è abilitato in Splunk:
   - Settings → Data Inputs → TCP
   - Verifica porta 9997 è attiva

2. Verifica configurazione Logstash:
   ```bash
   docker exec logstash cat /usr/share/logstash/pipeline/logstash.conf | grep -A 5 splunk
   ```

## ✅ Status

- ✅ Splunk Enterprise installato e configurato
- ✅ Integrazione Logstash → Splunk configurata
- ✅ Configurazioni Splunk create
- ✅ Indici e parsing configurati

---

**Versione**: Splunk Enterprise (Trial 60 giorni)
**Status**: ✅ Configurato e pronto all'uso
**Data**: 2025-12-10

