// Alphamarr - reception des sauvegardes et ecriture dans Google Drive.
// Deploiement : Apps Script > Deployer > Nouveau deploiement > Application web
// Executer en tant que : Moi | Acces : Tout le monde (avec le lien)
// Copiez l'URL de deploiement et collez-la dans l'app (bouton "Sauvegarder sur Drive").

var DOSSIER = 'Alphamarr - Sauvegardes';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var dossier = obtenirDossier_();
  var nom = 'alphamarr-' + Utilities.formatDate(new Date(), 'Africa/Nouakchott', 'yyyy-MM-dd_HHmm') + '.json';
  dossier.createFile(nom, JSON.stringify(data, null, 2), MimeType.PLAIN_TEXT);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, fichier: nom }))
    .setMimeType(ContentService.MimeType.JSON);
}

function obtenirDossier_() {
  var it = DriveApp.getFoldersByName(DOSSIER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(DOSSIER);
}
