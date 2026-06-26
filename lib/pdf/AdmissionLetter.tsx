import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 50 },
  schoolName: { fontSize: 20, fontWeight: "bold", color: "#1B3A5C", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#8B5E3C", textAlign: "center", marginBottom: 2 },
  title: { fontSize: 15, fontWeight: "bold", color: "#3D1902", textAlign: "center", marginTop: 25, marginBottom: 20, textDecoration: "underline" },
  body: { fontSize: 11, color: "#3D1902", lineHeight: 1.7, marginBottom: 10 },
  infoBox: { border: "1px solid #8B5E3C30", borderRadius: 6, padding: 12, marginVertical: 15, backgroundColor: "#FAF7F2" },
  row: { flexDirection: "row", marginBottom: 5 },
  label: { width: "40%", fontSize: 10, color: "#8B5E3C" },
  value: { width: "60%", fontSize: 10, fontWeight: "bold", color: "#3D1902" },
  signatureSection: { flexDirection: "row", justifyContent: "space-between", marginTop: 50 },
  sigBlock: { width: "45%" },
  sigLine: { borderTop: "1px solid #3D1902", marginTop: 35, paddingTop: 4, fontSize: 9, color: "#8B5E3C" },
  footer: { position: "absolute", bottom: 25, left: 50, right: 50, textAlign: "center", fontSize: 7, color: "#8B5E3C80", borderTop: "1px solid #8B5E3C20", paddingTop: 6 },
});

export default function AdmissionLetter({ registrationNumber, studentName, applyingClass, session, parentName, date }: {
  registrationNumber: string;
  studentName: string;
  applyingClass: string;
  session: string;
  parentName: string;
  date: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.schoolName}>The Benedictine Academy</Text>
        <Text style={styles.subtitle}>City, State, Nigeria</Text>
        <Text style={styles.subtitle}>admissions@benedictineacademy.edu.ng</Text>

        <Text style={styles.title}>OFFER OF PROVISIONAL ADMISSION</Text>

        <Text style={styles.body}>Dear {parentName},</Text>
        <Text style={styles.body}>
          We are pleased to offer {studentName} provisional admission into <Text style={{ fontWeight: "bold" }}>{applyingClass}</Text> for the <Text style={{ fontWeight: "bold" }}>{session}</Text> academic session.
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.row}><Text style={styles.label}>Registration Number:</Text><Text style={styles.value}>{registrationNumber}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Student Name:</Text><Text style={styles.value}>{studentName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Class:</Text><Text style={styles.value}>{applyingClass}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Session:</Text><Text style={styles.value}>{session}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{date}</Text></View>
        </View>

        <Text style={styles.body}>Conditions:</Text>
        <Text style={styles.body}>1. Payment of acceptance and school fees.</Text>
        <Text style={styles.body}>2. Submission of original documents for verification.</Text>
        <Text style={styles.body}>3. Compliance with school rules and regulations.</Text>

        <Text style={styles.body}>Congratulations and welcome to our community!</Text>
        <Text style={styles.body}>Yours faithfully,</Text>

        <View style={styles.signatureSection}>
          <View style={styles.sigBlock}><Text style={styles.sigLine}>Principal</Text></View>
          <View style={styles.sigBlock}><Text style={styles.sigLine}>Admission Officer</Text></View>
        </View>

        <View style={styles.footer}>
          <Text>Computer-generated document. The Benedictine Academy.</Text>
        </View>
      </Page>
    </Document>
  );
}