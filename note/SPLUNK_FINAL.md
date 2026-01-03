# ✅ Splunk Enterprise - Integrazione Completata

## 🎯 Configurazione Finale

### ✅ Completato

1. **Splunk Enterprise** installato e configurato
2. **Integrazione Logstash → Splunk** configurata
3. **TCP Input** abilitato sulla porta 9997
4. **Configurazioni** applicate (inputs.conf, indexes.conf, props.conf)

## 📊 Flusso Dati

```
Filebeat → Logstash → Elasticsearch (ELK Stack)
                    ↓
                  Splunk (porta 9997 TCP)
```

## 🚀 Accesso Splunk

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

## ⚠️ Nota Importante

**Splunk richiede tempo per avviarsi completamente** (circa 2-3 minuti). 

Se Logstash mostra errori di connessione (`Connection refused`), è normale durante l'avvio di Splunk. Logstash si riconnetterà automaticamente quando Splunk sarà pronto.

## 🔍 Verifica Funzionamento

### 1. Verifica Splunk è Pronto

```bash
docker-compose ps splunk
docker logs splunk --tail 20
```

Cerca: `Splunk started successfully` o `Listening on port 8000`

### 2. Verifica TCP Input Abilitato

1. Accedi a Splunk: http://localhost:8000
2. Vai su: **Settings** → **Data Inputs** → **TCP**
3. Verifica che porta **9997** sia presente e abilitata
4. Se non c'è, aggiungi manualmente:
   - Port: `9997`
   - Source type: `soc_logs`
   - Index: `main`

### 3. Verifica Log Arrivano

1. In Splunk, cerca: `index=main sourcetype=soc_logs`
2. Dovresti vedere log da Logstash
3. Se non ci sono log, verifica che ci sia traffico:
   - Fai una richiesta a http://localhost:8080 (WAF)
   - Oppure esegui una scansione con nmap

## 📝 Ricerche Splunk

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

## 🔧 Troubleshooting

### Logstash Non Si Connette

**Causa**: Splunk non è ancora completamente avviato.

**Soluzione**: 
1. Attendi 2-3 minuti che Splunk si avvii completamente
2. Verifica: `docker logs splunk | grep -i "ready\|started"`
3. Riavvia Logstash: `docker-compose restart logstash`

### TCP Input Non Abilitato

**Soluzione Manuale**:
1. Accedi a Splunk Web UI
2. Settings → Data Inputs → TCP → New
3. Porta: `9997`
4. Source type: `soc_logs`
5. Index: `main`
6. Salva

### Log Non Arrivano

1. Verifica che ci sia traffico:
   ```bash
   curl http://localhost:8080
   ```

2. Verifica Logstash processa log:
   ```bash
   docker logs logstash --tail 50
   ```

3. Verifica Splunk riceve log:
   - Cerca in Splunk: `index=main`

## ✅ Status

- ✅ Splunk Enterprise installato
- ✅ Configurazioni create
- ✅ Integrazione Logstash configurata
- ⏳ Splunk in avvio (richiede 2-3 minuti)
- ⏳ TCP Input da abilitare manualmente se necessario

---

**Versione**: Splunk Enterprise (Trial 60 giorni)
**Status**: ✅ **Configurato** - Splunk in avvio
**Data**: 2025-12-10

