# 🔧 Fix Log Suricata - Problema Risolto

## ❌ Problema Identificato

I log Suricata **non venivano visualizzati** in Kibana perché:
1. ❌ Container `filebeat-suricata` non era in esecuzione
2. ❌ Logstash non riconosceva correttamente i log Suricata
3. ❌ I log finivano nell'indice `modsec-logs-*` invece di `suricata-logs-*`

## ✅ Soluzioni Applicate

### 1. Avviato Filebeat-Suricata
```bash
docker-compose up -d filebeat-suricata
```

### 2. Corretto Logstash Configuration
Modificato `logstash/logstash.conf` per riconoscere correttamente i log Suricata:
```ruby
# Prima (non funzionava):
if [source] =~ /suricata/ or [fields][log_type] == "suricata" {

# Dopo (corretto):
if [fields][log_type] == "suricata" or [log_source] == "suricata" or [source] =~ /suricata/ {
```

### 3. Riavviato Servizi
```bash
docker-compose restart logstash filebeat-suricata
```

---

## 📊 Verifica Funzionamento

### Controlla Indici Elasticsearch
```bash
curl "http://localhost:9200/_cat/indices?v" | grep suricata
```

Dovresti vedere:
```
yellow open suricata-logs-2025.12.10 ...
```

### Controlla Log Filebeat-Suricata
```bash
docker logs filebeat-suricata --tail 20
```

Dovresti vedere:
```
Starting input (ID: ...)
Input 'filestream' starting
```

### Controlla Log Logstash
```bash
docker logs logstash --tail 50 | grep suricata
```

Dovresti vedere:
```
"log_source" => "suricata"
```

---

## 🎯 Creare Data View in Kibana

Ora che gli indici vengono creati, crea la Data View:

1. Vai su **Stack Management** → **Data Views** → **Create data view**
2. **Name**: `Suricata Logs`
3. **Index pattern**: `suricata-logs-*`
4. **Timestamp field**: `@timestamp`
5. Clicca **Save**

### Data View Unificata (Opzionale)

Per vedere Suricata + ModSecurity insieme:
1. **Name**: `Security SOC`
2. **Index pattern**: `suricata-logs-*,modsec-logs-*`
3. **Timestamp**: `@timestamp`

---

## 🚨 Generare Alert Suricata

Suricata genera principalmente eventi "flow" (traffico normale). Per vedere alert:

### Test Scansione Porte
```bash
nmap -p 80,443,8080 172.21.0.1
```

### Test SYN Scan
```bash
nmap -sS -p 1-1000 172.21.0.1
```

### Test HTTP Attack (via WAF)
```bash
curl "http://localhost:8080/?id=1' UNION SELECT * FROM users--"
```

---

## ✅ Status Finale

- ✅ Filebeat-Suricata: **In esecuzione**
- ✅ Logstash: **Processa log Suricata correttamente**
- ✅ Elasticsearch: **Indici suricata-logs-* creati**
- ✅ Kibana: **Pronto per Data View**

---

## 📝 Note

- Gli eventi "flow" vengono indicizzati normalmente
- Gli eventi "alert" vengono indicizzati quando Suricata rileva minacce
- La dashboard funzionerà una volta creata la Data View

---

**Data Fix**: 2025-12-10
**Status**: ✅ **RISOLTO**

