# ✅ Integrazione Splunk - Logstash Configurata

## 🔧 Configurazione Applicata

### Logstash Output a Splunk

Aggiunto output TCP a `logstash/logstash.conf`:

```ruby
output {
  # Output esistente a Elasticsearch
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "%{[@metadata][beat]}-%{+YYYY.MM.dd}"
  }
  
  # NUOVO: Output a Splunk via TCP
  tcp {
    host => "splunk"
    port => 9997
    codec => json_lines
    reconnect_interval => 5
  }
}
```

## 📊 Flusso Dati

```
Filebeat → Logstash → Elasticsearch (ELK Stack)
                    ↓
                  Splunk (porta 9997)
```

### Sorgenti Log

1. **ModSecurity (WAF)**:
   - Filebeat legge `/var/log/modsecurity/modsec_audit.log`
   - Logstash processa e invia a Elasticsearch + Splunk

2. **Suricata (IDS)**:
   - Filebeat-Suricata legge `/var/log/suricata/eve.json`
   - Logstash processa e invia a Elasticsearch + Splunk

## ✅ Verifica Integrazione

### 1. Verifica Splunk è Avviato

```bash
docker-compose ps splunk
docker logs splunk --tail 20
```

Cerca: `Splunk started successfully`

### 2. Verifica Logstash Connesso a Splunk

```bash
docker logs logstash --tail 30 | grep -i splunk
```

Dovresti vedere connessioni TCP alla porta 9997.

### 3. Verifica Log in Splunk

1. Accedi a Splunk: http://localhost:8000
2. Login: `admin` / `changeme`
3. Cerca: `index=main sourcetype=soc_logs`
4. Dovresti vedere log da Logstash

### 4. Verifica Log ModSecurity in Splunk

```spl
index=modsecurity OR index=security sourcetype=modsecurity
| stats count by client_ip, request_uri
```

### 5. Verifica Log Suricata in Splunk

```spl
index=suricata OR index=security sourcetype=suricata_eve
| stats count by alert.signature, src_ip
```

## 🔍 Troubleshooting

### Splunk Non Riceve Log

1. **Verifica Splunk è in ascolto sulla porta 9997**:
   ```bash
   docker exec splunk netstat -tlnp | grep 9997
   ```

2. **Verifica Logstash si connette**:
   ```bash
   docker logs logstash | grep -i "splunk\|tcp\|9997"
   ```

3. **Verifica configurazione TCP Input in Splunk**:
   - Vai su: Settings → Data Inputs → TCP
   - Verifica che porta 9997 sia abilitata

### Logstash Non Si Connette

1. **Verifica Splunk è raggiungibile**:
   ```bash
   docker exec logstash ping -c 2 splunk
   ```

2. **Verifica configurazione Logstash**:
   ```bash
   docker exec logstash cat /usr/share/logstash/pipeline/logstash.conf | grep -A 5 splunk
   ```

3. **Riavvia Logstash**:
   ```bash
   docker-compose restart logstash
   ```

## 📝 Ricerche Splunk Utili

### Tutti i Log da Logstash

```spl
index=main sourcetype=soc_logs
| stats count by log_source, attack_type
```

### Correlazione ModSecurity + Suricata

```spl
(index=modsecurity OR index=suricata) 
| stats count by source, sourcetype, client_ip
| sort -count
```

### Top Attacchi

```spl
(index=modsecurity OR index=suricata)
| stats count by attack_type, alert.signature
| sort -count
| head 20
```

## 🎯 Prossimi Passi

1. ✅ Splunk avviato
2. ✅ Logstash configurato per inviare a Splunk
3. ⏳ Verifica log arrivano in Splunk
4. ⏳ Crea dashboard Splunk per visualizzare i log
5. ⏳ Configura alert in Splunk

---

**Status**: ✅ Integrazione configurata
**Data**: 2025-12-10

