# Testausdokumentti — Study Planner / Dashboard

Tässä dokumentissa kuvataan projektin testausta. Testauksen tavoitteena on varmistaa, että sovelluksen perustoiminnot (CRUD, LocalStorage, dashboard) toimivat odotetusti.

---

## 1. Testauksen tavoite
- Varmistaa kurssien ja tehtävien CRUD-toimintojen oikeellisuus
- Tarkistaa, että tiedot säilyvät LocalStoragessa selaimen uudelleenkäynnistyksen jälkeen
- Varmistaa, että dashboardin tilastot ja graafit päivittyvät oikein
- Testata käyttöliittymän perustoimintoja manuaalisesti selaimessa

---

## 2. Testausmenetelmät
- **Manuaalinen testaus selaimessa (Chrome, Firefox)**
- **Yksikkötestauksen kaltainen tarkastelu** JavaScript-funktioille (esim. `addCourse`, `addTask`, `renderCourses`, `renderTasks`)
- **Käyttäjätestauksen simulointi** (syötetään dataa lomakkeisiin ja tarkistetaan, että UI päivittyy oikein)

---

## 3. Testitapaukset

### Kurssit (CRUD)
1. **Lisää kurssi**
   - Syötä nimi ja koodi → varmista että uusi kurssi ilmestyy listaan
   - Tarkista, että se tallentuu LocalStorageen
2. **Muokkaa kurssi**
   - Valitse kurssi → muuta nimeä/koodia → varmista että lista päivittyy
3. **Poista kurssi**
   - Paina poistonappia → varmista että kurssi katoaa listasta ja LocalStoragesta

### Tehtävät (CRUD)
1. **Lisää tehtävä**
   - Syötä nimi ja deadline → varmista että tehtävä näkyy listassa ja oikean kurssin alla
2. **Muokkaa tehtävä**
   - Vaihda otsikko ja deadline → tarkista, että päivitys onnistuu
3. **Poista tehtävä**
   - Varmista, että tehtävä katoaa listasta ja LocalStoragesta

### Dashboard
1. Kun kursseja ja tehtäviä lisätään, **graafit päivittyvät reaaliaikaisesti**
2. Jos poistaa kaikki tehtävät, dashboard näyttää nollat

---

## 4. Yhteenveto
Testauksen perusteella sovelluksen keskeiset toiminnot (kurssien ja tehtävien CRUD, LocalStorage, dashboardin päivitys) toimivat odotetusti. Jatkossa tullaan testaamaan myös:
- Kalenterinäkymän toiminta
- Drag & Drop -ominaisuudet
- JSON-vienti/tuonti

---