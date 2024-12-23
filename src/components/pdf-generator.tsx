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
import { GetLedgerType } from "@/types/ledger";
import { GetTransactionType } from "./ledger/id/ledger-detail";

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
    textAlign: "center",
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
  ledger: GetLedgerType;
  items?: Array<any>;
};

const transactionType = {
  ADD_DEBT: "BORÇ",
  CC_RECEIVE_PAYMENT: "K.K. TAHSİLAT",
  RECEIVE_PAYMENT: "TAHSİLAT",
};

export const DocumentGenerator = ({ title, ledger, items }: DocumentProps) => {
  const [debts, receivements] = (items as GetTransactionType[])?.reduce(
    (acc, curr) => {
      if (curr.transactionType === "ADD_DEBT") {
        acc[0] += curr.paymentAmount;
      } else {
        acc[1] -= curr.paymentAmount;
      }
      return acc;
    },
    [0, 0]
  );

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
        <View style={styles.ledgerInfoTop}>
          <View style={styles.infoTab}>
            <Text style={styles.ledger}>Unvan:</Text>
            <Text style={styles.ledger}>{ledger.name}</Text>
          </View>
          <View style={styles.infoTab}>
            <Text style={styles.ledger}>Telefon:</Text>
            <Text style={styles.ledger}>{ledger.phone}</Text>
          </View>
          <View style={styles.infoTab}>
            <Text style={styles.ledger}>Bakiye:</Text>
            <Text style={styles.ledger}>{numberSlicer(ledger.balance)} ₺</Text>
          </View>
        </View>
        <View style={styles.ledgerInfoBottom}>
          <View style={styles.infoTab}>
            <Text style={styles.ledger}>Adres:</Text>
            <Text style={styles.ledger}>{ledger.address}</Text>
          </View>
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
            <Text style={[styles.tableHeaderCell]}>Tarih</Text>
            <Text style={[styles.tableHeaderCell, { maxWidth: 40 }]}>
              İşlem No
            </Text>
            <Text style={styles.tableHeaderCell}>Tür</Text>
            <Text style={[styles.tableHeaderCell, { minWidth: 150 }]}>
              Açıklama
            </Text>
            <Text style={styles.tableHeaderCell}>Tutar</Text>
            <Text style={styles.tableHeaderCell}>Bakiye</Text>
          </View>
          {items
            ?.sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            })
            .map((item) => {
              const date = new Date(item.createdAt);
              return (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { textAlign: "center" }]}>
                    {date.toLocaleDateString()}
                  </Text>
                  <Text style={[styles.tableCell, { maxWidth: 40 }]}>
                    {item.id}
                  </Text>
                  <Text style={styles.tableCell}>
                    {
                      transactionType[
                        item.transactionType as keyof typeof transactionType
                      ]
                    }
                  </Text>
                  <Text style={[styles.tableCell, { minWidth: 150 }]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.tableCell, { textAlign: "right" }]}>
                    {numberSlicer(item.paymentAmount)} ₺
                  </Text>
                  <Text style={[styles.tableCell, { textAlign: "right" }]}>
                    {numberSlicer(item.balance)} ₺
                  </Text>
                </View>
              );
            })}
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
              <Text>Borç: {numberSlicer(debts)} ₺</Text>
              <Text>Alacak: {numberSlicer(receivements)} ₺</Text>
              <Text>Bakiye: {numberSlicer(ledger.balance)} ₺</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Sayfa 1</Text>
      </Page>
    </Document>
  );
};
