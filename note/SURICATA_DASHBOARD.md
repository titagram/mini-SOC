# 📊 Dashboard Suricata - Guida Visualizzazione Log

## ❓ Suricata ha una Dashboard?

**No**, Suricata **non ha una dashboard web integrata** ed è **normale che non esponga porte**.

Suricata è un **IDS/IPS passivo** che:
- ✅ Analizza il traffico di rete
- ✅ Genera log strutturati (EVE JSON, Fast log)
- ❌ **NON** ha interfaccia web propria
- ❌ **NON** espone porte HTTP/HTTPS

---

## 🎯 Come Visualizzare i Log Suricata

Hai **2 opzioni** per visualizzare i log di Suricata:

### 1. ✅ Kibana (Già Configurato)

**Kibana è già integrato** nel tuo Mini SOC e visualizza i log Suricata.

#### Accesso
- **URL**: http://localhost:5601
- **Porta**: 5601 (già esposta)

#### Configurazione

1. **Crea Data View per Suricata**:
   - Vai su **Stack Management** → **Data Views** → **Create data view**
   - **Name**: `Suricata Logs`
   - **Index pattern**: `suricata-logs-*`
   - **Timestamp field**: `@timestamp`
   - Clicca **Save**

2. **Visualizza Log in Discover**:
   - Vai su **Analytics** → **Discover**
   - Seleziona data view **Suricata Logs**
   - Imposta time range (es. "Last 15 minutes")

3. **Query Utili**:
   ```kql
   # Tutti gli alert Suricata
   log_source: suricata AND alert.signature: *
   
   # Scansioni rilevate
   log_source: suricata AND event_type: alert
   
   # DDoS rilevati
   log_source: suricata AND alert.category: "Attempted Denial of Service"
   ```

#### Vantaggi Kibana
- ✅ Già configurato e funzionante
- ✅ Visualizza log da **tutte le sorgenti** (Suricata + WAF)
- ✅ Dashboard personalizzabili
- ✅ Query avanzate (KQL)
- ✅ Correlazione eventi multi-sorgente

---

### 2. 🆕 EveBox (Opzionale - Dashboard Dedicata)

**EveBox** è una dashboard web dedicata specificamente per Suricata.

#### Caratteristiche
- ✅ Interfaccia web dedicata per Suricata
- ✅ Visualizzazione alert in tempo reale
- ✅ Filtri avanzati per eventi
- ✅ Statistiche e grafici
- ✅ Ricerca full-text nei log

#### Installazione (Opzionale)

Se vuoi aggiungere EveBox, aggiungi questo servizio al `docker-compose.yml`:

```yaml
  ###########################################################
  # EveBox - Dashboard Web per Suricata
  ###########################################################
  evebox:
    image: jasonish/evebox:latest
    container_name: evebox
    depends_on:
      - suricata
    volumes:
      - suricata-logs:/var/log/suricata:ro
    ports:
      - "5636:5636"
    environment:
      - EVEBOX_DATA_DIRECTORY=/var/lib/evebox
      - EVEBOX_ELASTICSEARCH_URL=http://elasticsearch:9200
      - EVEBOX_INDEX_PATTERN=suricata-logs-*
    networks:
      - soc-network
    restart: unless-stopped
```

#### Accesso EveBox
- **URL**: http://localhost:5636
- **Porta**: 5636

---

## 📋 Confronto: Kibana vs EveBox

| Caratteristica | Kibana | EveBox |
|----------------|--------|--------|
| **Dashboard dedicata Suricata** | ❌ Generica | ✅ Sì |
| **Visualizzazione multi-sorgente** | ✅ Sì | ❌ Solo Suricata |
| **Già configurato** | ✅ Sì | ❌ Da aggiungere |
| **Interfaccia intuitiva** | ⚠️ Media | ✅ Ottima |
| **Query avanzate** | ✅ KQL | ⚠️ Limitata |
| **Porta esposta** | ✅ 5601 | ⚠️ 5636 (se aggiunto) |

---

## 🎯 Raccomandazione

### Per il Mini SOC Attuale

**Usa Kibana** (già configurato):
- ✅ Tutti i log in un unico posto
- ✅ Correlazione Suricata + WAF
- ✅ Dashboard personalizzabili
- ✅ Nessuna configurazione aggiuntiva

### Se Vuoi Dashboard Dedicata

**Aggiungi EveBox** solo se:
- Vuoi una dashboard **solo per Suricata**
- Preferisci un'interfaccia più semplice
- Vuoi visualizzare **solo** gli alert Suricata

---

## 🔍 Verifica Log Suricata

### Via Command Line

```bash
# Log EVE JSON (formato strutturato)
docker exec suricata tail -f /var/log/suricata/eve.json

# Log Fast (alert rapidi)
docker exec suricata tail -f /var/log/suricata/fast.log

# Statistiche Suricata
docker exec suricata suricatasc -c "stats"
```

### Via Kibana

1. Vai su http://localhost:5601
2. **Discover** → Seleziona **Suricata Logs**
3. Visualizza eventi in tempo reale

---

## 📊 Dashboard Kibana Consigliate

### 1. Alert Suricata nel Tempo
- Tipo: **Line chart**
- X: `@timestamp`
- Y: Count di eventi
- Filtro: `log_source: suricata AND event_type: alert`

### 2. Top Alert Categories
- Tipo: **Pie chart**
- Campo: `alert.category.keyword`
- Filtro: `log_source: suricata`

### 3. Top Source IPs
- Tipo: **Bar chart**
- Campo: `src_ip.keyword`
- Filtro: `log_source: suricata AND event_type: alert`

---

## ✅ Conclusione

**Suricata non ha dashboard propria** → È normale!

**Usa Kibana** per visualizzare i log:
- ✅ Già configurato
- ✅ Porta 5601 esposta
- ✅ Log Suricata + WAF insieme
- ✅ Dashboard personalizzabili

**EveBox** è opzionale se vuoi una dashboard dedicata solo per Suricata.

---

**Data**: 2025-12-10
**Status**: Kibana già configurato e funzionante ✅

