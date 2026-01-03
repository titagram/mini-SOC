# Status Fix Suricata - Kali Linux

## Problema Identificato

Suricata 8.0.2 su Kali Linux con Docker mostra l'errore:
```
Error: runmodes: The custom type "pcap" doesn't exist for this runmode type "AF_PACKET_DEV"
```

## Modifiche Applicate

### 1. Configurazione YAML (`suricata/suricata-simple.yaml`)
- ✅ Rimossa sezione `runmode` e `af-packet` per evitare conflitti
- ✅ Configurazione minimale che lascia a Suricata il rilevamento automatico

### 2. Docker Compose (`docker-compose.yml`)
- ✅ Configurato `network_mode: host` per Kali Linux
- ✅ Specificato `-i wlan0` nella command line
- ✅ Aggiunti commenti esplicativi

### 3. Dockerfile (`suricata/Dockerfile`)
- ✅ Aggiornato con commenti

## Problema Root Cause

Suricata 8.0.2 ha cambiato la gestione dei runmode. Quando si usa `-i` nella command line con `network_mode: host`, Suricata cerca automaticamente di usare `AF_PACKET_DEV` mode, ma c'è ancora un riferimento a "pcap" da qualche parte che causa il conflitto.

## Soluzioni Possibili

### Opzione 1: Usare versione precedente di Suricata
Modificare il Dockerfile per usare Suricata 7.x invece di 8.0.2:
```dockerfile
FROM jasonish/suricata:7
```

### Opzione 2: Usare configurazione esplicita PCAP_DEV
Forzare Suricata a usare PCAP_DEV mode esplicitamente nella command line:
```yaml
command:
  - --runmode=pcap-dev-autofp
  - -c
  - /etc/suricata/suricata.yaml
  - -i
  - wlan0
```

### Opzione 3: Rimuovere network_mode: host
Tornare a Docker bridge network e usare solo traffico interno:
```yaml
networks:
  - soc-network
# Rimuovere network_mode: host
```

## Stato Attuale

- ✅ Configurazione aggiornata per Kali Linux
- ✅ File modificati correttamente
- ⚠️ Suricata si riavvia ancora a causa del conflitto runmode
- ⚠️ Necessario testare una delle soluzioni sopra

## Prossimi Passi

1. Testare Opzione 1 (downgrade a Suricata 7.x)
2. Se non funziona, testare Opzione 2 (runmode esplicito)
3. Se necessario, usare Opzione 3 (bridge network)

## File Modificati

- `suricata/suricata-simple.yaml` - Configurazione minimale
- `docker-compose.yml` - network_mode: host + -i wlan0
- `suricata/Dockerfile` - Commenti aggiornati

## Note

Suricata 8.0.2 ha cambiato significativamente la gestione dei runmode rispetto alle versioni precedenti. Potrebbe essere necessario aggiornare l'approccio di configurazione o usare una versione precedente più stabile.

