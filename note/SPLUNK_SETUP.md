# 🚀 Setup Splunk Enterprise nello Stack SOC

## 📋 Panoramica

Splunk Enterprise è stato aggiunto allo stack come **SIEM alternativo/complementare** a ELK.

### 🎯 Opzioni Disponibili

1. **Splunk Enterprise** (configurato) - Trial gratuito 60 giorni
2. **Splunk Universal Forwarder** - Gratuito, solo raccolta log
3. **Splunk Light** - Gratuito ma limitato (500MB/giorno)

## 🔧 Configurazione Attuale

### Servizio Docker

- **Container**: `splunk`
- **Porte**:
  - `8000`: Web UI (http://localhost:8000)
  - `8088`: HTTP Event Collector (HEC)
  - `9997`: TCP Input (per Logstash/Filebeat)

### Credenziali Default

- **Username**: `admin`
- **Password**: `changeme` ⚠️ **Cambia in produzione!**

### Indici Configurati

- `main`: Log generali
- `security`: Log di sicurezza (ModSecurity, Suricata)
- `modsecurity`: Log specifici ModSecurity
- `suricata`: Log specifici Suricata

## 🚀 Avvio

### 1. Avvia Splunk

```bash
cd "mini SOC"
docker-compose up -d splunk
```

### 2. Attendi che Splunk si avvii

```bash
docker logs splunk -f
```

Cerca: `Splunk started successfully`

### 3. Accedi alla Web UI

```
http://localhost:8000
```

- Username: `admin`
- Password: `changeme`

## 📊 Integrazione con lo Stack

### Opzione 1: File Monitor (Già Configurato)

Splunk monitora direttamente i volumi Docker:
- `/var/log/modsecurity/*.log` → Indice `modsecurity`
- `/var/log/suricata/*.json` → Indice `suricata`

### Opzione 2: TCP Input da Logstash

Configura Logstash per inviare log a Splunk:

```ruby
# Aggiungi a logstash/logstash.conf
output {
  # Output esistente a Elasticsearch
  elasticsearch { ... }
  
  # Nuovo output a Splunk
  tcp {
    host => "splunk"
    port => 9997
    codec => json_lines
  }
}
```

### Opzione 3: HTTP Event Collector (HEC)

Invia log via HTTP a Splunk:

```bash
# Abilita HEC in Splunk (via Web UI):
# Settings → Data Inputs → HTTP Event Collector → New Token

# Invia log via curl
curl -k https://localhost:8088/services/collector \
  -H "Authorization: Splunk YOUR_TOKEN" \
  -d '{"event": {"message": "Test log", "source": "test"}}'
```

## 🔍 Ricerche Splunk

### Log ModSecurity

```spl
index=modsecurity sourcetype=modsecurity
| stats count by client_ip, request_uri
```

### Log Suricata

```spl
index=suricata sourcetype=suricata_eve
| stats count by alert.signature, src_ip
```

### Tutti i Log di Sicurezza

```spl
index=security OR index=modsecurity OR index=suricata
| stats count by source, sourcetype
```

## 📝 Configurazione Avanzata

### Cambiare Password

```bash
docker exec -it splunk /opt/splunk/bin/splunk edit user admin -password NUOVA_PASSWORD -auth admin:changeme
```

### Abilitare SSL

Modifica `splunk/inputs.conf`:
```
[http]
enableSSL = 1
```

### Aggiungere Sorgenti Log

Modifica `splunk/inputs.conf` e aggiungi:
```
[monitor:///path/to/logs/*.log]
disabled = 0
sourcetype = custom_logs
index = main
```

## 🎓 Uso Didattico

### Vantaggi Splunk

- ✅ Interfaccia grafica intuitiva
- ✅ Ricerche SPL potenti
- ✅ App e dashboard predefinite
- ✅ Machine Learning integrato
- ✅ Correlazione eventi avanzata

### Confronto con ELK

| Feature | ELK Stack | Splunk |
|---------|-----------|--------|
| Costo | Gratuito | Trial 60gg, poi a pagamento |
| Scalabilità | Ottima | Ottima |
| Ricerche | KQL | SPL |
| Dashboard | Kibana | Splunk Dashboards |
| Machine Learning | X-Pack (a pagamento) | Incluso |

## ⚠️ Note Importanti

1. **Trial**: Splunk Enterprise trial dura 60 giorni
2. **Limiti**: Dopo il trial, funzionalità limitate
3. **Alternativa**: Usa Splunk Universal Forwarder (gratuito) per solo raccolta log
4. **Produzione**: Cambia password e configura SSL

## 🔗 Risorse

- [Splunk Documentation](https://docs.splunk.com/)
- [Splunk SPL Reference](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Commands)
- [Splunk Docker](https://splunk.github.io/docker-splunk/)

---

**Status**: ✅ Configurato e pronto all'uso
**Versione**: Splunk Enterprise (Trial)

