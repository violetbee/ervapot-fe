import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PDFImage,
  Font,
} from "@react-pdf/renderer";
import { numberSlicer } from "@/utils/tools";
import { CalculateSalary } from "./employee/employees";

Font.register({
  family: "Geist",
  src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Geist",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 30,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 800,
  },
  tableHeader: {
    display: "flex",
    gap: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 800,
  },

  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: "left",
    fontSize: 9,
  },
  tableHeaderCell: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: "left",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  ledgerInfoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
  },
  ledgerInfoBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px",
    marginBottom: "16px",
  },
  ledger: {
    fontSize: 10,
    fontWeight: 900,
  },
  infoTab: {
    flexDirection: "row",
    gap: 4,
  },
});

type DocumentProps = {
  title: string;
  salary: CalculateSalary & { salary: number };
};

export const SalaryDocumentGenerator = ({ title, salary }: DocumentProps) => {
  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Header */}
        <View style={styles.header}>
          <PDFImage style={styles.logo} src="/images/ervapot-logo.png" />
          <Text style={styles.companyName}>ervapot</Text>
          <Text>
            {new Date().toLocaleDateString()} -{" "}
            {new Date().toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.companyName}>{title}</Text>
        </View>
        <View style={styles.table}>
          <View
            style={[
              styles.tableRow,
              {
                backgroundColor: "#2a2e2b",
                color: "white",
                fontWeight: "semibold",
              },
            ]}
          >
            <Text style={[styles.tableHeaderCell, { paddingLeft: 5 }]}>
              Başlangıç Tarih
            </Text>
            <Text style={[styles.tableHeaderCell]}>Bitiş Tarihi</Text>
            <Text style={styles.tableHeaderCell}>İsim - Soy İsim</Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { textAlign: "right", paddingRight: 5 },
              ]}
            >
              Maaş
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text
              style={[styles.tableCell, { textAlign: "left", paddingLeft: 5 }]}
            >
              {salary.startDate?.toLocaleDateString()}
            </Text>
            <Text style={[styles.tableCell, { textAlign: "left" }]}>
              {salary.endDate?.toLocaleDateString()}
            </Text>
            <Text style={[styles.tableCell, { textAlign: "left" }]}>
              {salary.name + " " + salary.surname}
            </Text>

            <Text
              style={[
                styles.tableCell,
                { textAlign: "right", paddingRight: 5 },
              ]}
            >
              {numberSlicer(salary.salary)} ₺
            </Text>
          </View>
          <View
            style={[
              styles.tableRow,
              {
                justifyContent: "flex-end",
              },
            ]}
          >
            <View
              style={[
                styles.tableCell,
                {
                  textAlign: "right",
                  borderTop: "1px solid black",
                  flexDirection: "column",
                  gap: 5,
                  fontSize: 11,
                },
              ]}
            >
              {/* <Text>Borç: {numberSlicer(debts)} ₺</Text>
              <Text>Alacak: {numberSlicer(receivements)} ₺</Text>
              <Text>Bakiye: {numberSlicer(ledger.balance)} ₺</Text> */}
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Sayfa 1</Text>
      </Page>
    </Document>
  );
};
