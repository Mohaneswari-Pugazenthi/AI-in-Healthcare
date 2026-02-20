from reportlab.pdfgen import canvas

def create_pdf(filename):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "Medical Report")
    c.drawString(100, 730, "Patient ID: P001")
    c.drawString(100, 710, "Date: 2024-03-15")
    
    c.drawString(100, 680, "Test Results:")
    c.drawString(100, 660, "Creatinine: 1.5 mg/dL")
    c.drawString(100, 640, "Glucose: 150 mg/dL")
    c.drawString(100, 620, "BP: 140/90 mmHg")
    c.drawString(100, 600, "Hemoglobin: 12.0 g/dL")
    
    c.save()

if __name__ == "__main__":
    create_pdf("sample_report.pdf")
    print("Created sample_report.pdf")
