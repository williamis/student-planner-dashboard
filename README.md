# Student Planner / Study Dashboard

Web-pohjainen opiskelijoille suunnattu suunnitteluohjelma, jonka tarkoitus on auttaa hallitsemaan kursseja, tehtäviä ja deadlineja. Sovelluksessa opiskelija voi seurata edistymistään ja aikatauluttaa opiskeluaan paremmin.  

Projektin aikana toteutetaan suunnittelu-, ohjelmointi- ja projektinhallintatehtäviä, ja kehitystä tehdään ketterästi (Scrum / Kanban). Työ dokumentoidaan GitHubin commit-historiaan sekä Trellon backlogiin.

---

# Projektin tavoitteet
- Harjoitella HTML, CSS ja JavaScript -toteutusta käytännön projektissa  
- Toteuttaa kurssinhallinta (CRUD-toiminnot)  
- Rakentaa kalenterinäkymä ja dashboard, jossa näkyy tilastoja (tehdyt/tekemättömät tehtävät, kuormitus kurssittain)  
- Tallentaa tiedot pysyvästi selaimen LocalStorageen / IndexedDB:hen  
- Käyttää projektinhallintaa (Scrum/Kanban) Trellon avulla  
- Tuottaa suunnitteludokumentteja (UML-kaavioita, käyttäjätarinoita, backlog)  
- Harjoitella versionhallintaa GitHubissa (useita pieniä committeja, ei vain iso lopullinen commit)  
- Perehtyä testauksen ja DevOpsin perusasioihin  

---

# Sprintti 1 (perustoiminnallisuudet)
- Kurssilista (CRUD: lisää, muokkaa, poista, näytä kurssi)  
- Tiedon tallennus LocalStorageen  
- Yksinkertainen HTML-rakenne ja perus-CSS-tyylit  

# Sprintti 2 (tehtävät ja kalenteri)
- Tehtävien lisäys kursseille (otsikko, deadline, tila)  
- Tehtävien merkitseminen tehdyksi / kesken  
- Deadlinejen näyttö kuukausikalenterissa  
- Drag-and-drop tehtävän siirto kalenterissa  

# Sprintti 3 (dashboard ja lisäominaisuudet)
- Dashboard-näkymä, jossa tilastot:  
  - tehty vs tekemättä -graafi  
  - tehtävien määrä per kurssi -kaavio  
- Käyttöliittymän parantaminen (teema: vaalea/pimeä tila)  
- Mahdollisuus viedä/tuoda data JSON-tiedostona (backup)  

---

# Projektinhallinta
Backlog ja käyttäjätarinat hallitaan Trellossa:  
[https://trello.com/invite/b/68df94690e6cf3430fefb32d/ATTIfa2783b8afdcea7b5d609cae40b38d877D4AAEF1/study-planner-study-dashboard]  

Projektissa käytetään Kanban/Scrum-tyyliä. Jokainen toiminnallisuus etenee Backlog → To Do (Sprint) → In Progress → Done.  

---

# Teknologiat
- HTML, CSS, JavaScript  
- LocalStorage / IndexedDB  
- Git & GitHub (useita pieniä committeja)  
- Trello (Scrum / Kanban)  
- UML-kaaviot (Visual Paradigm, draw.io tms.)  
- Projektisuunnittelun dokumentaatio  

---

# Testaus ja DevOps
- Yksikkötestit JavaScript-funktioille (esim. laskenta ja suodatus)  
- Manuaalinen testaus selaimessa (UI ja käyttöliittymä)  
- GitHub commit-historia dokumentoi kehityksen vaiheittain  
