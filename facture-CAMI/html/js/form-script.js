document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('facture-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            genererFacture();
        }
    });
});

/**
 * Ensure data are correctly inputed
 */
function validateForm() {
    const heures = document.getElementById('heures').value;
    const tarif = document.getElementById('tarif').value;
    const date = document.getElementById('date').value;

    if (heures <= 0 && heures >= 500) {
        alert("Le nombre d'heures doit être compris entre 0 et 100.");
        return false;
    }

    if (tarif <= 0 && tarif >= 100) {
        alert("Le tarif horaire doit être compris entre 0 et 100.");
        return false;
    }

    if (!date) {
        alert("Veuillez sélectionner une date de fin de prestation.");
        return false;
    }

    return true;
}

function genererFacture() {
    const heures = document.getElementById('heures').value;
    const tarif = document.getElementById('tarif').value;
    const date = new Date(document.getElementById('date').value);

    const montantHT = heures * tarif;
    const tva = montantHT * 0.21;
    const total = montantHT + tva;

    const mois = date.toLocaleString('fr-FR', { month: 'long' });
    const annee = date.getFullYear();

    const numeroFacture = `${annee.toString().slice(-2)}0${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const dateFacture = date.toLocaleDateString('fr-FR');

    // Ajout de la logique pour "d'" devant avril, août et octobre
    const moisAvecApostrophe = ['avril', 'août', 'octobre'];
    const prefixeMois = moisAvecApostrophe.includes(mois.toLowerCase()) ? "d'" : "de ";

    const factureHTML = genererHTMLFacture(numeroFacture, dateFacture, prefixeMois, mois, annee, montantHT, tva, total);

    const newWindow = window.open();
    newWindow.document.write(factureHTML);
    newWindow.document.close();
}

function genererHTMLFacture(numeroFacture, dateFacture, prefixeMois, mois, annee, montantHT, tva, total) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture CAMI - ${numeroFacture}</title>
    <link rel="stylesheet" href="style/facture-style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                <div class="logo">CAMI SRL</div>
                <p>
                    Rue des Iris 2, bte 103<br>
                    1640 Rhode-saint-Genèse<br>
                    Belgique<br>
                    Tél : 0477/38.12.81<br>
                    T.V.A : <span class="highlight">BE 0534.817.715</span><br>
                    Coordonnées bancaires KBC: <span class="highlight">337-310316679-46</span>
                </p>
            </div>
            <div>
                <h1>FACTURE</h1>
                <p><strong>N° :</strong> <span id="invoice-number" class="highlight">${numeroFacture}</span></p>
                <p><strong>Date :</strong> <span id="invoice-date" class="highlight">${dateFacture}</span></p>
            </div>
        </div>
        <div class="client-info">
            <h2>Facturé à :</h2>
            <p>
                <strong>ROYALBEL</strong><br>
                Chaussée de Mons, 457<br>
                1070, Bruxelles<br>
                Tél : 02/376.19.11<br>
                T.V.A : <span class="highlight">BE 0670.923.957</span>
            </p>
        </div>
        <table>
            <tr>
                <th>Description</th>
                <th>Heures</th>
                <th>Montant hors T.V.A</th>
                <th>T.V.A 21%</th>
                <th>Total</th>
            </tr>
            <tr>
                <td>Prestation du mois ${prefixeMois}${mois} ${annee}</td>
                <td></td>
                <td>${montantHT.toFixed(2)} €</td>
                <td>${tva.toFixed(2)} €</td>
                <td>${total.toFixed(2)} €</td>
            </tr>
        </table>
        <div class="total">
            <p>Montant hors T.V.A : <strong>${montantHT.toFixed(2)} €</strong></p>
            <p>T.V.A (21%) : <strong>${tva.toFixed(2)} €</strong></p>
            <h3>Total à payer : <span id="total-ttc" class="highlight">${total.toFixed(2)} €</span></h3>
        </div>
        <div class="footer">
            
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="js/facture-script.js"></script>
    <button onclick="telechargerPDF()" class="download-btn">Télécharger PDF</button>
</body>
</html>
    `;
}