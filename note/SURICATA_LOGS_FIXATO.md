# ✅ Fix Log Suricata - RISOLTO

## 🎯 Problema Risolto

I log Suricata ora vengono indicizzati correttamente in Elasticsearch nell'indice `suricata-logs-*`.

---

## ✅ Soluzioni Applicate

### 1. Avviato Filebeat-Suricata
```bash
docker-compose up -d filebeat-suricata
```

### 2. Corretto Logstash Configuration
Modificato `logstash/logstash.conf` per riconoscere correttamente i log Suricata usando **tag**:

```ruby
# Aggiungi tag per identificare Suricata
if [fields][log_type] == "suricata" {
  mutate {
    add_tag => [ "suricata_log" ]
    add_field => { "log_source" => "suricata" }
  }
}

# Process Suricata logs
if "suricata_log" in [tags] {
  # ... processamento ...
}

# Output
if "suricata_log" in [tags] or [log_source] == "suricata" {
  elasticsearch {
    index => "suricata-logs-%{+YYYY.MM.dd}"
  }
}
```

### 3. Riavviato Servizi
```bash
docker-compose restart logstash filebeat-suricata
```

---

## 📊 Verifica Funzionamento

### ✅ Indici Elasticsearch
```bash
curl "http://localhost:9200/_cat/indices?v" | grep suricata
```

Risultato atteso:
```
yellow open suricata-logs-2025.12.10 ...
```

### ✅ Conta Documenti
```bash
curl "http://localhost:9200/suricata-logs-*/_count"
```

---

## 🎯 Creare Data View in Kibana

Ora che gli indici vengono creati, crea la Data View:

1. Vai su **Stack Management** → **Data Views** → **Create data view**
2. **Name**: `Suricata Logs`
3. **Index pattern**: `suricata-logs-*`
4. **Timestamp field**: `@timestamp`
5. Clicca **Save**

### Data View Unificata

Per vedere Suricata + ModSecurity insieme:
1. **Name**: `Security SOC`
2. **Index pattern**: `suricata-logs-*,modsec-logs-*`
3. **Timestamp**: `@timestamp`

---

## 📊 Tipi di Eventi Suricata

Suricata genera principalmente:
- **flow**: Eventi di traffico normale (maggior parte)
- **alert**: Alert di sicurezza quando rileva minacce
- **http**: Eventi HTTP
- **dns**: Eventi DNS
- **tls**: Eventi TLS

Per vedere più alert, genera traffico di attacco (vedi sotto).

---

## 🚨 Generare Alert Suricata

### Test Scansione Porte
```bash
nmap -p 80,443,8080 172.21.0.1
```

### Test SYN Scan
```bash
nmap -sS -p 1-1000 172.21.0.1
```

### Test HTTP Attack
```bash
curl "http://localhost:8080/?id=1' UNION SELECT * FROM users--"
```

---

## ✅ Status Finale

- ✅ Filebeat-Suricata: **In esecuzione**
- ✅ Logstash: **Processa log Suricata correttamente**
- ✅ Elasticsearch: **Indici suricata-logs-* creati** ✅
- ✅ Kibana: **Pronto per Data View**

---

## 📝 Note

- Gli eventi "flow" vengono indicizzati normalmente (traffico normale)
- Gli eventi "alert" vengono indicizzati quando Suricata rileva minacce
- La dashboard funzionerà una volta creata la Data View `suricata-logs-*`

---

**Data Fix**: 2025-12-10
**Status**: ✅ **RISOLTO E FUNZIONANTE**

