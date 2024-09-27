function telechargerPDF() {
    const element = document.querySelector('.container');
    const options = {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY
    };

    html2canvas(element, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const numeroFacture = document.getElementById('invoice-number').textContent;
        pdf.save(`facture_CAMI_${numeroFacture}.pdf`);
    });
}