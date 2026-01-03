# Riepilogo Fix Suricata - Kali Linux

## ✅ Modifiche Completate

### 1. Downgrade a Suricata 7.0.8
- ✅ Modificato `suricata/Dockerfile` per usare `jasonish/suricata:7.0.8` invece di `latest` (8.0.2)
- ✅ Suricata 7.0.8 è più stabile e ha meno problemi con i runmode

### 2. Configurazione YAML Semplificata
- ✅ `suricata/suricata-simple.yaml` - Rimossa sezione runmode/af-packet per evitare conflitti
- ✅ Suricata rileva automaticamente il modo corretto da `-i eth0`

### 3. Docker Compose Ottimizzato
- ✅ Configurato Docker bridge network (più stabile di host mode)
- ✅ Aggiunto `user: root` per permettere scrittura nei log
- ✅ Configurato `-i eth0` per interfaccia Docker bridge
- ✅ Capacità NET_ADMIN, NET_RAW, SYS_NICE abilitate

### 4. Dockerfile Migliorato
- ✅ Aggiunta creazione directory log con permessi corretti
- ✅ Commenti esplicativi aggiunti

## ⚠️ Problema Residuo

Suricata si riavvia ancora a causa dell'errore:
```
Error: runmodes: The custom type "pcap" doesn't exist for this runmode type "AF_PACKET_DEV"
```

**Causa**: Quando Suricata vede `-i eth0` nella command line, cerca automaticamente di usare AF_PACKET_DEV mode, ma c'è ancora un riferimento nascosto a "pcap" che causa il conflitto.

## 🔧 Soluzioni da Provare

### Soluzione 1: Rimuovere completamente -i dalla command line
Provare a configurare l'interfaccia solo nel YAML:
```yaml
# Nel suricata-simple.yaml, aggiungere:
runmode: pcap-dev
runmode-custom: autofp

pcap:
  - interface: eth0
    checksum-checks: auto
```

E nel docker-compose.yml rimuovere `-i eth0` dalla command line.

### Soluzione 2: Usare Suricata senza Docker
Installare Suricata direttamente su Kali Linux invece di usare Docker:
```bash
sudo apt install suricata
```

### Soluzione 3: Usare un'altra immagine Docker
Provare altre immagini Docker di Suricata che potrebbero avere configurazioni diverse.

## 📊 Stato Attuale

- ✅ Suricata 7.0.8 buildato correttamente
- ✅ Configurazione YAML semplificata
- ✅ Docker Compose configurato correttamente
- ✅ Log inizializzati (`eve.json`, `fast.log`)
- ⚠️ Suricata si riavvia ancora a causa del conflitto runmode

## 📝 File Modificati

1. `suricata/Dockerfile` - Downgrade a 7.0.8, permessi log
2. `suricata/suricata-simple.yaml` - Configurazione minimale
3. `docker-compose.yml` - Bridge network, user root, -i eth0

## 🎯 Prossimi Passi

1. Provare Soluzione 1 (configurare interfaccia solo nel YAML)
2. Se non funziona, considerare Soluzione 2 (installazione diretta)
3. Documentare la soluzione finale funzionante

## 💡 Note

Il problema principale è che Suricata 8.0.2 ha cambiato significativamente la gestione dei runmode. Anche Suricata 7.0.8 ha problemi simili quando si usa `-i` nella command line con Docker. Potrebbe essere necessario un approccio completamente diverso per la configurazione.

