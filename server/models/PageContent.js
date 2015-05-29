var mongoose = require('mongoose');

var pageContent = mongoose.Schema({
  pageId: {type:String, required:'{PATH} is required!'},
  sectionTitle: String,
  text: {type:String, required:'{PATH} is required!'},
  position: Number
});
var PageContent = mongoose.model('PageContent', pageContent);

function createDefaultPageContent() {
  PageContent.find({}).exec(function(err, collection) {
   
    if(collection.length === 0) {
      PageContent.create({pageId: 'footer', sectionTitle: 'GODZINY OTWARCIA', 
        text: 'Pn, Sr, Pt: 10.00 - 18.00\nNd: 9.00 - 14.00\nWt, Cz, So: Nieczynne', position: 0});
      PageContent.create({pageId: 'footer', sectionTitle: 'ADRES', 
        text: 'Strzelnica\nul. Zawodników 1\nGdańsk 80-729\nklub@kssenior-gdansk.com\nTel: 881-444-452', position: 0});
      PageContent.create({pageId: 'location', sectionTitle: 'LOKALIZACJA', 
        text: 'https://www.google.com/maps/embed?pb=!1m18!1m8!1m3!1d9301.657440974026!2d18.66766415986781!3d54.34965854257815!3m2!1i1024!2i768!4f13.1!4m7!1i0!3e0!4m3!3m2!1d54.3467007!2d18.6722847!4m0!5e0!3m2!1spl!2spl!4v1427534684402', position: 0});
      PageContent.create({pageId: 'charges', sectionTitle: 'Wpisowe', 
        text: 'Dla nowoprzyjętych członków opłata wynosi 200,- zł. (młodzież do lat 20-stu wpisowego nie wpłaca)', position: 0});
      PageContent.create({pageId: 'charges', sectionTitle: 'Roczna składka członkowska wynosi:', 
        text: '- młodzież do lat 20-stu opłaca 150,- zł\n- pozostali (powyżej lat 20-stu) opłacają 200,- zł.\nSkładki członkowskie można opłacać w 2-ch ratach: za pierwsze pół-rocze (do końca marca każdego roku) oraz za drugie półrocze (do końca września każdego roku).', position: 0});
      PageContent.create({pageId: 'charges', sectionTitle: 'Opłaty', 
        text: '- opłata za egzamin na Patent strzelecki wynosi 400,- zł (młodzież do lat 18-stu egzaminu na Patent nie składa)\n- opłata za Licencję strzelecką PZSS wynosi 50,- zł + opłata pocztowa 2,50 zł\n- opłata za zawody (1 osobostart) wynosi 30,- zł.', position: 0});
      PageContent.create({pageId: 'about', sectionTitle: 'Zarząd Klubu.', 
        text: 'Prezes Klubu: Szylberg Henryk,\nSekretarz Klubu: Andrzejewski Wiesław,\nSkarbnik Klubu: Lewandowski Wojciech,\nCzłonkowie Zarządu: Meller Katarzyna, Jakubaszek Jan, Łukowicz Henryk.\nKierownik Klubu: Leszek Tylak.', position: 0});
      PageContent.create({pageId: 'about', sectionTitle: 'Komisja Rewizyjna.', 
        text: 'Przewodniczący: Frańczak Marek,\nSekretarz: Tobiszewski Jarosław,\nCzłonek Komisji: Kwapisiewicz Agnieszka.', position: 0});
      PageContent.create({pageId: 'about', sectionTitle: 'Władze klubu', 
        text: 'W latach 1952-1960 Kierownikiem Sekcji ZW LOK w Gdańsku (tak się wówczas nazywał Klub) był P. A. Magnuszewicz.\nW latach 1961 -1993 Klubem kierował p. Krzysztof Osiński.\nOd kwietnia 1994 r. do 7 kwietnia 2012 r. Kierownikiem Klubu był p. Jan Kubiak.\nObecnym Kierownikiem Klubu od maja 2012 r. jest p. Leszek Tylak.\nWielokrotnym Prezesem Klubu był p. Zbigniew Olszewski (przez 3 kadencje – 1995-2000, 2000-2005 oraz 2005-2010 r.)', position: 0});
      PageContent.create({pageId: 'about', sectionTitle: 'Krórka historia Klubu', 
        text: 'W latach 1952 – 1995 istniała Sekcja strzelecka Z.W.LOK w Gdańsku.Nazwę ”SENIOR” LOK Gdańsk Klub przyjął na zebraniu Sprawozdawczo-wyborczym członków w grudniu 1995 r. Decyzją Urzędu Miejskiego w Gdańsku z dnia 28 marca 2001 r.dopuszczono do użytkowania strzelnicę sportową z odkrytą osią 50-cio metrową 9-cio stanowiskową do broni kulowej (kaliber do 9mm pistoletowy) oraz osią krytą 15-sto metrową 4-ro stanowiskową do broni pneumatycznej (kaliber 4,5mm) zlokalizowaną w Gdańsku przy ul.Kopernika 16. W dniu 9 czerwca 2002 r.Polski Związek Strzelectwa Sportowego w Warszawie przyznał Klubowi ”SENIOR” LOK Gdańsk Licencję Nr LK-30/02/R. W roku 2005 uruchomiono dodatkowo 2-gą oś krytą 10-cio metrową 6-cio stanowiskową do strzelań z broni pneumatycznej (karabin i pistolet). Klub posiada Sekcję młodzieżową (strzelectwo sportowe oraz sporty obronne i letni biathlon) jak również Sekcję Grupy Powszechnej (strzelectwo sportowe). Od roku 2005 Klub pomaga co rok Gminie Trąbki Wielkie w organizacji Mistrzostw Gminy w strzelaniu z broni kulowej i pneumatycznej. W historii naszego Klubu biathlonista Przemysław Tymczuk był w latach 1994-1996 członkiem Kadry Narodowej Letniego Biathlonu a Medias Grzegorz w latach 2007-2008 był członkiem Kadry Narodowej Juniorów w pistolecie. Co rok w miesiącu wrześniu Klub ogłasza nabór nowych członków w wieku od lat 10-ciu.', position: 0});
      PageContent.create({pageId: 'join', sectionTitle: 'Deklaracja', 
        text: '- z wypełnioną Deklaracją zgłosić się na posiedzenie Zarządu Klubu,\n- po przyjęciu do Klubu opłacić obowiązujące składki,\n- opłacić Legitymację członkowską PZSS – 32,50 zł', position: 0});
      PageContent.create({pageId: 'join', sectionTitle: 'Egzamin', 
        text: '- przystąpić do egzaminu na PATENT STRZELECKI PZSS (test pisemny oraz praktyczny – strzelenie z pistoletu lub karabinka sportowego) wniosek o w/w Patent po wypełnieniu podpisuje lekarz medycyny sportowej. Koszt egzaminu wynosi 400,- zł.', position: 0});
      PageContent.create({pageId: 'join', sectionTitle: 'Licencja strzelecka PZSS', 
        text: '- po otrzymaniu Patentu wysyłamy kolejny wniosek do PZSS-u o Licencję strzelecką PZSS (koszt 50zł +/- opłata pocztowa). Na Wniosku należy również otrzymać podpis lekarza medycyny sportowej o zdolności uprawiania strzelectwa sportowego.\n- po otrzymaniu Licencji należy brać udział w treningach i zawodach strzeleckich.', position: 0});
    }

  });
}

exports.createDefaultPageContent = createDefaultPageContent;

